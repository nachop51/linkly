import { drizzle } from 'drizzle-orm/bun-sql'

const { DATABASE_URL } = Bun.env

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export const db = drizzle(DATABASE_URL!)
