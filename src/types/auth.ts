import { IsString, IsNotEmpty } from 'class-validator'

export class AuthBody {
  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}
