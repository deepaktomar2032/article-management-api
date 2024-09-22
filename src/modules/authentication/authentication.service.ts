import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AuthorAdapter } from '../adapters/author.adapter'

@Injectable()
export class AuthenticationService {
   @Inject() private readonly authorAdapter: AuthorAdapter
   @Inject() private readonly jwtService: JwtService

   async signIn(email: string, password: string): Promise<{ access_token: string }> {
      const author = await this.authorAdapter.findEntry({ email })

      if (!author) {
         throw new UnauthorizedException()
      }

      const isPasswordMatch = await bcrypt.compare(password, author.password)

      if (!isPasswordMatch) {
         throw new UnauthorizedException()
      }

      // Generate JWT token
      const payload = { sub: author.id, email: author.email, isAdmin: author.isAdmin }
      return { access_token: await this.jwtService.signAsync(payload) }
   }
}
