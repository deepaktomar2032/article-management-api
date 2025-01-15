import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CommentService } from './comment.service'
import { CreateCommentBody } from 'src/types'

@ApiTags('Comment')
@Controller('/api')
export class CommentController {
  @Inject() private readonly commentService: CommentService

  // Create new comment
  @Post('/comment')
  async createComment(@Body() body: CreateCommentBody) {
    return this.commentService.createComment(body)
  }

  // Get all comments
  @Get('/comments')
  async getComments() {
    return this.commentService.getComments()
  }

  // Get comment by id
  @Get(`/comment/:id`)
  async getCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.getCommentById(id)
  }
}
