import { LibraryEnum } from '@/enums'
import { FolderState, TreeNode } from '@/store'
import { folderDataTranslator, treeNodeTranslator } from '@/formatter'
import { AxiosInstance } from 'axios'
interface FolderNode {
  _id: string
  parentId: string
  name: string
  lib: LibraryEnum
  createAt: string,
  isLeaf: boolean,
  children: FolderNode[]
}

interface CreateFolderDto {
  name: string
  desc: string
  lib: LibraryEnum
  parentId?: string
}

interface GetRecentlyDto {
  lib: LibraryEnum
  skip: number
  take: number
}

export const folder = (axios: AxiosInstance) => {
  return {
    create<T>(data: CreateFolderDto) {
      // console.log(data)
      return axios.post<T>('/folder/write/create', data)
      // .then(res => folderDataTranslator(res.data))
    },
    get<T>(folderId: string) {
      return axios.get<T>('/folder/read/' + folderId)
      // .then(res => folderDataTranslator(res.data))
    },
    getChildren(folderId: string) {
      return axios.get<FolderNode[]>('/folder/read/children/' + folderId)
      // .then(res => treeNodeTranslator(res.data))
    },
    getRecently<T>(dto: GetRecentlyDto) {
      return axios.post<T>('/folder/read/recently', dto)
    },
    copyAndPaste<T>(sourceId: string, targetId: string) {
      return axios.post<T>('/folder/write/copy', { data: { sourceId, targetId } })
    },
    /**
     * 移动文件夹
     * @param sourceId 源id
     * @param targetId 目标id
     * @param type 'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
     * @returns
     */
    moveFolder<T>(params: { sourceId: string, targetId: string, dropPosition:  "inside" | "before" | "after" }) {
      return axios.patch<T>('/folder/update/move/folder', params)
    },
    moveFile<T>(fileId: string, targetId: string, lib: LibraryEnum) {
      return axios.patch<T>('/folder/update/move/file', { data: { fileId, targetId, lib } })
    },
    rename<T>(newName: string, folderId: string) {
      return axios.patch<T>('/folder/update/rename/' + folderId, { name: newName })
    },
    remove<T>(folderId: string) {
      return axios.patch<T>('/folder/update/remove/' + folderId)
    },
    restore<T>(folderId: string, parentId: string) {
      return axios.patch<T>('/folder/update/restore/' + folderId + '&' + parentId)
    },
    delete<T>(folderId: string) {
      return axios.delete<T>('/folder/delete/' + folderId)
    },
    queryExist(folderId: string) {
      return axios.get<boolean>('/folder/read/query/exist/' + folderId)
    },
    getAncestorNode<T>(folderId: string) {
      return axios.get<T>('/folder/read/ancestor/' + folderId)
    },
  }
}

// /** 将文件夹数据转换成符合 FolderState 格式 */
// export function folderDataTranslator(data: any): FolderState {
//   return {
//     id: data._id,
//     name: data.name,
//     desc: data.desc,
//     lib: data.lib,
//     isCloud: data.isCloud,
//     parentId: data.parentId,
//     createAt: data.createAt,
//     updateAt: data.updateAt,
//     subfolders: data.subfolders,
//     subfiles: data.subfiles
//   }
// }
/** 将文件夹数据转化成符合 TreeNode 格式 */
// export function treeNodeTranslator(data: FolderNode[]): TreeNode[] {
//   const tree: TreeNode[] = []
//   for(let i = 0; i < data.length; i++) {
//     tree[i] = {
//       key: data[i]._id,
//       id: data[i]._id,
//       parentId: data[i].parentId,
//       label: data[i].name,
//       isCloud: data[i].isCloud,
//       createAt: data[i].createAt,
//       lib: data[i].lib,
//       isLeaf: data[i].isLeaf
//     }
//   }
//   return tree
// }

// function recursionTranslator(data: FolderNode[]): TreeNode[] {
//   const tree: TreeNode[] = []
//   for(let i = 0; i < data.length; i++) {
//     tree[i] = {
//       key: data[i]._id,
//       id: data[i]._id,
//       parentId: data[i].parentId,
//       label: data[i].name,
//       isCloud: data[i].isCloud,
//       lib: data[i].lib,
//       createAt: data[i].createAt,
//       isLeaf: true,
//       children: []
//     }
//     if (data[i].children.length > 0) {
//       tree[i].isLeaf = false
//       tree[i].children = recursionTranslator(data[i].children)
//     }
//   }
//   return tree
// }
// getTree<T>(lib: LibraryEnum) {
//   return axios.get<GetFolderTreeResponse>(`/folder/read/tree/${lib}`).then(res => {
//     console.log(res.data)
//     return recursionTranslator(res.data)
//   })
// }