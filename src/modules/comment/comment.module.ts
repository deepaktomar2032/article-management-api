import { Module } from '@nestjs/common'
import { AdapterModule } from '../adapters/adapter.module'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'

@Module({
  imports: [AdapterModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
