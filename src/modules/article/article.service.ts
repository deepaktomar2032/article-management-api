import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Request } from 'express'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { AuthorAdapter } from 'src/modules/adapters/author.adapter'
import { ArticleAdapter } from 'src/modules/adapters/article.adapter'
import { FavoriteAdapter } from 'src/modules/adapters/favorite.adapter'
import {
  ArticleEntry,
  FavoriteEntry,
  CreateArticleBody,
  CreateArticleResponse,
  GetArticleResponse,
  Strings,
} from 'src/types'
import { message, CACHE_DEFAULT_TIME } from 'src/utils'

@Injectable()
export class ArticleService {
  @Inject() private readonly authorAdapter: AuthorAdapter
  @Inject() private readonly articleAdapter: ArticleAdapter
  @Inject() private readonly favoriteAdapter: FavoriteAdapter
  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache

  async createArticle(request: Request, body: CreateArticleBody): Promise<CreateArticleResponse> {
    try {
      const { title, content } = body

      const { authorId, email } = request['user']

      // Check if the author exists
      const author = await this.authorAdapter.findEntry({ email })
      if (!author) {
        throw new NotFoundException(message.Author_not_found)
      }

      // Insert new article into the database
      const article = { title, content, authorId, createdAt: new Date() }

      const articleId = await this.articleAdapter.insertEntry(article)
      return { articleId }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Internal_Server_Error)
      }
      throw error
    }
  }

  async getArticles(request: Request): Promise<GetArticleResponse[]> {
    try {
      const articles: ArticleEntry[] = await this.articleAdapter.findEntries()

      if (!articles) {
        throw new NotFoundException(message.No_Articles_Found)
      }

      const { authorId } = request['user']
      const existingFavorite: FavoriteEntry[] = await this.favoriteAdapter.findEntries({ authorId })

      const result: GetArticleResponse[] = articles.map((article) => ({
        ...article,
        favorite: existingFavorite.some((entry) => entry.articleId === article.id),
      }))

      return result
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Internal_Server_Error)
      }
      throw error
    }
  }

  async getArticleById(request: Request, id: number): Promise<GetArticleResponse | string> {
    try {
      const cachedResult: string = await this.cacheManager.get(`${id}`)

      if (cachedResult) return cachedResult

      const article: ArticleEntry = await this.articleAdapter.findEntry({ id })

      if (!article) {
        throw new NotFoundException(message.Article_not_found)
      }

      const { authorId } = request['user']
      const existingFavorite: FavoriteEntry = await this.favoriteAdapter.findEntry({
        authorId,
        articleId: id,
      })

      const result: GetArticleResponse = { ...article, favorite: existingFavorite ? true : false }

      // Cache the article
      await this.cacheManager.set(`${id}`, result, CACHE_DEFAULT_TIME)

      return result
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Internal_Server_Error)
      }
      throw error
    }
  }

  async toggleFavorite(request: Request, id: number): Promise<Strings> {
    try {
      const { authorId } = request['user']

      const article = await this.articleAdapter.findEntry({ id })

      if (!article) {
        throw new NotFoundException(message.Article_not_found)
      }

      const existingFavorite = await this.favoriteAdapter.findEntry({ authorId, articleId: id })

      if (existingFavorite) {
        await this.favoriteAdapter.deleteEntries({ authorId, articleId: id })
        await this.cacheManager.del(`${id}`)
        return { message: message.favorite_Removed }
      }

      await this.favoriteAdapter.insertEntry({ authorId, articleId: id })

      return { message: message.Article_Marked_As_Favorite }
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Internal_Server_Error)
      }
      throw error
    }
  }

  // ADMIN ONLY
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
        throw new InternalServerErrorException(message.Internal_Server_Error)
      }
      throw error
    }
  }
}
