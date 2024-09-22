import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export interface Comment {
   authorId: number
   articleId: number
   content: string
}

export class CreateCommentBody implements Comment {
   @IsNotEmpty()
   @IsNumber()
   authorId: number

   @IsNotEmpty()
   @IsNumber()
   articleId: number

   @IsNotEmpty()
   @IsString()
   content: string
}
