import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AuthorAdapter } from 'src/modules/adapters/author.adapter'
import { Author, CreateAuthorResponse, GetAuthorsResponse } from 'src/types'
import { message, SALT_VALUE } from 'src/utils'

@Injectable()
export class AuthorService {
  @Inject() private readonly authorAdapter: AuthorAdapter

  async createAuthor(body: Author): Promise<CreateAuthorResponse> {
    try {
      const { name, email, password } = body

      const existanceCheck = await this.authorAdapter.findEntry({ email })

      if (existanceCheck) {
        throw new ConflictException(message.Email_already_exists)
      }

      // Hash password & save to database
      const hashedPassword = await bcrypt.hash(password, SALT_VALUE)
      const authorData = { name, email, password: hashedPassword, isAdmin: false }

      const authorId = await this.authorAdapter.insertEntry(authorData)

      return { authorId }
    } catch (error: unknown) {
      console.error('Error inserting data:', error)
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async getAuthors(): Promise<GetAuthorsResponse[]> {
    try {
      const result = await this.authorAdapter.findEntries()

      if (!result) {
        throw new NotFoundException(message.No_Authors_Found)
      }

      const response = result.map((author) => {
        const { password, ...rest } = author
        return rest
      })

      return response
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }

  async getAuthorById(id: number): Promise<GetAuthorsResponse> {
    try {
      const result = await this.authorAdapter.findEntry({ id })
      if (!result) {
        throw new NotFoundException(message.Author_not_found)
      }
      const { password, ...response } = result

      return response
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(message.Something_went_wrong)
      }
      throw error
    }
  }
}
