import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  casing: 'camelCase',
  dbCredentials: {
    url: Bun.env.DATABASE_URL!,
  },
})
