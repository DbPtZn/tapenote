import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import logger from './logService'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { initServerProcess, quitServerProcess } from './serverProcess'
import portfinder from 'portfinder'
import { useProcessEnv } from './useProcessEnv'
import { useNativeTheme } from './useNativeTheme'
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: true,  // 可用于自定义 menu, false 可以隐藏顶部菜单栏
    autoHideMenuBar: true,
    show: false,
    icon: path.join(process.env.VITE_PUBLIC, 'logo1.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      // nodeIntegration: true,
      // nodeIntegrationInWorker: true
    },
  })

  // nativeTheme.themeSource = 'dark'
  useNativeTheme() // 控制主题

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // 默认打开开发工具
  // win.webContents.openDevTools()

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // 加载完 html 后再显示就不会白屏
  win.on('ready-to-show', () => {
    win?.show()
  })
}



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    quitServerProcess()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

useProcessEnv() // 配置 process.env 环境变量

app.whenReady().then(() => {
  logger.info('启动应用')
  initServerProcess()
  createWindow()
})

