import type { Knex } from 'knex'

const tableName: string = 'article'

export async function up(knex: Knex): Promise<void> {
   const exists: boolean = await knex.schema.hasTable(tableName)

   if (!exists) {
      await knex.schema.createTable(tableName, (table: Knex.CreateTableBuilder) => {
         table.increments('id').primary()
         table.text('title').notNullable()
         table.text('content').notNullable()
         table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))

         table.integer('author_id').unsigned().notNullable()
         table.foreign('author_id').references('id').inTable('author')
      })

      console.log(`${tableName} Table Created`)
   }
}

export async function down(knex: Knex): Promise<void> {
   await knex.schema.dropTable(tableName)

   console.log(`${tableName} Table Deleted`)
}
