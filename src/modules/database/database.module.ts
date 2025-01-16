import { Module } from '@nestjs/common'
import { KnexModule } from 'nestjs-knex'
import { DatabaseService } from './database.service'
import getClientConfig from './../../../knexfile'

@Module({
  imports: [
    KnexModule.forRoot({
      config: getClientConfig,
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
