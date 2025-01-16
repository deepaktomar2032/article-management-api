import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { AuthorAdapter } from 'src/modules/adapters/author.adapter'
import { ArticleAdapter } from 'src/modules/adapters/article.adapter'
import { Article, CreateArticleResponse, GetArticleResponse, Strings } from 'src/types'
import { message, CACHE_DEFAULT_TIME } from 'src/utils'

@Injectable()
export class ArticleService {
  @Inject() private readonly authorAdapter: AuthorAdapter
  @Inject() private readonly articleAdapter: ArticleAdapter
  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache

  async createArticle(body: Article): Promise<CreateArticleResponse> {
    try {
      const { email, title, content } = body

      // Check if the author exists
      const author = await this.authorAdapter.findEntry({ email })
      if (!author) {
        throw new NotFoundException(message.Author_not_found)
      }

      // Insert new article into the database
      const article = { title, content, authorId: author.id, createdAt: new Date() }

      const result = await this.articleAdapter.insertEntry(article)
      return { articleId: result.id }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async getArticles(): Promise<GetArticleResponse[]> {
    try {
      const result = await this.articleAdapter.findEntries()

      if (!result) {
        throw new NotFoundException(message.No_Articles_Found)
      }

      return result
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async getArticleById(id: number): Promise<GetArticleResponse | string> {
    try {
      const value: string = await this.cacheManager.get(`${id}`)

      if (value) {
        return value
      }

      const result: GetArticleResponse = await this.articleAdapter.findEntry({ id })

      if (!result) {
        throw new NotFoundException(message.Article_not_found)
      }

      // Cache the result
      await this.cacheManager.set(`${id}`, result, CACHE_DEFAULT_TIME)

      return result
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async deleteArticleById(id: number): Promise<Strings> {
    try {
      const article = await this.articleAdapter.findEntry({ id })

      if (!article) {
        throw new NotFoundException(message.Article_not_found)
      }

      // Delete article and its comments
      await this.articleAdapter.deleteEntries({ id })

      return { message: message.Article_Deleted_Successfully }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }
}
