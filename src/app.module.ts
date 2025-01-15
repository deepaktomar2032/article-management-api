import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'
import { AppController } from 'src/app.controller'
import { AppService } from 'src/app.service'
import { ArticleModule } from 'src/modules/article/article.module'
import { AuthorModule } from 'src/modules/author/author.module'
import { CommentModule } from 'src/modules/comment/comment.module'
import { AuthenticationModule } from 'src/modules/authentication/authentication.module'
import { DatabaseModule } from 'src/modules/database/database.module'
import { CACHE_DEFAULT_TIME } from 'src/utils'

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
