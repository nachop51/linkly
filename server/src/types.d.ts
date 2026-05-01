import { usersTable } from './db/schema'
import { linksTable } from './db/schema'

export type User = usersTable.$inferSelect
export type Link = linksTable.$inferSelect
