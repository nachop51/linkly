import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import type { Cookie } from 'elysia'
import { rateLimit } from 'elysia-rate-limit'
import { UnauthorizedError } from '../../utils/errors'
import { signIn, signUp, updatePassword, updateProfile } from './model'
import { IdentityService } from './services'

const JWT_SECRET = Bun.env.JWT_SECRET
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set')

const SESSION_COOKIE = 'linkly_session'
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7
const SESSION_DURATION = `${SESSION_DURATION_SECONDS}s`
const IS_PRODUCTION = Bun.env.NODE_ENV === 'production'

const createSessionCookie = (token: string) => {
  return {
    value: token,
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  } as Parameters<Cookie<string>['set']>[0]
}

const jwtPlugin = jwt({
  name: 'jwt',
  secret: JWT_SECRET,
  exp: SESSION_DURATION,
  schema: t.Object({ sub: t.String() }),
})

const AuthGuard = new Elysia({ name: 'identity.guard' })
  .use(jwtPlugin)
  .derive({ as: 'scoped' }, async ({ jwt, cookie }) => {
    const token = cookie[SESSION_COOKIE]?.value as string | undefined
    if (!token) return { userId: null as string | null }

    const payload = await jwt.verify(token)
    if (!payload) {
      cookie[SESSION_COOKIE]?.remove()
      return { userId: null as string | null }
    }

    return { userId: payload.sub as string | null }
  })

export const IdentityController = new Elysia({ prefix: '/identity', tags: ['identity'] })
  .use(jwtPlugin)
  .group('/auth', (app) =>
    app
      .use(
        rateLimit({
          duration: 60_000,
          max: 10,
          scoping: 'scoped',
          errorResponse: new Response(
            JSON.stringify({ message: 'Too many attempts, try again later' }),
            { status: 429, headers: { 'content-type': 'application/json' } }
          ),
        })
      )
      .post(
        '/sign-up',
        async ({ body, jwt, cookie }) => {
          const user = await IdentityService.register(body)
          const token = await jwt.sign({ sub: user.id })
          cookie[SESSION_COOKIE].set(createSessionCookie(token))
          return user
        },
        {
          body: signUp,
        }
      )
      .post(
        '/sign-in',
        async ({ body, jwt, cookie: { [SESSION_COOKIE]: cookie } }) => {
          const user = await IdentityService.authenticate(body)
          const token = await jwt.sign({ sub: user.id })
          cookie.set(createSessionCookie(token))
          return user
        },
        {
          body: signIn,
        }
      )
      .post('/sign-out', ({ cookie }) => {
        cookie[SESSION_COOKIE]?.remove()
        return { message: 'Signed out' }
      })
  )
  .group('/users', (app) =>
    app.get('/:handle', ({ params: { handle } }) => IdentityService.getByHandle(handle), {
      params: t.Object({ handle: t.String() }),
    })
  )
  .group('/me', (app) =>
    app
      .use(AuthGuard)
      .get('/', ({ userId }) => {
        if (!userId) throw new UnauthorizedError('Not authenticated')
        return IdentityService.getById(userId)
      })
      .patch(
        '/',
        ({ userId, body }) => {
          if (!userId) throw new UnauthorizedError('Not authenticated')
          return IdentityService.updateProfile(userId, body)
        },
        { body: updateProfile }
      )
      .patch(
        '/password',
        ({ userId, body }) => {
          if (!userId) throw new UnauthorizedError('Not authenticated')
          return IdentityService.updatePassword(userId, body.currentPassword, body.newPassword)
        },
        { body: updatePassword }
      )
      .delete(
        '/',
        async ({ userId, body, cookie }) => {
          if (!userId) throw new UnauthorizedError('Not authenticated')
          const result = await IdentityService.deleteAccount(userId, body.password)
          cookie[SESSION_COOKIE]?.remove()
          return result
        },
        { body: t.Object({ password: t.String() }) }
      )
  )
