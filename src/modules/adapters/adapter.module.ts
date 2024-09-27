import { Module } from '@nestjs/common'
import { AuthorAdapter } from './author.adapter'
import { ArticleAdapter } from './article.adapter'
import { CommentAdapter } from './comment.adapter'

@Module({
  providers: [AuthorAdapter, ArticleAdapter, CommentAdapter],
  exports: [AuthorAdapter, ArticleAdapter, CommentAdapter],
})
export class AdapterModule {}
