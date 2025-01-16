import { IsString, IsNotEmpty } from 'class-validator'
import { AuthorEntry } from './database/AuthorEntry'

export type Author = {
  email: string
  password: string
  name: string
}

export class CreateAuthorBody implements Author {
  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  name: string
}

export type CreateAuthorResponse = {
  authorId: number
}

export type GetAuthorsResponse = Pick<AuthorEntry, 'id' | 'name' | 'email' | 'isAdmin'>
