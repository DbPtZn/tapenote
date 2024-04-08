import { Injectable } from '@nestjs/common'
import { CreateFolderDto } from './dto/create-folder.dto'
import { DropPosition, MoveFolderDto } from './dto/move-folder.dto'
import { Folder } from './entities/folder.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { UserService } from 'src/user/user.service'
import { ObjectId } from 'mongodb'
import { LibraryEnum, RemovedEnum } from 'src/enum'
import { GetRecentlyDto } from './dto/get-recently.dto'
import { ProjectService } from 'src/project/project.service'

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private foldersRepository: MongoRepository<Folder>,
    private readonly userService: UserService,
    private readonly projectService: ProjectService
  ) {}

  /** 新建根目录 */
  async createUserRoot(userId: ObjectId) {
    // console.log('folder')
    try {
      const user = await this.userService.findOneById(userId)
      // console.log(user)
      if (!user) return
      const dir = {
        note: null,
        course: null,
        procedure: null
      }
      if (!user.dir || !user.dir.note) dir.note = await this.createRoot(LibraryEnum.NOTE, userId)
      if (!user.dir || !user.dir.course) dir.course = await this.createRoot(LibraryEnum.COURSE, userId)
      if (!user.dir || !user.dir.procedure) dir.procedure = await this.createRoot(LibraryEnum.PROCEDURE, userId)
      return await this.userService.createUserRoot(dir, userId)
    } catch (error) {
      // console.log(error)
      throw error
    }
  }

  /** 新建文件夹 */
  async create(createFolderDto: CreateFolderDto, userId: ObjectId) {
    const { name, desc, lib, parentId } = createFolderDto
    const folder = new Folder()
    folder.name = name
    folder.desc = desc
    folder.lib = lib
    folder.userId = userId
    folder.parentId = new ObjectId(parentId)
    return this.foldersRepository.save(folder)
  }

  /** 查询指定文件夹的子节点 */
  async findChildrenById(_id: ObjectId, userId: ObjectId) {
    const folders = await this.foldersRepository.find({
      where: { parentId: _id, userId, removed: RemovedEnum.NEVER },
      select: ['_id', 'name', 'parentId', 'lib', 'createAt']
    })
    for (let i = 0; i < folders.length; i++) {
      const count = await this.foldersRepository.countBy({
        parentId: folders[i]._id,
        userId,
        removed: RemovedEnum.NEVER
      })
      folders[i]['isLeaf'] = !(count > 0)
      // folders[i]['children'] = count > 0 ? undefined : []
    }
    // console.log(folders)
    return folders
  }

  async findOneById(_id: ObjectId, userId: ObjectId) {
    const folder = await this.foldersRepository.findOneBy({ _id: _id, userId })
    if (folder) return folder
    else throw new Error(`查询失败,找不到目标文件夹,项目id:${_id}`)
  }
  /** 查询文件夹是否存在或者处于被移除状态 */
  async queryOneById(_id: ObjectId, userId: ObjectId) {
    return this.foldersRepository
      .findOneBy({ _id: _id, userId })
      .then(folder => {
        if (folder && folder.removed === RemovedEnum.NEVER) {
          return true
        } else {
          return false
        }
      })
      .catch(error => {
        return false
      })
  }

  async getFolderData(_id: ObjectId, userId: ObjectId) {
    const folder = await this.findOneById(_id, userId)
    const subfolders = await this.findChildrenById(_id, userId)
    const subfiles = await this.projectService.findAllByFolderId(folder._id, userId, folder.lib)

    const data = {
      id: folder._id,
      name: folder.name,
      desc: folder.desc,
      lib: folder.lib,
      parentId: folder.parentId ? folder.parentId : '',
      createAt: folder.createAt,
      updateAt: folder.updateAt,
      subfolders: subfoldersFormatter(subfolders),
      subfiles: subfilesFormatter(subfiles, folder.lib)
    }
    return data
  }

  /** 获取最近编辑文档 */
  async getRecently(getRecentlyDto: GetRecentlyDto, userId: ObjectId) {
    const { lib, skip, take } = getRecentlyDto
    // console.log([lib, skip, take])
    const subfiles = await this.projectService.findByUpdateAt(skip, take, lib, userId)
    const recentlyFiles = await this.recentlyFormatter(subfiles, lib, userId)
    const data = {
      id: 'recently',
      name: '',
      desc: '',
      lib: lib,
      parentId: '',
      createAt: '',
      updateAt: '',
      subfolders: [],
      subfiles: recentlyFiles
    }

    return data
  }

  /** 通过 id 获取文件夹名称 */
  async getFolderName(_id: ObjectId, userId: ObjectId) {
    const folder = await this.foldersRepository.findOne({
      where: { _id, userId, removed: RemovedEnum.NEVER }
    })
    return folder && folder.name ? folder.name : null
  }

  /** 通过 id 获取祖先文件夹节点组 */
  async findAncestorNode(_id: ObjectId, userId: ObjectId) {
    const ancestorNode: ObjectId[] = []
    const folder = await this.findOneById(_id, userId)
    const lib = folder.lib
    const user = await this.userService.getDirById(userId)
    const root = user.dir[lib]
    if (!root) throw new Error('无法查询到目标根目录')
    if (!folder.parentId || folder._id.toHexString() === root.toHexString()) return []
    const getAncestorNode = async (parentId: ObjectId) => {
      if (parentId.toHexString() === root.toHexString()) return
      if (parentId) {
        ancestorNode.unshift(parentId)
        const parent = await this.findOneById(parentId, userId)
        await getAncestorNode(parent.parentId)
      }
    }
    await getAncestorNode(folder.parentId)
    return ancestorNode
  }

  async findBin(userId: ObjectId) {
    const folders = await this.foldersRepository.find({
      where: { userId, removed: { $ne: RemovedEnum.NEVER } },
      select: ['_id', 'name', 'parentId', 'removed', 'lib', 'isCloud', 'updateAt', 'createAt']
    })
    return folders
  }

  async move(moveFolderDto: MoveFolderDto, userId: ObjectId) {
    // console.log(moveFolderDto)
    const { sourceId, targetId, dropPosition } = moveFolderDto
    if (sourceId === targetId) throw '不能将文件夹放入自身！'
    const _sourceId = new ObjectId(sourceId)
    const _targetId = new ObjectId(targetId)
    const isAncestor = await this.isAncestorNode(_sourceId, _targetId, userId)
    if (isAncestor) throw '目标节点是源节点的祖先节点！'
    const sourceNode = await this.findOneById(new ObjectId(_sourceId), userId)
    const targetNode = await this.findOneById(new ObjectId(_targetId), userId)
    if (!sourceNode) throw '源节点不存在！'
    if (!targetNode) throw '目标节点不存在！'
    if (sourceNode.lib !== targetNode.lib) throw '不同库的文件夹无法拖放！'
    if (dropPosition === DropPosition.BEFORE || dropPosition === DropPosition.AFTER) {
      sourceNode.parentId = targetNode.parentId
    } else if (dropPosition === DropPosition.INSIDE) {
      sourceNode.parentId = targetNode._id
    }
    this.foldersRepository.save(sourceNode).then(() => {
      return '文件夹移动成功！'
    })
  }

  async isAncestorNode(sourceId: ObjectId, targetId: ObjectId, userId: ObjectId) {
    const source = await this.findOneById(sourceId, userId)
    const target = await this.findOneById(targetId, userId)
    // console.log([source, target])
    if (!source || !target) return false
    // console.log(target.parentId)
    if (!target.parentId) return false
    let t = target
    // console.log(t.parentId)
    while (t.parentId) {
      // 注意：ObjectId 直接比较是不相等的，所以要转成字符串
      if (t.parentId.toHexString() === source._id.toHexString()) return true
      t = await this.findOneById(t.parentId, userId)
      // console.log(t.parentId)
      if (!t) return false
    }
    return false
  }

  async remove(_id: ObjectId, userId: ObjectId) {
    const folder = await this.foldersRepository.findOneAndUpdate(
      { _id, userId },
      { $set: { removed: RemovedEnum.ACTIVE, updateAt: new Date() } }
    )
    if (folder.value._id) {
      const removedIds: ObjectId[] = []
      await this.updateRemovedRecursive(folder.value._id, RemovedEnum.PASSIVE, userId, removedIds)
      return removedIds
    }
    return false
  }

  async restore(_id: ObjectId, parentId: ObjectId, userId: ObjectId): Promise<Folder | null> {
    const folder = await this.findOneById(_id, userId)
    if (folder.removed === RemovedEnum.NEVER) throw 'Is already restore!'
    folder.parentId = parentId
    folder.removed = RemovedEnum.NEVER

    // 递归恢复被动移除的子文件夹
    await this.updateRemovedRecursive(folder._id, RemovedEnum.NEVER, userId)

    const newFolder = await this.foldersRepository.save(folder)
    // 查询恢复文件夹是否有子文件夹
    const count = await this.foldersRepository.countBy({
      parentId: newFolder._id,
      userId,
      removed: RemovedEnum.NEVER
    })
    newFolder['isLeaf'] = !(count > 0)
    if (newFolder) return newFolder
    else return null
  }

  async rename(_id: ObjectId, name: string, userId: ObjectId) {
    const result = await this.foldersRepository.updateOne({ _id, userId }, { $set: { name } })
    return result.acknowledged
  }

  // TODO 这里只递归移除了文件夹，并没有处理其中文件的逻辑，待完善
  /** 递归更新移除状态 */
  async updateRemovedRecursive(folderId: ObjectId, removeMode: RemovedEnum, userId: ObjectId, removedIds?: ObjectId[]) {
    // console.log('children')
    removedIds && removedIds.push(folderId)
    const children = await this.foldersRepository.find({
      parentId: folderId,
      removed: removeMode === RemovedEnum.NEVER ? RemovedEnum.PASSIVE : RemovedEnum.NEVER,
      userId
    })
    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        const folder = await this.foldersRepository.findOneAndUpdate(
          { _id: children[i]._id },
          {
            $set: {
              removed: removeMode,
              updateAt: new Date()
            }
          }
        )
        folder.value &&
          (await this.updateRemovedRecursive(folder.value._id, removeMode, userId, removedIds && removedIds))
      }
    }
  }

  /** 彻底删除文件夹（仅删除该文件夹与其中的文件，暂不考虑递归删除子文件夹） */
  async delete(_id: ObjectId, userId: ObjectId, dirname: string) {
    try {
      const folder = await this.foldersRepository.findOneBy({ _id, userId })
      const result = await this.foldersRepository.remove(folder)
      // 注意，删除成功后， folder._id 和 result._id 都会是 undefined
      // 删除文件夹下的所有文件(不包括其子文件夹,也不包括其中已被移除的文件)
      const projects = await this.projectService.findAllByFolderId(_id, userId)
      projects.forEach(async project => {
        await this.projectService.delete(project._id, userId, dirname)
      })
    } catch (error) {
      throw error
    }
  }
  /**
   * 创建根目录
   * @param lib 库名
   * @param userId 用户 id
   * @returns 根目录 id
   */
  async createRoot(lib: LibraryEnum, userId: ObjectId) {
    const folder = new Folder()
    folder.name = `${lib.toLocaleUpperCase()} ROOT DIR`
    folder.desc = 'Root Folder'
    folder.lib = lib
    folder.isCloud = false
    folder.userId = userId
    folder.parentId = null
    const res = await this.foldersRepository.save(folder)
    return res._id
  }
  /** 查询根目录 */
  async findRootDir(userId: ObjectId, lib: LibraryEnum) {
    const user = await this.userService.findOneById(userId)
    if (user) {
      return user.dir[lib]
    } else {
      return null
    }
  }

  async recentlyFormatter(subfiles: Array<any>, lib: LibraryEnum, userId: ObjectId) {
    const subfilesData = []
    for (let i = 0; i < subfiles.length; i++) {
      subfilesData[i] = {
        id: subfiles[i]._id,
        title: subfiles[i].title,
        lib: lib,
        abbrev: subfiles[i].abbrev,
        folderId: subfiles[i].folderId,
        createAt: subfiles[i].createAt,
        updateAt: subfiles[i].updateAt
      }
    }
    const promiseArr = subfilesData.map(item => {
      return this.getFolderName(item.folderId, userId)
    })
    await Promise.all(promiseArr).then(folderNames => {
      subfilesData.forEach((item, index, arr) => {
        arr[index].folderName = folderNames[index]
      })
    })
    return subfilesData
  }
}

