import { Module } from '@nestjs/common'
import { AdapterModule } from 'src/modules/adapters/adapter.module'
import { AuthorController } from './author.controller'
import { AuthorService } from './author.service'

@Module({
  imports: [AdapterModule],
  providers: [AuthorService],
  controllers: [AuthorController],
})
export class AuthorModule {}
