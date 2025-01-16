import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { AuthorAdapter } from 'src/modules/adapters/author.adapter'
import { ArticleAdapter } from 'src/modules/adapters/article.adapter'
import { CommentAdapter } from 'src/modules/adapters/comment.adapter'
import { Comment, CommentResponse, GetCommentResponse } from 'src/types'
import { message } from 'src/utils'

@Injectable()
export class CommentService {
  @Inject() private readonly authorAdapter: AuthorAdapter
  @Inject() private readonly articleAdapter: ArticleAdapter
  @Inject() private readonly commentAdapter: CommentAdapter

  async createComment(body: Comment): Promise<CommentResponse> {
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
      const result = await this.commentAdapter.insertEntry(commentData)

      return { commentId: result.id }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async getComments(): Promise<GetCommentResponse[]> {
    try {
      const result = await this.commentAdapter.findEntries()

      if (result.length === 0) {
        throw new NotFoundException(message.No_Comments_Found)
      }

      return result
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async getCommentById(id: number): Promise<GetCommentResponse> {
    try {
      const result = await this.commentAdapter.findEntry({ id })
      if (!result) {
        throw new NotFoundException(message.Comment_not_found)
      }

      return result
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }
}
