import { Module } from '@nestjs/common'
import { KnexModule } from 'nestjs-knex'
import { DatabaseService } from './database.service'
import config from './../../../knexfile'

@Module({
  imports: [
    KnexModule.forRoot({
      config: config.development,
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
