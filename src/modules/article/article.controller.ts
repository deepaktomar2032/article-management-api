import { Get, Controller, Post, Delete, Body, ParseIntPipe, Param, Inject, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthenticationGuard } from '../authentication/authentication.guard'
import { AdminGuard } from '../authentication/admin.guard'
import { ArticleService } from './article.service'
import { CreateArticleBody } from './../../types/article'

@ApiTags('Article')
@UseGuards(AuthenticationGuard)
@Controller('/api')
export class ArticleController {
   @Inject() private readonly articleService: ArticleService

   // Create new article
   @Post('/article')
   async createArticle(@Body() body: CreateArticleBody) {
      return this.articleService.createArticle(body)
   }

   // Get all articles
   @Get('/articles')
   async getArticles() {
      return this.articleService.getArticles()
   }

   // Get article by id
   @Get(`/article/:id`)
   async getArticle(@Param('id', ParseIntPipe) id: number) {
      return this.articleService.getArticleById(id)
   }

   // Delete article by id (ADMIN ONLY)
   @UseGuards(AdminGuard)
   @Delete(`/article/:id`)
   async deleteArticleById(@Param('id', ParseIntPipe) id: number) {
      return this.articleService.deleteArticleById(id)
   }
}
