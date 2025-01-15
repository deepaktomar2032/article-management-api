import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/modules/database/database.service'
import { TableName, CommentEntry } from 'src/types'

@Injectable()
export class CommentAdapter extends DatabaseService<CommentEntry> {
  constructor() {
    super(TableName.COMMENT)
  }
}
