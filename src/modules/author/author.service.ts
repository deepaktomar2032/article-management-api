import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AuthorAdapter } from './../adapters/author.adapter'
import { Author } from './../../types'
import { message, SALT_VALUE } from './../../utils'

@Injectable()
export class AuthorService {
   @Inject() private readonly authorAdapter: AuthorAdapter

   async createAuthor(body: Author) {
      try {
         const { name, email, password } = body

         const existanceCheck = await this.authorAdapter.findEntry({ email })

         if (existanceCheck) {
            return { successful: true, message: message.Email_already_exists }
         }

         // Hash password & save to database
         const hashedPassword = await bcrypt.hash(password, SALT_VALUE)
         const authorData = { name, email, password: hashedPassword, isAdmin: false }

         const result = await this.authorAdapter.insertEntry(authorData)

         return { successful: true, message: message.Author_Created_Successfully, authorId: result }
      } catch (error: unknown) {
         console.error('Error inserting data:', error)
         if (error instanceof InternalServerErrorException) {
            throw new InternalServerErrorException(message.Something_went_wrong)
         }
         throw error
      }
   }

   async getAuthors() {
      try {
         const result = await this.authorAdapter.findEntries()

         if (!result) {
            throw new NotFoundException(message.No_Authors_Found)
         }

         const response = result.map((author) => {
            const { password, ...rest } = author
            return rest
         })

         return { successful: true, message: message.Authors_Fetched_Successfully, response }
      } catch (error: unknown) {
         if (error instanceof InternalServerErrorException) {
            throw new InternalServerErrorException(message.Something_went_wrong)
         }
         throw error
      }
   }

   async getAuthorById(id: number) {
      try {
         const result = await this.authorAdapter.findEntry({ id })
         if (!result) {
            throw new NotFoundException(message.Author_not_found)
         }
         const { password, ...response } = result

         return { successful: true, message: message.Author_Fetched_Successfully, response }
      } catch (error: unknown) {
         if (error instanceof InternalServerErrorException) {
            throw new InternalServerErrorException(message.Something_went_wrong)
         }
         throw error
      }
   }
}
