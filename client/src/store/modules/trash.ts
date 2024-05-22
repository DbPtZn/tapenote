import { CreatorApi, creator } from '@/api'
import { defineStore } from 'pinia'
import { Subfile, TreeNode } from './folder'
import { LibraryEnum } from '@/enums'
import { RemovedEnum } from '@/enums'
import useStore from '..'
type TrashName = Parameters<CreatorApi['trash']['get']>[0]
enum TrashNameEnum {
  FOLDER = 'folder',
  NOTE = 'note',
  COURSE = 'course',
  PROCEDURE = 'procedure'
}
interface TrashData {
  folderId?: string
  folderName?: string
  id: string
  name: string
  lib?: LibraryEnum
  abbrev?: string
  removed?: RemovedEnum
  updateAt: string
  createAt?: string
}

interface State {
  folders: TrashData[]
  notes: TrashData[]
  procedures: TrashData[]
  courses: TrashData[]
}

export const useTrashStore = defineStore('trashStore', {
  state(): State {
    return {
      folders: [],
      notes: [],
      procedures: [],
      courses: []
    }
  },
  actions: {
    creatorApi() {
      const { userStore } = useStore()
      return creator.getCreatorApi(userStore.account, userStore.hostname)!
    },
    fetchAndSet(trashName: TrashName) {
      // console.log(trashName)
      switch (trashName) {
        case TrashNameEnum.FOLDER:
          // this.folders.length === 0 && this.fetch(trashName)
          this.fetch(trashName)
          break
        case TrashNameEnum.NOTE:
          // this.notes.length === 0  && this.fetch(trashName)
          this.fetch(trashName)
          break
        case TrashNameEnum.COURSE:
          // this.courses.length === 0  && this.fetch(trashName)
          this.fetch(trashName)
          break
        case TrashNameEnum.PROCEDURE:
          // this.procedures.length === 0  && this.fetch(trashName)
          this.fetch(trashName)
          break
      }
    },
    fetch(trashName: TrashName) {
      return this.creatorApi().trash.get<TrashData[]>(trashName).then(res => {
        this.set(res.data, trashName)
      })
    },
    set(data: TrashData[], trashName: TrashName) {
      switch (trashName) {
        case TrashNameEnum.FOLDER:
          this.folders = data
          break
        case TrashNameEnum.NOTE:
          this.notes = data.map(item => {
            return {
              ...item,
              lib: LibraryEnum.NOTE
            }
          })
          break
        case TrashNameEnum.COURSE:
          this.courses = data.map(item => {
            return {
              ...item,
              lib: LibraryEnum.COURSE
            }
          })
          break
        case TrashNameEnum.PROCEDURE:
          this.procedures = data.map(item => {
            return {
              ...item,
              lib: LibraryEnum.PROCEDURE
            }
          })
          break
      }
    },
    add(data: TrashData, trashName: TrashName){
      switch (trashName) {
        case TrashNameEnum.FOLDER:
          // this.folders.length !== 0 && this.folders.unshift(data)
          this.folders.unshift(data)
          break
        case TrashNameEnum.NOTE:
          this.notes.unshift(data)
          break
        case TrashNameEnum.COURSE:
          this.courses.unshift(data)
          break
        case TrashNameEnum.PROCEDURE:
          this.procedures.unshift(data)
          break
      }
    },
    subFileToTrashData(file: Subfile): TrashData{
      const { folderTreeStore } = useStore()
      const folderName = folderTreeStore.findNodeNameById(file.folderId, file.lib)
      return {
        id: file.id || '',
        name: file.title || '',
        lib: file.lib,
        folderId: file.folderId,
        folderName,
        abbrev: file.abbrev,
        // isCloud: file.isCloud,
        removed: RemovedEnum.ACTIVE,
        updateAt: (new Date()).toString(),
        // createAt: node.createAt,
      }
    },
    treeNodeToTrashData(node: TreeNode): TrashData {
      const { folderTreeStore } = useStore()
      const folderName = node.parentId && node.lib ? folderTreeStore.findNodeNameById(node.parentId, node.lib) : undefined
      return {
        id: node.id || '',
        name: node.label || '',
        lib: node.lib,
        folderId: node.parentId,
        folderName,
        // isCloud: node.isCloud,
        removed: RemovedEnum.ACTIVE,
        updateAt: (new Date()).toString(),
        createAt: node.createAt,
      }
    },
    TrashDataToTreeNode(data: TrashData): TreeNode {
      return {
        key: data.id,
        id: data.id,
        label: data.name,
        parentId: data.folderId,
        lib: data.lib,
        // isCloud: data.isCloud,
        isLeaf: false
      }
    },
    remove(index: number, trashName: TrashName) {
      switch (trashName) {
        case TrashNameEnum.FOLDER:
          // 恢复时递归恢复子文件夹，所以回收站要递归移除关联的子文件夹
          removeFolder(this.folders, this.folders[index].id)
          break
        case TrashNameEnum.NOTE:
          this.notes.splice(index, 1)
          break
        case TrashNameEnum.COURSE:
          this.courses.splice(index, 1)
          break
        case TrashNameEnum.PROCEDURE:
          this.procedures.splice(index, 1)
          break
      }
    },
    deleteFolder(index: number) {
      // 删除时仅删除当前文件夹，所以回收站仅移除当前文件夹
      this.folders.splice(index, 1)
    }
  },
  getters: {
  }
})

function removeFolder(foldersData: TrashData[], targetId: string) {
  foldersData.splice(foldersData.findIndex(item => item.id === targetId), 1)
  for (let i = 0; i < foldersData.length; i++) {
    if (foldersData[i].folderId === targetId && foldersData[i].removed === RemovedEnum.PASSIVE) {
      removeFolder(foldersData, foldersData[i].id)
      // 移除操作导致了数据数量减少，所以要回退一格计数
      i--
    }
  }
}