import { Body, Controller, Get, Param, Post, ParseIntPipe, Inject, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthenticationGuard } from 'src/modules/authentication/authentication.guard'
import { AuthorService } from './author.service'
import { CreateAuthorBody } from 'src/types'

@ApiTags('Author')
@Controller('/api')
export class AuthorController {
  @Inject() private readonly authorService: AuthorService

  // Create new author
  @Post('/author')
  async createAuthor(@Body() body: CreateAuthorBody) {
    return this.authorService.createAuthor(body)
  }

  // Get all authors
  @UseGuards(AuthenticationGuard)
  @Get('/authors')
  async getAuthors() {
    return this.authorService.getAuthors()
  }

  // Get author by id
  @UseGuards(AuthenticationGuard)
  @Get('/author/:id')
  async getAuthorById(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.getAuthorById(id)
  }
}
