import type { Knex } from 'knex'
import * as bcrypt from 'bcrypt'
import { SALT_VALUE } from './../utils/constants'

const tableName: string = 'author'

export async function up(knex: Knex): Promise<void> {
   const hashedPassword = await bcrypt.hash('admin', SALT_VALUE)
   await knex(tableName).insert({
      name: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      is_admin: true,
   })

   console.log(`Admin Created`)
}

export async function down(knex: Knex): Promise<void> {
   await knex(tableName).where({ email: 'admin@gmail.com' }).del()

   console.log(`Admin Deleted`)
}
