import { Body, Controller, Post, HttpCode, HttpStatus, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthenticationService } from './authentication.service'

@ApiTags('Login')
@Controller('/api')
export class AuthenticationController {
  @Inject() private readonly authenticationService: AuthenticationService

  @HttpCode(HttpStatus.OK)
  @Post('/auth')
  signIn(@Body() signInData: Record<string, string>) {
    return this.authenticationService.signIn(signInData.email, signInData.password)
  }
}
