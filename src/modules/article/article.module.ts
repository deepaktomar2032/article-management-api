import { Module } from '@nestjs/common'
import { AdapterModule } from '../adapters/adapter.module'
import { ArticleController } from './article.controller'
import { ArticleService } from './article.service'

@Module({
  imports: [AdapterModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
