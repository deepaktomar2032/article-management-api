import {
  Get,
  Controller,
  Post,
  Delete,
  Body,
  ParseIntPipe,
  Param,
  Inject,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthenticationGuard } from 'src/modules/authentication/authentication.guard'
import { AdminGuard } from 'src/modules/authentication/admin.guard'
import { ArticleService } from './article.service'
import { CreateArticleBody, CreateArticleResponse, GetArticleResponse, Strings } from 'src/types'

@ApiTags('Article')
@UseGuards(AuthenticationGuard)
@Controller('/api')
export class ArticleController {
  @Inject() private readonly articleService: ArticleService

  // Create new article
  @Post('/article')
  async createArticle(@Body() body: CreateArticleBody): Promise<CreateArticleResponse> {
    return this.articleService.createArticle(body)
  }

  // Get all articles
  @Get('/articles')
  async getArticles(): Promise<GetArticleResponse[]> {
    return this.articleService.getArticles()
  }

  // Get article by id
  @Get(`/article/:id`)
  async getArticle(@Param('id', ParseIntPipe) id: number): Promise<GetArticleResponse | string> {
    return this.articleService.getArticleById(id)
  }

  // Delete article by id (ADMIN ONLY)
  @UseGuards(AdminGuard)
  @Delete(`/article/:id`)
  async deleteArticleById(@Param('id', ParseIntPipe) id: number): Promise<Strings> {
    return this.articleService.deleteArticleById(id)
  }
}
