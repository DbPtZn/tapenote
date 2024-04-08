import { creator, CreatorApi } from '@/api'
import { defineStore } from 'pinia'
import _ from 'lodash'
import { LibraryEnum } from '@/enums'
import { TreeOption } from 'naive-ui'
import useStore from '..'
export interface TreeNode extends TreeOption  {
  id?: string
  lib?: LibraryEnum
  parentId?: string
  createAt?: string
  children?: TreeNode[]
}

export interface Subfolder {
  id: string
  lib?: LibraryEnum
  name: string
  createAt: string
  parentId: string
}

export interface Subfile {
  id: string
  title: string
  lib: LibraryEnum
  abbrev: string
  updateAt: string
  createAt: string
  folderId: string
  folderName?: string
}

export enum SortType {
  UPDATE = 'update',
  UPDATE_REVERSE = 'update_reverse',
  CREATE = 'create',
  CREATE_REVERSE = 'create_reverse',
  NAME = 'name',
  NAME_REVERSE = 'name_reverse'
}

export interface FolderState {
  id: string | 'recently'
  name: string
  desc: string
  lib: LibraryEnum | undefined
  parentId: string
  createAt: string
  updateAt: string
  subfolders?: Array<Subfolder>
  subfiles?: Array<Subfile>
}

export const useFolderStore = defineStore('folderStore', {
  state(): FolderState {
    return {
      id: '',
      name: '',
      desc: '',
      lib: undefined,
      parentId: '',
      createAt: '',
      updateAt: '',
      subfolders: [],
      subfiles: []
    }
  },
  actions: {
    creatorApi() {
      const { userStore } = useStore()
      return creator.getCreatorApi(userStore.account, userStore.hostname)!
    },
    /** 将当前目录信息保存至缓存 */
    saveCache(account: string, hostname: string) {
      if (!account || !hostname) return
      const data = JSON.stringify(this.$state)
      localStorage.setItem(`Folder:${account}&${hostname}`, data)
    },
    removeCache(account: string, hostname: string) {
      localStorage.removeItem(`Folder:${account}&${hostname}`)
    },
    /** 获取缓存 */
    getCache(account: string, hostname: string) {
      const data = localStorage.getItem(`Folder:${account}&${hostname}`)
      if (data) {
        const state = JSON.parse(data)
        this.$patch(state)
      } else {
        // 如果没有缓存，则清除当前状态（避免切换用户时没有缓存，状态无更新）
        this.$reset()
      }
    },
    /** 创建文件夹并设置状态 */
    createAndSet(params: Parameters<typeof CreatorApi.prototype.folder.create>[0]): Promise<TreeNode> {
      return this.creatorApi().folder.create<FolderState>(params).then((res) => {
        // const data = folderDataTranslator(res.data)
        const data = res.data
        this.set(data)
        return {
          key: data.id,
          id: data.id,
          name: data.name,
          isLeaf: true,
          parentId: data.parentId,
          children: []
        }
      })
    },
    /** 获取数据并设置状态 */
    fetchAndSet(folderId: string) {
      return this.fetch(folderId).then((res) => {
        this.set(res.data)
        // this.set(folderDataTranslator(res.data))
      })
    },
    /** 获取文件夹数据 */
    fetch(folderId: string) {
      return this.creatorApi().folder.get<FolderState>(folderId)
    },
    /** 设置状态管理 */
    set(data: FolderState) {
      // 确保每一项数据不是 undefined
      // 确保 lib 值匹配其枚举类型
      if (data.lib && Object.values(LibraryEnum).includes(data.lib)) {
        this.$state = {
          id: data.id || '',
          name: data.name || '',
          desc: data.desc || '',
          lib: data.lib,
          parentId: data.parentId || '',
          createAt: data.createAt || '',
          updateAt: data.updateAt || '',
          subfolders: data.subfolders || [],
          subfiles: data.subfiles || []
        }
      }
    },
    fetchRecentlyAndSet(dto: Parameters<typeof CreatorApi.prototype.folder.getRecently>[0]) {
      return this.creatorApi().folder.getRecently<FolderState>(dto).then(res => {
        const data = res.data
        if (this.id !== 'recently' || this.lib !== data.lib) {
          this.set(data)
          return
        }
        if (this.subfiles && data.subfiles && this.subfiles!.length > 0 && data.id === 'recently') {
          if(this.lib === data.lib) {
            this.subfiles.push(...data.subfiles)
          }
        }
      })
    },
    getSubfiles(sortType?: SortType) {
      switch (sortType) {
        case SortType.UPDATE:
          return this.getSubfilesSortUpdateAt
        case SortType.NAME:
          return this.getSubfilesSortByName
        case SortType.CREATE:
          return this.getSubfilesSortByCreateAt
        case SortType.UPDATE_REVERSE:
          return this.getSubfilesSortUpdateAtReverse
        case SortType.NAME_REVERSE:
          return this.getSubfilesSortByNameReverse
        case SortType.CREATE_REVERSE:
          return this.getSubfilesSortByCreateAtReverse
        default:
          return this.getSubfilesSortUpdateAt
      }
    },
    addSubFile(newFile: any, folderId: string, lib: LibraryEnum) {
      if (this.id === folderId || this.id === 'recently') {
        const data: Subfile = {
          id: newFile.id,
          title: newFile.title,
          lib: lib,
          abbrev: newFile.abbrev,
          updateAt: newFile.updateAt,
          createAt: newFile.createAt,
          folderId,
          folderName: newFile.folderName || (this.id === 'recently' && lib ? `${lib.toLocaleUpperCase()} ROOT DIR` : '')
        }
        this.subfiles?.unshift(data)
      }
    },
    removeSubfolderById(id: string) {
      const folders = this.subfolders?.splice(this.subfolders.findIndex(item => item.id === id), 1)
      return folders && folders[0]
    },
    removeSubfileById(id: string) {
      const files = this.subfiles?.splice(this.subfiles.findIndex(item => item.id === id), 1)
      return files && files[0]
    },
    updateCard(value: string, id: string, type: 'title' | 'content', folderId?: string) {
      // 传入 folderId 参数时，会判断改动的项目是否位于当前开启的文件夹下，否时直接跳出
      if (folderId && folderId !== this.id && this.id !== 'recently') return
      this.subfiles?.some((item, index, arr) => {
        if (item.id === id) {
          if (type === 'content') {
            arr[index].abbrev = value.replace(/<[^>]+>/g, '').slice(0, 100)
          }
          else if (type === 'title') {
            arr[index].title = value
          }
          arr[index].updateAt = new Date(Date.now()).toString()
          return true
        }
      })
    },
    /** 初始化状态管理 */
    init() {
      this.$reset()
    },
    // movefolder(sourceId: string, targetId: string, type: string) {
    //   return creatorApi.folder.moveFolder(sourceId, targetId, type)
    // },
    // moveFile(fileId: string, targetId: string, lib: LibraryEnum) {
    //   return creatorApi.folder.moveFile(fileId, targetId, lib)
    // },
    // rename(newName: string, folderId: string) {
    //   return creatorApi.folder.rename(newName, folderId)
    // },
    // restore(folderId: string) {
    //   return creatorApi.folder.restore(folderId)
    // },
    // remove(folderId: string) {
    //   return creatorApi.folder.remove(folderId)
    // },
    // delete(folderId: string) {
    //   return creatorApi.folder.delete(folderId)
    // }
  },
  getters: {
    getSubfilesSortByName(): Subfile[] {
      return this.subfiles ? _.sortBy(this.subfiles, (item) => item.title) : []
    },
    getSubfilesSortUpdateAt(): Subfile[] {
      return this.subfiles
        ? _.sortBy(this.subfiles, (item) => new Date(item.updateAt))
        : []
    },
    getSubfilesSortByCreateAt(): Subfile[] {
      return this.subfiles
        ? _.sortBy(this.subfiles, (item) => new Date(item.createAt))
        : []
    },
    // reverse
    getSubfilesSortByNameReverse(): Subfile[] {
      return this.subfiles ? _.sortBy(this.subfiles, (item) => item.title).reverse() : []
    },
    getSubfilesSortUpdateAtReverse(): Subfile[] {
      return this.subfiles
        ? _.sortBy(this.subfiles, (item) => new Date(item.updateAt)).reverse()
        : []
    },
    getSubfilesSortByCreateAtReverse(): Subfile[] {
      return this.subfiles
        ? _.sortBy(this.subfiles, (item) => new Date(item.createAt)).reverse()
        : []
    },
    getSubfolders(): Subfolder[] {
      return this.subfolders || []
    },
    
  }
})

// removeSubFileByIndex(index: number) {
//   // 实际渲染是重新排序后的file，所以 index 和 状态管理数据不一致。
//   const files = this.subfiles?.splice(index, 1)
//   return files && files[0]
// },