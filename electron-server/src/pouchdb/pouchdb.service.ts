import { Injectable } from '@nestjs/common'
import PouchFindPlugin from 'pouchdb-find'
// import path from 'path'
import { UserService } from 'src/user/user.service'
import { TimbreService } from 'src/timbre/timbre.service'
import { BgmService } from 'src/bgm/bgm.service'
import { FolderService } from 'src/folder/folder.service'
import { ProjectService } from 'src/project/project.service'
import { UploadService } from 'src/upload/upload.service'
// import fs from 'fs'
import PouchDB from 'pouchdb-node'

const __rootdirname = process.cwd()
@Injectable()
export class PouchDBService {
  constructor(
    private readonly userService: UserService,
    private readonly timerServcie: TimbreService,
    private readonly bgmService: BgmService,
    private readonly folderService: FolderService,
    private readonly projectService: ProjectService,
    private readonly uploadService: UploadService
  ) {
    // 使用 mongodb 的查询语法
    // PouchDB.plugin(PouchFindPlugin)
    // console.log(pouchdb)
  }

  init(env?: 'dev' | 'prod') {
    PouchDB.plugin(PouchFindPlugin)
    this.userService.initDatabase(PouchDB)
    this.timerServcie.initDatabase(PouchDB)
    this.bgmService.initDatabase(PouchDB)
    this.folderService.initDatabase(PouchDB)
    this.projectService.initDatabase(PouchDB)
    this.uploadService.initDatabase(PouchDB)
  }

  // createDatabase<T>(pathname: string, options?: PouchDB.Configuration.DatabaseConfiguration) {
  //   const db = new PouchDB<T>(pathname, options)
  //   return db
  // }
}
