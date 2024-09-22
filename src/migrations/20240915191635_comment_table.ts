import type { Knex } from 'knex'

const tableName: string = 'comment'

export async function up(knex: Knex): Promise<void> {
   const exists: boolean = await knex.schema.hasTable(tableName)

   if (!exists) {
      await knex.schema.createTable(tableName, (table: Knex.CreateTableBuilder) => {
         table.increments('id').primary()
         table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
         table.text('content').notNullable()

         table.integer('article_id').unsigned().notNullable()
         table.integer('author_id').unsigned().notNullable()

         table.foreign('article_id').references('id').inTable('article').onDelete('CASCADE')
         table.foreign('author_id').references('id').inTable('author')
      })

      console.log(`${tableName} Table Created`)
   }
}

export async function down(knex: Knex): Promise<void> {
   await knex.schema.dropTable(tableName)

   console.log(`${tableName} Table Deleted`)
}
