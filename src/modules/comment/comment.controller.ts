import {
  Body,
  Controller,
  Get,
  Req,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { AuthenticationGuard } from 'src/modules/authentication/authentication.guard'
import { CommentService } from './comment.service'
import { CreateCommentBody, CommentResponse, GetCommentResponse } from 'src/types'

@ApiTags('Comment')
@Controller('/api')
export class CommentController {
  @Inject() private readonly commentService: CommentService

  // Create new comment
  @UseGuards(AuthenticationGuard)
  @Post('/comment')
  async createComment(
    @Req() request: Request,
    @Body() body: CreateCommentBody,
  ): Promise<CommentResponse> {
    return this.commentService.createComment(request, body)
  }

  // Get all comments
  @UseGuards(AuthenticationGuard)
  @Get('/comments')
  async getComments(): Promise<GetCommentResponse[]> {
    return this.commentService.getComments()
  }

  // Get comment by id
  @UseGuards(AuthenticationGuard)
  @Get(`/comment/:id`)
  async getCommentById(@Param('id', ParseIntPipe) id: number): Promise<GetCommentResponse> {
    return this.commentService.getCommentById(id)
  }
}
