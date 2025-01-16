import type { Knex } from 'knex'

const tableName: string = 'favorite'

export async function up(knex: Knex): Promise<void> {
  const exists: boolean = await knex.schema.hasTable(tableName)

  if (!exists) {
    await knex.schema.createTable(tableName, (table: Knex.CreateTableBuilder) => {
      table.increments('id').primary()

      table.integer('author_id').unsigned().notNullable()
      table.integer('article_id').unsigned().notNullable()

      table.foreign('author_id').references('id').inTable('author')
      table.foreign('article_id').references('id').inTable('article').onDelete('CASCADE')
    })

    console.log(`${tableName} Table Created`)
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName)

  console.log(`${tableName} Table Deleted`)
}
