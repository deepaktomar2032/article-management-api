import { Test, TestingModule } from '@nestjs/testing'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ArticleService } from './article.service'
import { AuthorAdapter } from '../adapters/author.adapter'
import { CommentAdapter } from '../adapters/comment.adapter'
import { ArticleAdapter } from '../adapters/article.adapter'
import { message } from './../../utils'

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

      const findEntrySpy = jest.spyOn(mockAuthorAdapter, 'findEntry').mockResolvedValue(author)
      const insertEntrySpy = jest
        .spyOn(mockArticleAdapter, 'insertEntry')
        .mockResolvedValue(articleId)

      const result = await articleService.createArticle({ email, title, content })

      expect(mockAuthorAdapter.findEntry).toHaveBeenCalledWith({ email })
      expect(mockArticleAdapter.insertEntry).toHaveBeenCalledWith(
        expect.objectContaining({ authorId, title, content }),
      )

      expect(findEntrySpy).toHaveBeenCalledTimes(1)
      expect(insertEntrySpy).toHaveBeenCalledTimes(1)
      expect(result).toEqual({
        successful: true,
        message: message.Article_Created_Successfully,
        articleId,
      })
    })

    it('should not create a new article if author not found', async () => {
      const article = { id, authorId, title, content, createdAt }

      const findEntrySpy = jest.spyOn(mockAuthorAdapter, 'findEntry').mockResolvedValue(undefined)
      const insertEntrySpy = jest
        .spyOn(mockArticleAdapter, 'insertEntry')
        .mockResolvedValue(article)

      const result = await articleService.createArticle({ email, title, content })

      expect(mockAuthorAdapter.findEntry).toHaveBeenCalledWith({ email })
      expect(mockArticleAdapter.insertEntry).not.toHaveBeenCalled()

      expect(findEntrySpy).toHaveBeenCalledTimes(1)
      expect(insertEntrySpy).toHaveBeenCalledTimes(0)
      expect(result).toEqual({ successful: true, message: message.Author_not_found })
    })
  })

  describe('getArticles', () => {
    it('should respond with a list of all articles available in database', async () => {
      const article = { id, authorId, title, content, createdAt }
      const findEntriesSpy = jest
        .spyOn(mockArticleAdapter, 'findEntries')
        .mockResolvedValue([article])

      const result = await articleService.getArticles()

      expect(findEntriesSpy).toHaveBeenCalledTimes(1)
      expect(result).toEqual(
        expect.objectContaining({
          successful: true,
          message: message.Articles_Fetched_Successfully,
          result: [expect.objectContaining({ id, authorId, title, content })],
        }),
      )
    })
  })

  describe('getArticleById Function', () => {
    it('should respond with cached data if requested article is inside cache', async () => {
      const article = { id, authorId, title, content, createdAt }
      const getSpy = jest.spyOn(mockCacheManager, 'get').mockResolvedValue(article)
      const findEntrySpy = jest.spyOn(mockArticleAdapter, 'findEntry').mockResolvedValue(article)

      const result = await articleService.getArticleById(1)

      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith('1')

      expect(result).toEqual(
        expect.objectContaining({
          successful: true,
          message: message.Fetched_From_Cache,
          result: expect.objectContaining({ id, authorId, title, content }),
        }),
      )
      expect(findEntrySpy).toHaveBeenCalledTimes(0)
    })

    it('should respond with NOT FOUND if requested article does not exist neither in cache nor in database', async () => {
      const getSpy = jest.spyOn(mockCacheManager, 'get').mockResolvedValue(undefined)
      const findEntrySpy = jest.spyOn(mockArticleAdapter, 'findEntry').mockResolvedValue(undefined)

      const result = await articleService.getArticleById(1)

      expect(getSpy).toHaveBeenCalledTimes(1)

      expect(result).toEqual({ successful: true, message: message.Article_not_found })
      expect(findEntrySpy).toHaveBeenCalledTimes(1)
    })

    it('should responds with OK if requested article is not found in cache but found in database', async () => {
      const article = { id, authorId, title, content, createdAt }

      const getSpy = jest.spyOn(mockCacheManager, 'get').mockResolvedValue(undefined)
      const findEntrySpy = jest.spyOn(mockArticleAdapter, 'findEntry').mockResolvedValue(article)

      const result = await articleService.getArticleById(1)

      expect(getSpy).toHaveBeenCalledTimes(1)

      expect(result).toEqual(
        expect.objectContaining({
          successful: true,
          message: message.Article_Fetched_Successfully,
          result: expect.objectContaining({ id, authorId, title, content }),
        }),
      )
      expect(findEntrySpy).toHaveBeenCalledTimes(1)
    })
  })
})
