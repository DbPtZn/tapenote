import { ipcMain } from 'electron'
import Store from 'electron-store'
import { LoginInfo } from 'electron/preload'
// import { logger } from 'electron/services'

export function useRecordLogin() {
  const store = new Store()
  const key = 'login'
  ipcMain.on('set-login-info', (_event, data) => {
    // console.log(event)
    if (!store.has(key)) {
      store.set(key, []) // 初始化为空数组
    }
    // 设置数据
    const info = store.get(key) as LoginInfo[]
    const isExist = info.some((item, index, arr) => {
      if(item.key === data.key) {
        arr[index].value = data.value
        return true
      }
    })
    // console.log(isExist)
    !isExist && info.unshift(data)
    // console.log(info)
    // 保存数据
    store.set(key, info)
  })

  ipcMain.handle('get-login-info', (_event, _value) => {
    const data = store.get(key) as LoginInfo[] || []
    // console.log(data)
    return data
  })

  ipcMain.handle('remove-login-info', (_event, value) => {
    try {
      console.log(value)
      const data = store.get(key) as LoginInfo[] || []
      const index = data.findIndex(item => item.key === value)
      if (index !== -1) {
        data.splice(index, 1)
        store.set(key, data)
      }
      return true
    } catch (error) {
      // logger.error(`移除用户登录记录失败！`, error)
      return false
    }
  })
}

