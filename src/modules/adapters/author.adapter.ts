import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/modules/database/database.service'
import { TableName, AuthorEntry } from 'src/types'

@Injectable()
export class AuthorAdapter extends DatabaseService<AuthorEntry> {
  constructor() {
    super(TableName.AUTHOR)
  }
}
