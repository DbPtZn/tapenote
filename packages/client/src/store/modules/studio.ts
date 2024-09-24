import { defineStore } from 'pinia'

interface State {
  autoMoveAnimePointer: boolean// 自动移动动画指针
}

export const useStudioStore = defineStore('studioStore', {
  state(): State {
    return {
      autoMoveAnimePointer: false
    }
  },
  actions: {
   
  },
  getters: {
    //
  }
})
