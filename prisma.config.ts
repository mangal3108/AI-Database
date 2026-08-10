import { defineConfig } from 'prisma/config'
import 'dotenv/config'

// SECURE: Never hardcode credentials - require env var
const connectionUrl = process.env.DATABASE_URL
if (!connectionUrl) {
  throw new Error('DATABASE_URL environment variable is required. Copy .env.example to .env.local and fill in your values.')
}

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: connectionUrl,
  },
  experimental: {
    extensions: true,
  },
})
