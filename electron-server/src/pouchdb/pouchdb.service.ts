import { Injectable } from '@nestjs/common'
import PouchFindPlugin from 'pouchdb-find'
import PouchDB from 'pouchdb-node'
@Injectable()
export class PouchDBService {
  constructor() {
    // 使用 mongodb 的查询语法
    PouchDB.plugin(PouchFindPlugin)
  }

  createDatabase<T>(pathname: string, options?: PouchDB.Configuration.DatabaseConfiguration) {
    const db = new PouchDB<T>(pathname, options)
    return db
  }
}
