import { RouteNameEnum } from '@/enums'
import { defineStore } from 'pinia'
// type TabOption = 'recent' | 'folder' | 'share' | 'user'
interface State {
  isMobile: boolean  // 是否为移动端
  tab: RouteNameEnum
}

export const useMicroStore = defineStore('microStore', {
  state(): State {
    return {
      isMobile: false,
      tab: RouteNameEnum.RECENT
    }
  },
  actions: {
    
  },
  getters: {
    //
  }
})
