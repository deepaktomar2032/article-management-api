import { IsString, IsNotEmpty } from 'class-validator'

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
