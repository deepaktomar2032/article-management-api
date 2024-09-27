import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { AuthorAdapter } from '../adapters/author.adapter'
import { ArticleAdapter } from '../adapters/article.adapter'
import { CommentAdapter } from '../adapters/comment.adapter'
import { Article } from './../../types/article'
import { message, CACHE_DEFAULT_TIME } from './../../utils'

@Injectable()
export class ArticleService {
  @Inject() private readonly authorAdapter: AuthorAdapter
  @Inject() private readonly articleAdapter: ArticleAdapter
  @Inject() private readonly commentAdapter: CommentAdapter
  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache

  async createArticle(body: Article) {
    try {
      const { email, title, content } = body

      // Check if the author exists
      const author = await this.authorAdapter.findEntry({ email })
      if (!author) {
        throw new NotFoundException(message.Author_not_found)
      }

      // Insert new article into the database
      const authorId = author.id
      const article = { authorId, title, content, createdAt: new Date() }
      const result = await this.articleAdapter.insertEntry(article)

      return { successful: true, message: message.Article_Created_Successfully, articleId: result }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async getArticles() {
    try {
      const result = await this.articleAdapter.findEntries()

      if (!result) {
        throw new NotFoundException(message.No_Articles_Found)
      }

      return { successful: true, message: message.Articles_Fetched_Successfully, result }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async getArticleById(id: number) {
    try {
      const value: string = await this.cacheManager.get(`${id}`)

      if (value) {
        return { successful: true, message: message.Fetched_From_Cache, result: value }
      }

      const result = await this.articleAdapter.findEntry({ id })

      if (!result) {
        throw new NotFoundException(message.Article_not_found)
      }

      await this.cacheManager.set(`${id}`, result, CACHE_DEFAULT_TIME)

      return { successful: true, message: message.Article_Fetched_Successfully, result }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async deleteArticleById(id: number) {
    try {
      const article = await this.articleAdapter.findEntry({ id })

      if (!article) {
        throw new NotFoundException(message.Article_not_found)
      }

      // Delete article and its comments
      await this.articleAdapter.withTransaction(async (trx) => {
        await this.commentAdapter.deleteEntries({ articleId: id }, trx)
        await this.articleAdapter.deleteEntries({ id }, trx)
      })

      return { successful: true, message: message.Article_Deleted_Successfully }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }
}
