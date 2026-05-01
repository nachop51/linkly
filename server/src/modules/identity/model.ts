import { t } from 'elysia'

const handleSchema = t.String({
  minLength: 3,
  maxLength: 24,
  pattern: '^[a-zA-Z0-9_]+$',
  description: 'Lowercase alphanumeric handle (underscores allowed)',
})

const passwordSchema = t.String({ minLength: 8, maxLength: 128 })

export const signUp = t.Object({
  name: t.String({ minLength: 1, maxLength: 64 }),
  handle: handleSchema,
  email: t.String({ format: 'email', maxLength: 254 }),
  password: passwordSchema,
})

export const signIn = t.Object({
  identifier: t.String({ minLength: 3, maxLength: 254 }),
  password: passwordSchema,
})

export const updateProfile = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 64 })),
  handle: t.Optional(handleSchema),
  bio: t.Optional(t.String({ maxLength: 280 })),
  avatarUrl: t.Optional(t.String({ format: 'uri', maxLength: 500 })),
})

export const updatePassword = t.Object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
})

export const profile = t.Object({
  id: t.String(),
  name: t.String(),
  handle: t.String(),
  email: t.String(),
  bio: t.Nullable(t.String()),
  avatarUrl: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
})

export const publicProfile = t.Object({
  id: t.String(),
  name: t.String(),
  handle: t.String(),
  bio: t.Nullable(t.String()),
  avatarUrl: t.Nullable(t.String()),
  createdAt: t.Date(),
})

export type SignUp = typeof signUp.static
export type SignIn = typeof signIn.static
export type UpdateProfile = typeof updateProfile.static
export type UpdatePassword = typeof updatePassword.static
export type Profile = typeof profile.static
export type PublicProfile = typeof publicProfile.static
