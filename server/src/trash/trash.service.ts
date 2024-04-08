import { Injectable } from '@nestjs/common'
import { FolderService } from 'src/folder/folder.service'
import { StorageService } from 'src/storage/storage.service'
import { ObjectId } from 'typeorm'
import { TrashName } from './dto/trash-name'
import { LibraryEnum, RemovedEnum } from 'src/enum'
import { ProjectService } from 'src/project/project.service'

type TrashDataFormat = {
  folderId?: ObjectId
  folderName?: string
  id: ObjectId
  name: string
  abbrev?: string
  lib?: LibraryEnum
  removed?: RemovedEnum
  updateAt: Date
  createAt: Date
}

@Injectable()
export class TrashService {
  constructor(
    private readonly folderService: FolderService,
    private readonly projectService: ProjectService,
    private readonly storageService: StorageService
  ) {}

  async findAll(trashName: TrashName, userId: ObjectId) {
    let data: TrashDataFormat[] = []
    if (trashName === 'folder') {
      data = await this.getFolders(userId)
    } else {
      data = await this.getProjects(userId, trashName)
    }
    return data
  }

  async getFolders(userId: ObjectId) {
    const folders = await this.folderService.findBin(userId)
    const data: TrashDataFormat[] = []
    folders.forEach((item, index) => {
      data[index] = {
        folderId: item.parentId,
        id: item._id,
        name: item.name,
        lib: item.lib,
        removed: item.removed,
        updateAt: item.updateAt,
        createAt: item.createAt
      }
    })
    const promiseArr = data.map(item => {
      return this.folderService.getFolderName(item.folderId, userId)
    })
    await Promise.all(promiseArr).then(folderNames => {
      data.forEach((item, index, arr) => {
        arr[index].folderName = folderNames[index]
      })
    })
    return data
  }

  async getProjects(userId: ObjectId, lib: LibraryEnum) {
    const notes = await this.projectService.findAllFromTrash(userId, lib)
    const data: TrashDataFormat[] = []
    notes.forEach((item, index) => {
      data[index] = {
        id: item._id,
        folderId: item.folderId,
        name: item.title,
        abbrev: item.abbrev,
        updateAt: item.updateAt,
        createAt: item.createAt
      }
    })
    const promiseArr = data.map(item => {
      return this.folderService.getFolderName(item.folderId, userId)
    })
    await Promise.all(promiseArr).then(folderNames => {
      data.forEach((item, index, arr) => {
        arr[index].folderName = folderNames[index]
      })
    })
    return data
  }
}
