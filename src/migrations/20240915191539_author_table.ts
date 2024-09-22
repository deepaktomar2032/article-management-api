import type { Knex } from 'knex'

const tableName: string = 'author'

export async function up(knex: Knex): Promise<void> {
   const exists: boolean = await knex.schema.hasTable(tableName)

   if (!exists) {
      await knex.schema.createTable(tableName, (table: Knex.CreateTableBuilder) => {
         table.increments('id').primary()
         table.string('name', 128).notNullable()
         table.string('email', 128).notNullable().unique()
         table.string('password', 128).notNullable()
         table.boolean('is_admin').notNullable().defaultTo(false)
      })

      console.log(`${tableName} Table Created`)
   }
}

export async function down(knex: Knex): Promise<void> {
   await knex.schema.dropTable(tableName)

   console.log(`${tableName} Table Deleted`)
}
