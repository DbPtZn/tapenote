import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
  // You can expose other APTs you need here.
  // ...
})
export interface LoginInfo { key: string, value: { pwd: string, avatar: string }  }
export interface IElectronAPI {
  getPort: () => Promise<any>
  updateTheme: (value: 'dark' | 'light') => void
  setLoginInfo: (key: string, value: { pwd: string, avatar: string }) => void
  getLoginInfo: () => Promise<LoginInfo[]>
  removeLoginInfo: (key: string) => Promise<boolean>
}

contextBridge.exposeInMainWorld('electronAPI', {
  getPort: () => ipcRenderer.invoke('get-port'),
  updateTheme: (value: 'dark' | 'light') => ipcRenderer.send('update-theme', value),
  setLoginInfo: (key: string, value: string) => ipcRenderer.send('set-login-info', { key, value }),
  getLoginInfo: ()  => ipcRenderer.invoke('get-login-info'),
  removeLoginInfo: (key: string) => ipcRenderer.invoke('remove-login-info', key),
})
