import { Module } from '@nestjs/common'
import { AuthorAdapter } from './author.adapter'
import { ArticleAdapter } from './article.adapter'
import { CommentAdapter } from './comment.adapter'
import { FavoriteAdapter } from './favorite.adapter'

@Module({
  providers: [AuthorAdapter, ArticleAdapter, CommentAdapter, FavoriteAdapter],
  exports: [AuthorAdapter, ArticleAdapter, CommentAdapter, FavoriteAdapter],
})
export class AdapterModule {}
