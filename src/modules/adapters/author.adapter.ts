import { Injectable } from '@nestjs/common'
import { DatabaseService } from './../database/database.service'
import { TableName, AuthorEntry } from './../../types'

@Injectable()
export class AuthorAdapter extends DatabaseService<AuthorEntry> {
   constructor() {
      super(TableName.AUTHOR)
   }
}
