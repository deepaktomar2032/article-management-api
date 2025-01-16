import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CommentService } from './comment.service'
import { CreateCommentBody, CommentResponse, GetCommentResponse } from 'src/types'

@ApiTags('Comment')
@Controller('/api')
export class CommentController {
  @Inject() private readonly commentService: CommentService

  // Create new comment
  @Post('/comment')
  async createComment(@Body() body: CreateCommentBody): Promise<CommentResponse> {
    return this.commentService.createComment(body)
  }

  // Get all comments
  @Get('/comments')
  async getComments(): Promise<GetCommentResponse[]> {
    return this.commentService.getComments()
  }

  // Get comment by id
  @Get(`/comment/:id`)
  async getCommentById(@Param('id', ParseIntPipe) id: number): Promise<GetCommentResponse> {
    return this.commentService.getCommentById(id)
  }
}
