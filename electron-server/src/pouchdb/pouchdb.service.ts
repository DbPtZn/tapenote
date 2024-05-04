import { Injectable } from '@nestjs/common'
import PouchFindPlugin from 'pouchdb-find'
import PouchDB from 'pouchdb-node'
@Injectable()
export class PouchDBService {
  constructor() {
    // 使用 mongodb 的查询语法
    PouchDB.plugin(PouchFindPlugin)
  }

  createDatabase<T>(name: string, options?: PouchDB.Configuration.DatabaseConfiguration) {
    const db = new PouchDB<T>(name, options)
    return db
  }
}
