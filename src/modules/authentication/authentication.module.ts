import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AdapterModule } from '../adapters/adapter.module'
import { AuthenticationController } from '../authentication/authentication.controller'
import { AuthenticationService } from '../authentication/authentication.service'
import { SECRET_KEY, EXPIRATION_TIME } from './../../utils/constants'

@Module({
   imports: [
      AdapterModule,
      JwtModule.register({
         global: true,
         secret: SECRET_KEY,
         signOptions: { expiresIn: EXPIRATION_TIME },
      }),
   ],
   providers: [AuthenticationService],
   controllers: [AuthenticationController],
   exports: [AuthenticationService],
})
export class AuthenticationModule {}
