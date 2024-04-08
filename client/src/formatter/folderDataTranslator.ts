import { FolderState } from '@/store'

/** 将文件夹数据转换成符合 FolderState 格式（应该弃用了，直接在后端完成转化） */
export function folderDataTranslator(data: any): FolderState {
  return {
    id: data._id || data.id,
    name: data.name,
    desc: data.desc,
    lib: data.lib,
    parentId: data.parentId,
    createAt: data.createAt,
    updateAt: data.updateAt,
    subfolders: data.subfolders,
    subfiles: data.subfiles
  }
}
