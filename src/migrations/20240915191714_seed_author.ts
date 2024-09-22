import type { Knex } from 'knex'
import * as bcrypt from 'bcrypt'
import { SALT_VALUE } from './../utils/constants'

const tableName: string = 'author'

export async function up(knex: Knex): Promise<void> {
   const hashedPassword = await bcrypt.hash('pass1', SALT_VALUE)
   await knex(tableName).insert({
      name: 'user1',
      email: 'user1@gmail.com',
      password: hashedPassword,
      is_admin: false,
   })

   console.log(`User Created`)
}

export async function down(knex: Knex): Promise<void> {
   await knex(tableName).where({ email: 'user1@gmail.com' }).del()

   console.log(`User Deleted`)
}
