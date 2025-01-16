import { IsString, IsNotEmpty } from 'class-validator'
import { ArticleEntry } from 'src/types'

export type Strings = Record<string, string>

export interface Article {
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

export interface CreateArticleResponse {
  articleId: number
}

export interface GetArticlesResponse extends ArticleEntry {}
