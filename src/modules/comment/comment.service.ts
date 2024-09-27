import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { AuthorAdapter } from '../adapters/author.adapter'
import { ArticleAdapter } from '../adapters/article.adapter'
import { CommentAdapter } from '../adapters/comment.adapter'
import { Comment } from './../../types'
import { message } from './../../utils'

@Injectable()
export class CommentService {
  @Inject() private readonly authorAdapter: AuthorAdapter
  @Inject() private readonly articleAdapter: ArticleAdapter
  @Inject() private readonly commentAdapter: CommentAdapter

  async createComment(body: Comment) {
    try {
      const { authorId, articleId, content } = body

      // Check if the author exists
      const author = await this.authorAdapter.findEntry({ id: authorId })
      if (!author) {
        throw new NotFoundException(message.Author_not_found)
      }

      // Check if the article exists
      const article = await this.articleAdapter.findEntry({ id: articleId })
      if (!article) {
        throw new NotFoundException(message.Article_not_found)
      }

      const commentData = { authorId, articleId, content, createdAt: new Date() }
      await this.commentAdapter.insertEntry(commentData)

      return { successful: true, message: message.Inserted_Successfully }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async getComments() {
    try {
      const result = await this.commentAdapter.findEntries()

      if (result.length === 0) {
        throw new NotFoundException(message.No_Comments_Found)
      }

      return { successful: true, message: message.Comments_Fetched_Successfully, result }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async getCommentById(id: number) {
    try {
      const result = await this.commentAdapter.findEntry({ id })
      if (!result) {
        throw new NotFoundException(message.Comment_not_found)
      }

      return { successful: true, message: message.Comment_Fetched_Successfully, result }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }
}
