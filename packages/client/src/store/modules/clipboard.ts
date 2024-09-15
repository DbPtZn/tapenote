import { LibraryEnum } from '@/enums'
import { defineStore } from 'pinia'
import useStore from '..'

interface SourceFragment {
  fragmentId: string
  projectId: string
  type: 'cut' | 'copy'
  account: string
  hostname: string,
  success: () => void // 粘贴成功的回调
}
interface TargetFragment {
  fragmentId: string
  projectId: string
  position: 'before' | 'after' | 'insert'
  account: string
  hostname: string
}

interface State {
  file: { id: string; lib: LibraryEnum; isCut: boolean; account: string; hostname: string } | undefined
  folder: { id: string; lib: LibraryEnum; isCut: boolean; account: string; hostname: string } | undefined
  fragment: SourceFragment[]
}

export const useClipboardStore = defineStore('clipboardStore', {
  state(): State {
    return {
      file: undefined,
      folder: undefined,
      fragment: []
    }
  },
  actions: {
    copyFile(id: string, lib: LibraryEnum, isCut: boolean, account: string, hostname: string) {
      this.$reset()
      this.file = {
        id,
        lib,
        isCut,
        account,
        hostname
      }
      console.log(this.file)
    },
    pasteFile(folderId: string, lib: LibraryEnum, account: string, hostname: string) {
      // console.log(this.file)
      return new Promise((resolve, reject) => {
        if (!this.file) return reject('未复制相关文件')
        const { projectStore } = useStore()
        if (lib !== this.file.lib) return reject('复制文件类型不一致')
        projectStore.copy(this.file.id, folderId, account, hostname).then(() => resolve(''))
      })
    },
    /** 复制文件夹（待开放） */
    copyFolder() {
      this.$reset()
    },
    pasteFolder() {},
    /** 复制片段 */
    copyFragment(data: SourceFragment) {
      if (this.fragment.length !== 0) this.fragment = []
      this.fragment.push(data)
    },
    pasteFragment(data: TargetFragment) {
      return new Promise((resolve, reject) => {
        if (this.fragment.length === 0)  return reject('未复制相关片段')
        const source = this.fragment[0]
        const target = data
        const { projectStore } = useStore()
        if (source.account !==  target.account || source.hostname !== target.hostname) {
          return reject('目前不能在不同用户之间复制片段')
        }
        if (source.projectId === target.projectId && source.fragmentId === target.fragmentId && source.type === 'cut') {
          return reject('操作无意义')
        }
        projectStore.pasteFragment({
          sourceProjectId: source.projectId,
          targetProjectId: target.projectId,
          sourceFragmentId: source.fragmentId,
          targetFragmentId: target.fragmentId,
          position: target.position,
          type: source.type
        },
        target.account,
        target.hostname
        ).then(() => {
          // this.fragment = [] // 挪至事件中清理
          source.success()
          resolve('')
        }).catch(err => {
          // this.fragment = [] // 挪至事件中清理
          console.log(err)
          reject('粘贴失败')
        })
      })
    }
  },
  getters: {
    //
  }
})
