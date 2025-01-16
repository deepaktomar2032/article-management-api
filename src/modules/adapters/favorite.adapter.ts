import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/modules/database/database.service'
import { TableName, FavoriteEntry } from 'src/types'

@Injectable()
export class FavoriteAdapter extends DatabaseService<FavoriteEntry> {
  constructor() {
    super(TableName.FAVORITE)
  }
}
