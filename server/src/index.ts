import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { HttpError } from './utils/errors'
import { IdentityController } from './modules/identity/controllers'

const app = new Elysia()
  .use(
    cors({
      origin: true,
      credentials: true,
    })
  )
  .use(
    openapi({
      path: '/docs',
      documentation: {
        info: {
          title: 'Linkly API',
          version: '1.0.0',
          description: 'Link sharing service API',
        },
        components: {
          securitySchemes: {
            cookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'linkly_session',
            },
          },
        },
      },
    })
  )
  .error({ HTTP: HttpError })
  .onError(({ code, error, set }) => {
    if (code === 'HTTP') {
      set.status = error.statusCode
      return { message: error.message }
    }
  })
  .use(IdentityController)
  .listen({
    hostname: '0.0.0.0',
    port: 3000,
  })

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