function subfilesFormatter(subfiles: Array<any>, lib: LibraryEnum) {
  const subfilesData = []
  for (let i = 0; i < subfiles.length; i++) {
    subfilesData[i] = {
      id: subfiles[i]._id,
      title: subfiles[i].title,
      lib: lib,
      abbrev: subfiles[i].abbrev,
      folderId: subfiles[i].folderId,
      createAt: subfiles[i].createAt,
      updateAt: subfiles[i].updateAt
    }
  }
  return subfilesData
}

function subfoldersFormatter(subfolders: Array<Folder>) {
  const subfoldersData = []
  for (let i = 0; i < subfolders.length; i++) {
    subfoldersData[i] = {
      id: subfolders[i]._id,
      lib: subfolders[i].lib,
      name: subfolders[i].name,
      createAt: subfolders[i].createAt,
      parentId: subfolders[i].parentId
    }
  }
  return subfoldersData
}

/** 递归查询整个文件夹树的方法，已弃用（现改用按需懒加载的方案）
  // 查询指定库中的所有文件夹
  async findTreeNodeByLib(lib: LibraryEnum, userId: ObjectId) {
    const user = await this.userService.findOneById(userId)
    // console.log(user.dir[lib])
    //找到所有根文件夹
    const folders = await this.foldersRepository.find({
      lib,
      userId: userId,
      parentId: user.dir[lib],
      removed: RemovedEnum.NEVER
    })
    // console.log(folders)
    const data = await this.createTreeData(folders, lib)
    // console.log(data)
    return data
  }

  async createTreeData(nodes, lib: LibraryEnum) {
    const data = []
    for (let i = 0; i < nodes.length; i++) {
      data[i] = {
        _id: nodes[i]._id,
        name: nodes[i].name,
        isLeaf: true,
        isCloud: nodes[i].isCloud,
        parentId: nodes[i].parentId ? nodes[i].parentId : '',
        children: []
      }
      const children = await this.foldersRepository.find({
        parentId: nodes[i]._id,
        lib: lib,
        removed: RemovedEnum.NEVER
      })
      if (children.length > 0) {
        data[i].isLeaf = false
        data[i].children = await this.createTreeData(children, lib)
      }
    }
    // 返回前先按名称排序
    return data.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
  }
*/
