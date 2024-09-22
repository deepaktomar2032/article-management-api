import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'

@Controller(`/api`)
export class AppController {
   @Inject() private readonly appService: AppService

   @ApiTags('Healt Check')
   @Get(`/health`)
   healthCheck() {
      return this.appService.healthCheck()
   }
}
