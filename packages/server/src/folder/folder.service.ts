import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { CreateFolderDto } from './dto/create-folder.dto'
import { DropPosition, MoveFolderDto } from './dto/move-folder.dto'
import { Folder } from './entities/folder.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Not, Repository } from 'typeorm'
import { UserService } from 'src/user/user.service'
import { LibraryEnum, RemovedEnum } from 'src/enum'
import { GetRecentlyDto } from './dto/get-recently.dto'
import { ProjectService } from 'src/project/project.service'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { LoggerService } from 'src/logger/logger.service'
import { Project } from 'src/project/entities/project.entity'

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private foldersRepository: Repository<Folder>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly userLogger: UserLoggerService,
    private readonly logger: LoggerService,
    private readonly dataSource: DataSource
  ) {}

  /** 新建文件夹 */
  async create(createFolderDto: CreateFolderDto, userId: string) {
    const { name, desc, lib, parentId } = createFolderDto
    const regex = /[<>:"/\\|?*]/
    if(regex.test(name)) throw new Error(`文件名不能包含以下特殊字符：<>:"/\\|?*`)
    try {
      const parent = await this.foldersRepository.findOneBy({ id: parentId, userId })
      const folder = new Folder()
      folder.name = name
      folder.desc = desc
      folder.lib = lib
      folder.userId = userId
      folder.parentId = parentId
      folder.parent = parent
      const result = await this.foldersRepository.save(folder)
      this.userLogger.log(`创建文件夹[${result.id}]成功`)
      return result
    } catch (error) {
      this.userLogger.error(`创建文件夹失败`, error.message)
      throw error
    }
  }

  /** 查询指定文件夹的子节点 */
  async findChildrenById(id: string, userId: string) {
    try {
      // console.log(id)
      const parent = await this.foldersRepository.findOne({
        where: { id, userId, removed: RemovedEnum.NEVER },
        relations: { children: true }
      })
      // console.log(parent)
      if (!parent) throw new Error(`查询失败,找不到目标文件夹,项目id:${id}`)
      const children = parent.children
      const folders = []
      if (children && children.length > 0) {
        for (const folder of children) {
          const count = await this.foldersRepository.countBy({
            parentId: folder.id,
            userId,
            removed: RemovedEnum.NEVER
          })
          folder.removed === RemovedEnum.NEVER && folders.push({
            id: folder.id,
            name: folder.name,
            parentId: folder.parentId,
            lib: folder.lib,
            createAt: folder.createAt,
            isLeaf: !(count > 0)
          })
        }
      }
      return folders
    } catch (error) {
      throw error
    }
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
  // async getRecently(options: IPaginationOptions, lib: LibraryEnum, userId: string) {
  //   // const { lib, skip, take } = getRecentlyDto
  //   // console.log([lib, skip, take])
  //   // const subfiles = await this.projectService.findByUpdateAtDESC(skip, take, lib, userId)
  //   const result = await paginate<Project>(this.projectsRepository, options, {
  //     where: { lib, userId, removed: RemovedEnum.NEVER },
  //     relations: ['folder'],
  //     select: ['id', 'title', 'lib', 'abbrev', 'folderId', 'updateAt', 'createAt'],
  //     order: { updateAt: 'DESC' },
  //   })
  //   const subfiles = result.items.map(project => {
  //     const { folder, ...others } = project
  //     return {
  //       folderName: folder ? folder.name : '',
  //       ...others
  //     }
  //   })
  //   const data = {
  //     id: 'recently',
  //     name: '',
  //     desc: '',
  //     lib: lib,
  //     parentId: '',
  //     createAt: '',
  //     updateAt: '',
  //     subfolders: [],
  //     subfiles: subfiles
  //   }
  //   return data
  // }
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
    try {
      const ancestorNode: string[] = []
      const folder = await this.foldersRepository.findOne({
        where: { id, userId },
        relations: ['user']
      })
      const lib = folder.lib
      const root = folder.user.dir[lib]
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
    } catch (error) {
      this.userLogger.error(`获取祖先节点失败,项目id:${id}`, error.message)
      throw error
    }
  }

  /** 获取主动删除的文件夹 */
  async findTrash(userId: string) {
    // where: { userId, removed: Not(RemovedEnum.NEVER) },\
    const folders = await this.foldersRepository.find({
      where: { userId, removed: RemovedEnum.ACTIVE },
      select: ['id', 'name', 'userId', 'parentId', 'removed', 'lib', 'updateAt', 'createAt'],
      order: { updateAt: 'DESC' }
    })
    return folders
  }

  async move(moveFolderDto: MoveFolderDto, userId: string) {
    try {
      const { sourceId, targetId, dropPosition } = moveFolderDto
      if (sourceId === targetId) throw '不能将文件夹放入自身！'
      const isAncestor = await this.isAncestorNode(sourceId, targetId, userId)
      if (isAncestor) throw '目标节点是源节点的祖先节点！'
      const sourceNode = await this.foldersRepository.findOne({
        where: { id: sourceId, userId },
        relations: { parent: true }
      })
      const targetNode = await this.foldersRepository.findOne({
        where: { id: targetId, userId },
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
    try {
      const source = await this.findOneById(sourceId, userId)
      const target = await this.findOneById(targetId, userId)
      if (!source || !target) return false
      if (!target.parentId) return false
      let t = target
      while (t.parentId) {
        if (t.parentId === source.id) return true
        t = await this.findOneById(t.parentId, userId)
        if (!t) return false
      }
      return false
    } catch (error) {
      this.userLogger.error(`查询祖先节点时发生异常`, error.message)
      throw error
    }
  }

  async remove(id: string, userId: string) {
    try {
      // console.log('remove', id)
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
    } catch (error) {
      this.userLogger.error(`移除文件夹失败,项目id:${id}`, error.message)
      throw error
    }
  }

  async restore(id: string, parentId: string, userId: string): Promise<Folder | null> {
    try {
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
    } catch (error) {
      this.userLogger.error(`恢复文件夹失败,项目id:${id}`, error.message)
      throw error
    }
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
      const parent = await this.foldersRepository.findOne({
        where: { id: folderId, userId },
        relations: ['children']
      })
      // console.log(parent)
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
  
      const entity = await this.foldersRepository.findOne({
        where: { id, userId },
        relations: ['children', 'projects']
      })
      if(!entity) {
        console.log('该目录已被删除！')
        return
      }
      const that = this
      // 使用事务来确保所有操作要么全部成功，要么全部撤销
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      async function traverseDelete(folder: Folder) {
        if(!folder) return
        if(folder.children) {
          if(folder.children.length > 0) {
            for(let child of folder.children) {
              const _child = await queryRunner.manager.findOne(Folder, { where: { id: child.id }, relations: ['children', 'projects'] })
              if (_child) await traverseDelete(_child).catch(err => console.log(err))
            }
          }
        }
        // 删除文件夹下的所有文件(不包括其子文件夹,也不包括其中已被移除的文件)
        for(let project of folder.projects) {
          await that.projectService.delete(project.id, userId, dirname).catch(err => console.log('remove project',err))
        }
        folder && await queryRunner.manager.remove(folder).catch(err => console.log('remove folder', err))
      }

      try {
        await traverseDelete(entity)
        // 注意，走到这一步文件夹下的所有项目已经删除完成，因为 projectService.delete 的事务是独立的
        await queryRunner.commitTransaction()
        this.userLogger.log(`彻底删除文件夹[${entity?.name}],id:[${id}]成功`)
      } catch (error) {
        console.log('删除目录失败：' + error.message)
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        await queryRunner.release()
      }
    } catch (error) {
      console.log(error)
      this.userLogger.error(`彻底删除文件夹id:[${id}]失败`, error)
      throw error
    }
  }

  /** 查询根目录 */
  async findRootDir(userId: string, lib: LibraryEnum) {
    try {
      const user = await this.userService.findOneById(userId)
      if (user) {
        return user.dir[lib]
      } else {
        return null
      }
    } catch (error) {
      throw error
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
    // async findChildrenById(id: string, userId: string) {
  //   try {
  //     const folders = await this.foldersRepository.find({
  //       where: { parentId: id, userId, removed: RemovedEnum.NEVER },
  //       select: ['id', 'name', 'parentId', 'lib', 'createAt']
  //     })
  //     for (let i = 0; i < folders.length; i++) {
  //       const count = await this.foldersRepository.countBy({
  //         parentId: folders[i].id,
  //         userId,
  //         removed: RemovedEnum.NEVER
  //       })
  //       folders[i]['isLeaf'] = !(count > 0)
  //     }
  //     return folders
  //   } catch (error) {
  //     throw error
  //   }
  // }
*/
