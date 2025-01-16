import { IsString, IsNotEmpty } from 'class-validator'
import { ArticleEntry } from './database/ArticleEntry'

export type Strings = Record<string, string>

export type Article = {
  email?: string
  title: string
  content: string
}

export class CreateArticleBody {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  content: string
}

export type CreateArticleResponse = {
  articleId: number
}

export type GetArticleResponse = ArticleEntry
