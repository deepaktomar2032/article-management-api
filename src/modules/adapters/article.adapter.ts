import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/modules/database/database.service'
import { TableName, ArticleEntry } from 'src/types'

@Injectable()
export class ArticleAdapter extends DatabaseService<ArticleEntry> {
  constructor() {
    super(TableName.ARTICLE)
  }
}
