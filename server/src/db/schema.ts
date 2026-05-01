import { sql } from 'drizzle-orm'
import { boolean, integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

const id = () =>
  text()
    .primaryKey()
    .default(sql`gen_random_uuid()`)
const createdAt = () => timestamp().defaultNow().notNull()
const updatedAt = () =>
  timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())

export const usersTable = pgTable(
  'users',
  {
    id: id(),
    name: text().notNull(),
    handle: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
    bio: text(),
    avatarUrl: text(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('unique_email').on(t.email), uniqueIndex('unique_handle').on(t.handle)]
)

export const linksTable = pgTable(
  'links',
  {
    id: id(),
    userId: text().references(() => usersTable.id, { onDelete: 'cascade' }),
    url: text().notNull(),
    customUrl: text(),
    private: boolean().default(false),
    views: integer().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('unique_url').on(t.url), uniqueIndex('unique_custom_url').on(t.customUrl)]
)
