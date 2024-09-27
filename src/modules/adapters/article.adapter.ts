import { Injectable } from '@nestjs/common'
import { DatabaseService } from './../database/database.service'
import { TableName, ArticleEntry } from './../../types'

@Injectable()
export class ArticleAdapter extends DatabaseService<ArticleEntry> {
  constructor() {
    super(TableName.ARTICLE)
  }
}
