import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { SECRET_KEY } from './../../utils'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  @Inject() private readonly jwtService: JwtService

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      await this.jwtService.verifyAsync(token, { secret: SECRET_KEY })
    } catch {
      throw new UnauthorizedException()
    }
    request['email'] = this.jwtService.decode(token).email
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
