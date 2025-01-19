import { IsString, IsNotEmpty, IsNumber } from 'class-validator'
import { CommentEntry } from './database/CommentEntry'

export class CreateCommentBody {
  @IsNotEmpty()
  @IsNumber()
  articleId: number

  @IsNotEmpty()
  @IsString()
  content: string
}

export type CommentResponse = {
  commentId: number
}

export type GetCommentResponse = CommentEntry
