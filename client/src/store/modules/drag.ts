import { LibraryEnum } from '@/enums'
import { defineStore } from 'pinia'

export interface DragState {
  // id: string
  lib: LibraryEnum | null
  dragging: boolean
  isFile: boolean
  isCache: boolean
}

export const useDragStore = defineStore('dragStore', {
  state(): DragState {
    return {
      lib: null,
      dragging: false,
      isFile: false,
      isCache: false
    }
  },
  actions: {
    //
  },
  getters: {
    //
  }
})
