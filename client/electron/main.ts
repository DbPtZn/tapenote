import { app, BrowserWindow } from 'electron'
import logger from './logService'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { initServerProcess, quitServerProcess } from './serverProcess'

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
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      // nodeIntegration: true,
      nodeIntegrationInWorker: true
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // 默认打开开发工具
  win.webContents.openDevTools()

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
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
process.env.APP_DIR = `${app.getPath('userData')}`
process.env.DB_DATE_BASE = `${app.getPath('userData')}/database.sqlite`
process.env.NODE_ENV = 'electron'
// port
process.env.SERVER_PORT = '3080'
// database
// process.env.DB_USERNAME = process.env.DB_USERNAME,
// process.env.DB_PASSWORD = process.env.DB_PASSWORD,
// process.env.DB_HOST = process.env.DB_HOST,
// process.env.DB_PORT = process.env.DB_PORT,
// process.env.DB_DATE_BASE = process.env.DB_DATE_BASE, // // host node18+ 的 localhost 默认 ipv6 可能会导致数据库连接出现问题
// process.env.DB_SYNCHRONIZE = process.env.DB_SYNCHRONIZE,
// process.env.DB_RETRY_DELAY = process.env.DB_RETRY_DELAY,
// process.env.DB_RETRY_ATTEMPTS = process.env.DB_RETRY_ATTEMPTS,
// process.env.DB_AUTO_LOAD_ENTITIES = process.env.DB_AUTO_LOAD_ENTITIES,
// commo
process.env.V_CODE_OPEN = 'false' // 是否开启验证码
process.env.USER_DIR = 'assets' // 用户目录
process.env.PUBLIC_DIR = '/public' // 公共目录
process.env.STATIC_RESOURCE_PREFIX = '/public'
process.env.PRIVATE_DIR = '/private' // 私有目录
process.env.LOG_DIR = '/logs' // 日志目录
process.env.LOG_OPEN = 'false' // 是否开启系统日志
// auth
process.env.JWT_SECRET = 'electronJWT'
// process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
app.whenReady().then(() => {
  logger.info('process.env.APP_DIR:' + process.env.APP_DIR)
  logger.info('process.env.DB_DATE_BASE:' + process.env.DB_DATE_BASE)
  logger.info('process.env.NODE_ENV:' + process.env.NODE_ENV)
  logger.info('process.env.SERVER_PORT:' + process.env.SERVER_PORT)
  logger.info('process.env.USER_DIR:' + process.env.USER_DIR)
  logger.info('process.env.PUBLIC_DIR:' + process.env.PUBLIC_DIR)
  logger.info('getAppPath:' + app.getAppPath())
  logger.info('home:' + app.getPath('home'))
  logger.info('appData:' + app.getPath('appData'))
  logger.info('userData:' + app.getPath('userData'))
  logger.info('sessionData:' + app.getPath('sessionData'))
  logger.info('temp:' + app.getPath('temp'))
  logger.info('exe:' + app.getPath('exe'))
  logger.info('module:' + app.getPath('module'))
  logger.info('desktop:' + app.getPath('desktop'))
  logger.info('documents:' + app.getPath('documents'))
  logger.info('crashDumps:' + app.getPath('crashDumps'))
  logger.info('启动应用')
  initServerProcess()
  createWindow()
})

