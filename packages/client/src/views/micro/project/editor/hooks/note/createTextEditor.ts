import { ColorProvider, DialogProvider, ImgToUrlService, OutlineService, Player, ResizeService, Structurer, ThemeProvider } from "@/editor"
import useStore from "@/store"
import { Editor, createEditor } from "@textbus/editor"
import { Ref, onMounted, onUnmounted, watch } from 'vue'
import { getNoteConfig } from "./note.config"
import { useShell } from "@/renderer"
import '@textbus/editor/bundles/textbus.min.css'
// import { CreatorShell } from '../../../../shell'
import { Provider } from "@textbus/core"
export function createTextEditor(args: {
  id: string, 
  account: string, 
  hostname: string, 
  rootRef: Ref<HTMLElement>, 
  editorRef: Ref<HTMLElement>, 
  scrollerRef: Ref<HTMLElement>, 
  toolbarRef: Ref<HTMLElement>
}) {
  const { id, account, hostname, rootRef, editorRef, scrollerRef, toolbarRef } = args
  const { projectStore, settingStore } = useStore()
  let editor: Editor
  // const shell = useShell<CreatorShell>()
  watch(
    () => settingStore.theme,
    () => {
      const themeProvider = editor?.get(ThemeProvider)
      themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
    }
  )
  onUnmounted(() => {
    try {
      console.log('销毁依赖')
      editor.get(ResizeService).destory()
      editor.get(OutlineService).destory()
      editor.get(DialogProvider).destory()
      editor.get(ColorProvider).destory()
      editor.get(Structurer).destory()
      editor.get(ThemeProvider).destory()
      editor.get(ImgToUrlService).destory()
      console.log('编辑器是否已经销毁：' + editor.destroyed)
    } catch (error) {
      console.log(error)
      console.error('编辑器销毁失败！')
    }
  })
  return new Promise<{ editor: Editor, content: string }>((resolve, reject) => {
    onMounted(() => {
      projectStore.fetchAndSet(id, account, hostname).then(project => {
        try {
          editor = createEditor(getNoteConfig({
            account,
            hostname,
            rootRef: rootRef.value!,
            editorRef: editorRef.value!,
            scrollerRef: scrollerRef.value!, 
            toolbarRef: toolbarRef.value!, 
            memos: project.memos,
            content: project.content,
            dirname: project.dirname
          }))
          editor.mount(editorRef.value).then(() => {
            const themeProvider = editor?.get(ThemeProvider)
            themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme()) 
          })
          resolve({ editor, content: project.content })
        } catch (error) {
          console.log(error)
          reject(error)
        }
      }).catch(err => {
        reject(err)
        // const node = shell.workbench.findNodeByName(id)
        // node && shell.workbench.removeByNode(node)
        // shell.workbench.clearFocus()
      })
    })
  })
}