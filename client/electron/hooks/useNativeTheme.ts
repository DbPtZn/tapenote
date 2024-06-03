import { nativeTheme, ipcMain } from 'electron'

export function useNativeTheme() {
  nativeTheme.themeSource = 'dark'

  ipcMain.on('update-theme', (event, theme: 'dark' | 'light') => {
    console.log(theme)
    nativeTheme.themeSource = theme
  })
}