import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ArticleModule } from './modules/article/article.module'
import { AuthorModule } from './modules/author/author.module'
import { CommentModule } from './modules/comment/comment.module'
import { AuthenticationModule } from './modules/authentication/authentication.module'
import { DatabaseModule } from './modules/database/database.module'
import { CACHE_DEFAULT_TIME } from './utils/constants'

@Global()
@Module({
   imports: [
      ConfigModule.forRoot(),
      CacheModule.register({ ttl: CACHE_DEFAULT_TIME, isGlobal: true }),
      DatabaseModule,
      AuthenticationModule,
      AuthorModule,
      ArticleModule,
      CommentModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
