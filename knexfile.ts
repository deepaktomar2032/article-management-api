import knex, { type Knex } from 'knex'

let client: Knex | undefined

export const getClientConfig = () => ({
  client: 'mysql2',
  connection: process.env.DATABASE_URL!,
  migrations: {
    directory: './src/migrations',
    extension: 'ts',
  },
})

export const connectToDatabase = () => {
  if (!client) {
    client = knex(getClientConfig())
  }
}

export const disconnectFromDatabase = async () => {
  if (client) {
    await client.destroy()
    client = undefined
  }
}

export const getClient = () => {
  if (!client) {
    throw new Error('Client is not defined')
  }

  return client
}

export default getClientConfig()
