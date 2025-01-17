import { Body, Controller, Post, HttpCode, HttpStatus, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthenticationService } from './authentication.service'
import { AuthBody, Strings } from 'src/types'

@ApiTags('Login')
@Controller('/api')
export class AuthenticationController {
  @Inject() private readonly authenticationService: AuthenticationService

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() signInData: AuthBody): Promise<Strings> {
    return this.authenticationService.signIn(signInData)
  }
}
