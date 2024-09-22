import { Knex } from 'knex'

const config: { [key: string]: Knex.Config } = {
   development: {
      client: 'mysql2',
      connection: {
         host: process.env.DB_HOST!,
         user: process.env.DB_USER!,
         password: process.env.DB_PASSWORD!,
         database: process.env.DB_NAME!,
         port: parseInt(process.env.DB_PORT!),
      },
      migrations: {
         directory: './src/migrations',
         extension: 'ts',
      },
   },
   production: {
      client: 'mysql2',
      connection: {
         host: process.env.DB_HOST!,
         user: process.env.DB_USER!,
         password: process.env.DB_PASSWORD!,
         database: process.env.DB_NAME!,
         port: parseInt(process.env.DB_PORT!),
      },
      migrations: {
         directory: './src/migrations',
         extension: 'ts',
      },
   },
}

export default config
