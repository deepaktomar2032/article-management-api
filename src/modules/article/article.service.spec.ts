import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ArticleService } from './article.service'
import { AuthorAdapter } from 'src/modules/adapters/author.adapter'
import { ArticleAdapter } from 'src/modules/adapters/article.adapter'
import { CommentAdapter } from 'src/modules/adapters/comment.adapter'
import { FavoriteAdapter } from 'src/modules/adapters/favorite.adapter'

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}

const mockAuthorAdapter = {
  findEntry: jest.fn(),
}

const mockArticleAdapter = {
  insertEntry: jest.fn(),
  findEntries: jest.fn(),
  findEntry: jest.fn(),
  deleteEntries: jest.fn(),
}

const mockCommentAdapter = {
  deleteEntries: jest.fn(),
}

const mockFavoriteAdapter = {
  findEntry: jest.fn(),
  findEntries: jest.fn(),
  deleteEntries: jest.fn(),
}

const id = 1
const name = 'test'
const email = 'test@test.com'
const password = 'test'
const isAdmin = false

const articleId = 1
const title = 'test'
const content = 'test'
const authorId = 1
const createdAt = new Date()
const favorite = false

describe('ArticleService', () => {
  let articleService: ArticleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: AuthorAdapter,
          useValue: mockAuthorAdapter,
        },
        {
          provide: ArticleAdapter,
          useValue: mockArticleAdapter,
        },
        {
          provide: CommentAdapter,
          useValue: mockCommentAdapter,
        },
        {
          provide: FavoriteAdapter,
          useValue: mockFavoriteAdapter,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile()

    articleService = module.get<ArticleService>(ArticleService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createArticle Function', () => {
    it('should create a new article if author exists', async () => {
      const author = { id, name, email, password, isAdmin }

      const mockRequest = { user: { email, authorId } }

      const findEntrySpy = jest.spyOn(mockAuthorAdapter, 'findEntry').mockResolvedValue(author)
      const insertEntrySpy = jest
        .spyOn(mockArticleAdapter, 'insertEntry')
        .mockResolvedValue(articleId)

      const result = await articleService.createArticle(mockRequest as any, { title, content })

      expect(mockAuthorAdapter.findEntry).toHaveBeenCalledWith({ email })
      expect(mockArticleAdapter.insertEntry).toHaveBeenCalledWith({
        title,
        content,
        authorId,
        createdAt: expect.any(Date),
      })

      expect(findEntrySpy).toHaveBeenCalledTimes(1)
      expect(insertEntrySpy).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ articleId })
    })

    it('should not create a new article if author not found', async () => {
      const article = { id, authorId, title, content, createdAt }
      const mockRequest = { user: { email, authorId } }

      const findEntrySpy = jest.spyOn(mockAuthorAdapter, 'findEntry').mockResolvedValue(undefined)
      const insertEntrySpy = jest
        .spyOn(mockArticleAdapter, 'insertEntry')
        .mockResolvedValue(article)

      await expect(
        articleService.createArticle(mockRequest as any, { title, content }),
      ).rejects.toThrow(NotFoundException)

      expect(mockAuthorAdapter.findEntry).toHaveBeenCalledWith({ email })
      expect(mockArticleAdapter.insertEntry).not.toHaveBeenCalled()

      expect(findEntrySpy).toHaveBeenCalledTimes(1)
      expect(insertEntrySpy).toHaveBeenCalledTimes(0)
    })
  })

  describe('getArticles', () => {
    it('should respond with a list of all articles available in database', async () => {
      const articles = [{ id, authorId, title, content, createdAt }]
      const mockRequest = { user: { authorId } }
      const favorites = [{ id, authorId, articleId }]
      const expectedResult = [{ id, authorId, title, content, createdAt, favorite: true }]
      const articleFindEntriesSpy = jest
        .spyOn(mockArticleAdapter, 'findEntries')
        .mockResolvedValue(articles)

      const favoriteFindEntriesSpy = jest
        .spyOn(mockFavoriteAdapter, 'findEntries')
        .mockResolvedValue(favorites)

      const result = await articleService.getArticles(mockRequest as any)

      expect(articleFindEntriesSpy).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('getArticleById Function', () => {
    it('should respond with cached data if requested article is inside cache', async () => {
      const mockRequest = { user: { authorId } }
      const article = { id, authorId, title, content, createdAt }
      const getSpy = jest.spyOn(mockCacheManager, 'get').mockResolvedValue(article)
      const findEntrySpy = jest.spyOn(mockArticleAdapter, 'findEntry').mockResolvedValue(article)

      const result = await articleService.getArticleById(mockRequest as any, 1)

      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith('1')

      expect(result).toEqual(article)
      expect(findEntrySpy).toHaveBeenCalledTimes(0)
    })

    it('should respond with NOT FOUND if requested article does not exist neither in cache nor in database', async () => {
      const mockRequest = { user: { authorId } }
      const getSpy = jest.spyOn(mockCacheManager, 'get').mockResolvedValue(undefined)
      const findEntrySpy = jest.spyOn(mockArticleAdapter, 'findEntry').mockResolvedValue(undefined)

      await expect(articleService.getArticleById(mockRequest as any, 1)).rejects.toThrow(
        NotFoundException,
      )

      expect(getSpy).toHaveBeenCalledTimes(1)

      expect(findEntrySpy).toHaveBeenCalledTimes(1)
    })

    it('should responds with OK if requested article is not found in cache but found in database', async () => {
      const mockRequest = { user: { authorId } }
      const article = { id, authorId, title, content, createdAt, favorite }

      const getSpy = jest.spyOn(mockCacheManager, 'get').mockResolvedValue(undefined)
      const findEntrySpy = jest.spyOn(mockArticleAdapter, 'findEntry').mockResolvedValue(article)

      const result = await articleService.getArticleById(mockRequest as any, 1)

      expect(getSpy).toHaveBeenCalledTimes(1)

      expect(result).toEqual(article)
      expect(findEntrySpy).toHaveBeenCalledTimes(1)
    })
  })
})
