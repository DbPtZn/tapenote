import { ThemeEnum } from '@/enums'
import { darkTheme } from 'naive-ui/es'
import { defineStore } from 'pinia'

interface State {
  theme: typeof darkTheme | null
  isSidebarCollapse: boolean
  isItemListCollapse: boolean
  isCacheListShow: boolean
}

export const useSettingStore = defineStore('settingStore', {
  state(): State {
    return {
      theme: darkTheme,
      isSidebarCollapse: false,
      isItemListCollapse: false,
      isCacheListShow: false,
    }
  },
  actions: {
    useTheme(themeState: ThemeEnum) {
      switch (themeState) {
        case ThemeEnum.DARK:
          this.useDark()
          break
        case ThemeEnum.LIGHT:
          this.useLight()
          break
        default:
          return
      }
    },
    useDark() {
      this.theme = darkTheme
    },
    useLight() {
      this.theme = null
    },
    getCurrentTheme(): ThemeEnum {
      return this.theme ? ThemeEnum.DARK : ThemeEnum.LIGHT
    },
    handleCacheVisible() {
      this.isCacheListShow = !this.isCacheListShow
    }
  },
  getters: {
    //
  }
})
