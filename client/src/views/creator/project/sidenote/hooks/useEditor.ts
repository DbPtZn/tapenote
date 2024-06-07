import { ThemeProvider } from '@/editor'
import useStore from '@/store'
import { Editor, createEditor } from '@textbus/editor'
import { Ref, onMounted, watch } from 'vue'
import { getSidenoteConfig } from './sidenote.config'
import { Bridge } from '../../bridge'

export function useSidenoteEditor(args: {
  id: string,
  account: string,
  hostname: string,
  rootRef?: Ref<HTMLElement>,
  editorRef: Ref<HTMLElement>,
  scrollerRef: Ref<HTMLElement>,
  controllerRef?: Ref<HTMLElement>,
  toolbarRef: Ref<HTMLElement>,
  bridge: Bridge
}) {
  const { id, account, hostname, rootRef, editorRef, scrollerRef, controllerRef, toolbarRef, bridge } = args
  const { projectStore, settingStore } = useStore()
  let editor: Editor
  watch(
    () => settingStore.theme,
    () => {
      const themeProvider = editor?.get(ThemeProvider)
      themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
    }
  )
  // console.log([id, editorRef, scrollerRef, toolbarRef])
  return new Promise<{ editor: Editor, content: string }>((resolve, reject) => {
    onMounted(() => {
      bridge.onEditorReady.subscribe(() => {
        try {
          const data = projectStore.get(id)
          if (!data) return reject('sidenote 载入失败！')
          editor = createEditor(getSidenoteConfig({
            account,
            hostname,
            rootRef: rootRef?.value,
            editorRef: editorRef.value,
            scrollerRef: scrollerRef.value,
            toolbarRef: toolbarRef.value,
            controllerRef: controllerRef?.value,
            content: data.sidenote,
            dirname: data.dirname
          }))
          editor.mount(editorRef.value).then(() => {
            const themeProvider = editor?.get(ThemeProvider)
            themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
            bridge.handleSidenoteReady(editor)
            
            // const accessToken = sessionStorage.getItem(`User:${account}&${hostname}`)
            // const imgToUrlService = editor?.get(ImgToUrlService)
            // imgToUrlService.setup({
            //   hostname: hostname,
            //   accessToken: accessToken || '',
            //   uploadImgUrl: '/upload/img'
            // }) 
          })
          resolve({ editor, content: data.sidenote})
        } catch (error) {
          console.log(error)
          reject(error)
        }
      })
    })
  })
}
