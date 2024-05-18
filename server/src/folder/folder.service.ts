import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { CreateFolderDto } from './dto/create-folder.dto'
import { DropPosition, MoveFolderDto } from './dto/move-folder.dto'
import { Folder } from './entities/folder.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { UserService } from 'src/user/user.service'
import { LibraryEnum, RemovedEnum } from 'src/enum'
import { GetRecentlyDto } from './dto/get-recently.dto'
import { ProjectService } from 'src/project/project.service'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { LoggerService } from 'src/logger/logger.service'

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private foldersRepository: Repository<Folder>,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly userLogger: UserLoggerService,
    private readonly logger: LoggerService
  ) {}

  /** 新建根目录 */
  async createUserRoot(userId: string) {
    // console.log('folder')
    this.userLogger.log(`正在创建用户根目录...`)
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
      // console.log(dir)
      this.userLogger.log(`创建根目录成功, 正在存入用户数据对象...`)
      await this.userService.createUserRoot(dir, userId)
      this.userLogger.log(`创建用户根目录成功！`)
    } catch (error) {
      this.userLogger.error(`创建用户根目录失败！原因：${error.message}`)
      throw error
    }
  }

  /** 创建根目录 */
  async createRoot(lib: LibraryEnum, userId: string) {
    const folder = new Folder()
    folder.name = `${lib.toLocaleUpperCase()} ROOT DIR`
    folder.desc = 'Root Folder'
    folder.lib = lib
    folder.isCloud = false
    folder.userId = userId
    folder.parentId = null
    const res = await this.foldersRepository.save(folder)
    return res.id
  }

  /** 新建文件夹 */
  async create(createFolderDto: CreateFolderDto, userId: string) {
    const { name, desc, lib, parentId } = createFolderDto
    const folder = new Folder()
    folder.name = name
    folder.desc = desc
    folder.lib = lib
    folder.userId = userId
    folder.parentId = parentId
    return this.foldersRepository.save(folder)
  }

  /** 查询指定文件夹的子节点 */
  async findChildrenById(id: string, userId: string) {
    const folders = await this.foldersRepository.find({
      where: { parentId: id, userId, removed: RemovedEnum.NEVER },
      select: ['id', 'name', 'parentId', 'lib', 'createAt']
    })
    for (let i = 0; i < folders.length; i++) {
      const count = await this.foldersRepository.countBy({
        parentId: folders[i].id,
        userId,
        removed: RemovedEnum.NEVER
      })
      folders[i]['isLeaf'] = !(count > 0)
      // folders[i]['children'] = count > 0 ? undefined : []
    }
    // console.log(folders)
    return folders
  }

  /** 通过 id 查询 */
  async findOneById(id: string, userId: string) {
    try {
      const folder = await this.foldersRepository.findOneBy({ id: id, userId })
      return folder
    } catch (error) {
      console.log(error)
      throw new Error(`查询失败,找不到目标文件夹,项目id:${id}`)
    }
  }

  /** 查询文件夹是否存在或者处于被移除状态 */
  async queryOneById(id: string, userId: string) {
    return this.foldersRepository
      .findOneBy({ id: id, userId })
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

  /** 获取文件夹数据 */
  async getFolderData(id: string, userId: string) {
    // console.log(id, userId)
    const folder = await this.foldersRepository.findOne({
      where: { id: id, userId },
      relations: ['projects']
    })
    const subfolders = await this.findChildrenById(id, userId)
    const subfiles = folder.projects.filter(item => item.removed === RemovedEnum.NEVER)

    const data = {
      id: folder.id,
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

  /** 获取最近编辑文档 考虑位置挪到projectService 中 */
  async getRecently(getRecentlyDto: GetRecentlyDto, userId: string) {
    const { lib, skip, take } = getRecentlyDto
    // console.log([lib, skip, take])
    const subfiles = await this.projectService.findByUpdateAtDESC(skip, take, lib, userId)
    const data = {
      id: 'recently',
      name: '',
      desc: '',
      lib: lib,
      parentId: '',
      createAt: '',
      updateAt: '',
      subfolders: [],
      subfiles: subfiles
    }
    return data
  }

  /** 通过 id 获取文件夹名称 */
  async getFolderName(id: string, userId: string) {
    const folder = await this.foldersRepository.findOne({
      where: { id, userId, removed: RemovedEnum.NEVER }
    })
    return folder && folder.name ? folder.name : null
  }

  /** 通过 id 获取祖先文件夹节点组 */
  async findAncestorNode(id: string, userId: string) {
    const ancestorNode: string[] = []
    const folder = await this.findOneById(id, userId)
    const lib = folder.lib
    const user = await this.userService.getDirById(userId)
    const root = user.dir[lib]
    if (!root) throw new Error('无法查询到目标根目录')
    if (!folder.parentId || folder.id === root) return []
    const getAncestorNode = async (parentId: string) => {
      if (parentId === root) return
      if (parentId) {
        ancestorNode.unshift(parentId)
        const parent = await this.findOneById(parentId, userId)
        await getAncestorNode(parent.parentId)
      }
    }
    await getAncestorNode(folder.parentId)
    return ancestorNode
  }

  async findBin(userId: string) {
    const folders = await this.foldersRepository.find({
      where: { userId, removed: Not(RemovedEnum.NEVER) },
      select: ['id', 'name', 'parentId', 'removed', 'lib', 'isCloud', 'updateAt', 'createAt']
    })
    return folders
  }

  async move(moveFolderDto: MoveFolderDto, userId: string) {
    try {
      const { sourceId, targetId, dropPosition } = moveFolderDto
      if (sourceId === targetId) throw '不能将文件夹放入自身！'
      const _sourceId = sourceId
      const _targetId = targetId
      const isAncestor = await this.isAncestorNode(_sourceId, _targetId, userId)
      if (isAncestor) throw '目标节点是源节点的祖先节点！'
      const sourceNode = await this.foldersRepository.findOne({
        where: { id: _sourceId, userId },
        relations: { parent: true }
      })
      const targetNode = await this.foldersRepository.findOne({
        where: { id: _sourceId, userId },
        relations: { parent: true }
      })
      if (!sourceNode) throw '源节点不存在！'
      if (!targetNode) throw '目标节点不存在！'
      if (sourceNode.lib !== targetNode.lib) throw '不同库的文件夹无法拖放！'
      if (dropPosition === DropPosition.BEFORE || dropPosition === DropPosition.AFTER) {
        sourceNode.parentId = targetNode.parentId
        sourceNode.parent = targetNode.parent
      } else if (dropPosition === DropPosition.INSIDE) {
        sourceNode.parentId = targetNode.id
        sourceNode.parent = targetNode
      }
      this.foldersRepository.save(sourceNode).then(() => {
        return '文件夹移动成功！'
      })
    } catch (error) {
      throw error
    }
  }

  async isAncestorNode(sourceId: string, targetId: string, userId: string) {
    const source = await this.findOneById(sourceId, userId)
    const target = await this.findOneById(targetId, userId)
    // console.log([source, target])
    if (!source || !target) return false
    // console.log(target.parentId)
    if (!target.parentId) return false
    let t = target
    // console.log(t.parentId)
    while (t.parentId) {
      // 注意：string 直接比较是不相等的，所以要转成字符串
      if (t.parentId === source.id) return true
      t = await this.findOneById(t.parentId, userId)
      // console.log(t.parentId)
      if (!t) return false
    }
    return false
  }

  async remove(id: string, userId: string) {
    const folder = await this.foldersRepository.findOne({ where: { id, userId } })
    // { $set: { removed: RemovedEnum.ACTIVE, updateAt: new Date() } }
    folder.removed = RemovedEnum.ACTIVE
    await this.foldersRepository.save(folder)
    if (folder.id) {
      const removedIds: string[] = []
      await this.updateRemovedRecursive(folder.id, RemovedEnum.PASSIVE, userId, removedIds)
      return removedIds
    }
    return false
  }

  async restore(id: string, parentId: string, userId: string): Promise<Folder | null> {
    const folder = await this.findOneById(id, userId)
    if (folder.removed === RemovedEnum.NEVER) throw 'Is already restore!'
    folder.parentId = parentId
    folder.removed = RemovedEnum.NEVER

    // 递归恢复被动移除的子文件夹
    await this.updateRemovedRecursive(folder.id, RemovedEnum.NEVER, userId)

    const newFolder = await this.foldersRepository.save(folder)
    // 查询恢复文件夹是否有子文件夹
    const count = await this.foldersRepository.countBy({
      parentId: newFolder.id,
      userId,
      removed: RemovedEnum.NEVER
    })
    newFolder['isLeaf'] = !(count > 0)
    if (newFolder) return newFolder
    else return null
  }

  async rename(id: string, name: string, userId: string) {
    try {
      const folder = await this.foldersRepository.findOne({ where: { id, userId } })
      folder.name = name
      return await this.foldersRepository.save(folder)
    } catch (error) {
      throw error
    }
  }

  // TODO 这里只递归移除了文件夹，并没有处理其中文件的逻辑，考虑是否处理其中文件
  /** 递归更新移除状态 */
  async updateRemovedRecursive(folderId: string, removeMode: RemovedEnum, userId: string, removedIds?: string[]) {
    try {
      removedIds && removedIds.push(folderId)
      this.foldersRepository.find
      const parent = await this.foldersRepository.findOne({
        where: { id: folderId, userId },
        relations: ['children']
      })
      console.log(parent)
      const children = parent.children
      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          children[i].removed = removeMode
          await this.foldersRepository.save(children[i])
          await this.updateRemovedRecursive(children[i].id, removeMode, userId, removedIds && removedIds)
        }
      }
    } catch (error) {
      throw error
    }
  }

  /** 彻底删除文件夹（仅删除该文件夹与其中的文件，暂不考虑递归删除子文件夹） */
  async delete(id: string, userId: string, dirname: string) {
    try {
      const folder = await this.foldersRepository.findOne({
        where: { id, userId },
        relations: ['projects']
      })
      // 删除文件夹下的所有文件(不包括其子文件夹,也不包括其中已被移除的文件)
      folder.projects.forEach(async project => {
        await this.projectService.delete(project.id, userId, dirname)
      })
      await this.foldersRepository.remove(folder)
      this.userLogger.log(`彻底删除文件夹[${folder.name}],id:[${id}]成功`)
    } catch (error) {
      this.userLogger.error(`彻底删除文件夹id:[${id}]失败`, error)
      throw error
    }
  }

  /** 查询根目录 */
  async findRootDir(userId: string, lib: LibraryEnum) {
    const user = await this.userService.findOneById(userId)
    if (user) {
      return user.dir[lib]
    } else {
      return null
    }
  }
}

