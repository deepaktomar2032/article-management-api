import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { SECRET_KEY } from './../../utils'

@Injectable()
export class AdminGuard implements CanActivate {
   @Inject() private readonly jwtService: JwtService

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest()
      const token = this.extractTokenFromHeader(request)
      if (!token) {
         throw new UnauthorizedException()
      }

      let payload
      try {
         payload = await this.jwtService.verifyAsync(token, { secret: SECRET_KEY })
      } catch {
         throw new UnauthorizedException()
      }

      if (!payload.isAdmin) {
         throw new ForbiddenException()
      }

      request['email'] = this.jwtService.decode(token).email
      return true
   }

   private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? []
      return type === 'Bearer' ? token : undefined
   }
}
