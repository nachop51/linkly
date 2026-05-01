import { and, eq, ne, or } from 'drizzle-orm'
import { db } from '../../db'
import { usersTable } from '../../db/schema'
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../utils/errors'
import type { SignIn, SignUp, UpdateProfile } from './model'

const PASSWORD_HASH_OPTS = { algorithm: 'bcrypt', cost: 10 } as const

export abstract class IdentityService {
  static async register({ name, handle, email, password }: SignUp) {
    const existing = await db
      .select({ id: usersTable.id, email: usersTable.email, handle: usersTable.handle })
      .from(usersTable)
      .where(or(eq(usersTable.email, email), eq(usersTable.handle, handle)))
      .limit(1)

    if (existing.length > 0) {
      const conflict = existing[0]!.email === email ? 'email' : 'handle'
      throw new ConflictError(`An account with this ${conflict} already exists`)
    }

    const passwordHash = await Bun.password.hash(password, PASSWORD_HASH_OPTS)

    const [created] = await db
      .insert(usersTable)
      .values({ name, handle, email, password: passwordHash })
      .returning()

    return created!
  }

  static async authenticate({ identifier, password }: SignIn) {
    const isEmail = identifier.includes('@')

    const [user] = await db
      .select()
      .from(usersTable)
      .where(isEmail ? eq(usersTable.email, identifier) : eq(usersTable.handle, identifier))
      .limit(1)

    if (!user) {
      await Bun.password.verify(password, Bun.env.PWD_HASH!)
      throw new UnauthorizedError('Invalid credentials')
    }

    const valid = await Bun.password.verify(password, user.password)
    if (!valid) throw new UnauthorizedError('Invalid credentials')

    return user
  }

  static async getById(id: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1)
    if (!user) throw new NotFoundError('User not found')
    return user
  }

  static async getByHandle(handle: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.handle, handle)).limit(1)
    if (!user) throw new NotFoundError('User not found')
    return user
  }

  static async updateProfile(id: string, patch: UpdateProfile) {
    if (Object.keys(patch).length === 0) return IdentityService.getById(id)

    if (patch.handle) {
      const [conflict] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(and(eq(usersTable.handle, patch.handle), ne(usersTable.id, id)))
        .limit(1)
      if (conflict) throw new ConflictError('Handle already in use')
    }

    const [updated] = await db
      .update(usersTable)
      .set(patch)
      .where(eq(usersTable.id, id))
      .returning()

    if (!updated) throw new NotFoundError('User not found')
    return updated
  }

  static async updatePassword(id: string, currentPassword: string, newPassword: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1)
    if (!user) throw new NotFoundError('User not found')

    const valid = await Bun.password.verify(currentPassword, user.password)
    if (!valid) throw new UnauthorizedError('Current password is incorrect')

    if (currentPassword === newPassword) {
      throw new BadRequestError('New password must differ from current password')
    }

    const passwordHash = await Bun.password.hash(newPassword, PASSWORD_HASH_OPTS)
    await db.update(usersTable).set({ password: passwordHash }).where(eq(usersTable.id, id))

    return { message: 'Password updated' }
  }

  static async deleteAccount(id: string, password: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1)
    if (!user) throw new NotFoundError('User not found')

    const valid = await Bun.password.verify(password, user.password)
    if (!valid) throw new UnauthorizedError('Invalid password')

    await db.delete(usersTable).where(eq(usersTable.id, id))
    return { message: 'Account deleted' }
  }
}