function subfilesFormatter(subfiles: Array<any>, lib: LibraryEnum) {
  const subfilesData = []
  for (let i = 0; i < subfiles.length; i++) {
    subfilesData[i] = {
      id: subfiles[i].id,
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
      id: subfolders[i].id,
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
  async findTreeNodeByLib(lib: LibraryEnum, userId: string) {
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
        id: nodes[i].id,
        name: nodes[i].name,
        isLeaf: true,
        isCloud: nodes[i].isCloud,
        parentId: nodes[i].parentId ? nodes[i].parentId : '',
        children: []
      }
      const children = await this.foldersRepository.find({
        parentId: nodes[i].id,
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
    async updateRemovedRecursive(folderId: string, removeMode: RemovedEnum, userId: string, removedIds?: string[]) {
      // console.log('children')
      removedIds && removedIds.push(folderId)
      const children = await this.foldersRepository.find({
        where: {
          parentId: folderId,
          removed: removeMode === RemovedEnum.NEVER ? RemovedEnum.PASSIVE : RemovedEnum.NEVER,
          userId
        }
      })
      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          const folder = await this.foldersRepository.findOneAndUpdate(
            { id: children[i].id },
            {
              $set: {
                removed: removeMode,
                updateAt: new Date()
              }
            }
          )
          folder.value &&
            (await this.updateRemovedRecursive(folder.value.id, removeMode, userId, removedIds && removedIds))
        }
      }
    }
      // async recentlyFormatter(subfiles: Array<any>, lib: LibraryEnum, userId: string) {
  //   const subfilesData = []
  //   for (let i = 0; i < subfiles.length; i++) {
  //     subfilesData[i] = {
  //       id: subfiles[i].id,
  //       title: subfiles[i].title,
  //       lib: lib,
  //       abbrev: subfiles[i].abbrev,
  //       folderId: subfiles[i].folderId,
  //       createAt: subfiles[i].createAt,
  //       updateAt: subfiles[i].updateAt
  //     }
  //   }
  //   const promiseArr = subfilesData.map(item => {
  //     return this.getFolderName(item.folderId, userId)
  //   })
  //   await Promise.all(promiseArr).then(folderNames => {
  //     subfilesData.forEach((item, index, arr) => {
  //       arr[index].folderName = folderNames[index]
  //     })
  //   })
  //   return subfilesData
  // }
*/
