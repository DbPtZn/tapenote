import { defineStore } from 'pinia'
// type TabOption = 'home' | 'folder' | 'share' | 'user'
interface State {
  isMobile: boolean  // 是否为移动端
  // tab: TabOption
}

export const useMicroStore = defineStore('microStore', {
  state(): State {
    return {
      isMobile: false,
      // tab: 'home'
    }
  },
  actions: {
    
  },
  getters: {
    //
  }
})
