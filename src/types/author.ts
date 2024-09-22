import { IsString, IsNotEmpty } from 'class-validator'

export interface Author {
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
