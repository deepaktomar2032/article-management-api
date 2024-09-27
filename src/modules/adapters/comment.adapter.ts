import { Injectable } from '@nestjs/common'
import { DatabaseService } from './../database/database.service'
import { TableName, CommentEntry } from './../../types'

@Injectable()
export class CommentAdapter extends DatabaseService<CommentEntry> {
  constructor() {
    super(TableName.COMMENT)
  }
}
