import { Knex } from 'knex'

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: process.env.DATABASE_URL_DEV!,
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
    },
    debug: true,
  },
  production: {
    client: 'mysql2',
    connection: process.env.DATABASE_URL_PROD!,
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
    },
  },
}

export default config
