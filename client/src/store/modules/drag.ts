// import { localApi } from '@/api/local'
import { LibraryEnum } from '@/enums'
import { defineStore } from 'pinia'
import { Component, Ref, ref } from 'vue'

export interface DragState {
  // id: string
  lib: LibraryEnum | null
  dragging: boolean
  isFile: boolean
}

export const useDragStore = defineStore('dragStore', {
  state(): DragState {
    return {
      lib: null,
      dragging: false,
      isFile: false
    }
  },
  actions: {
    //
  },
  getters: {
    //
  }
})
