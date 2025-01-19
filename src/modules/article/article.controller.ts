import {
  Get,
  Req,
  Controller,
  Post,
  Put,
  Delete,
  Body,
  ParseIntPipe,
  Param,
  Inject,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
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
  async createArticle(
    @Req() request: Request,
    @Body() body: CreateArticleBody,
  ): Promise<CreateArticleResponse> {
    return this.articleService.createArticle(request, body)
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

  // Mark/Unmark article as favorite
  @HttpCode(HttpStatus.OK)
  @Put(`/article/:id/favorite`)
  async markArticleAsFavorite(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Strings> {
    return this.articleService.toggleFavorite(request, id)
  }

  // Delete article by id (ADMIN ONLY)
  @UseGuards(AdminGuard)
  @Delete(`/article/:id`)
  async deleteArticleById(@Param('id', ParseIntPipe) id: number): Promise<Strings> {
    return this.articleService.deleteArticleById(id)
  }
}
