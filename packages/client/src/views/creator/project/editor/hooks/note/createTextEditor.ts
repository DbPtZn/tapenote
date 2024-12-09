import { ColorProvider, DialogProvider, ImgToUrlService, MemoProvider, OutlineService, Player, ResizeService, Structurer, ThemeProvider } from "@/editor"
import useStore from "@/store"
import { Editor, createEditor } from "@textbus/editor"
import { Ref, ShallowRef, inject, onBeforeUnmount, onMounted, onUnmounted, watch } from 'vue'
import { getNoteConfig } from "./note.config"
import { useShell } from "@/renderer"
import '@textbus/editor/bundles/textbus.min.css'
import { CreatorShell } from '../../../../shell'
import { Bridge } from "../../../bridge"
export function createTextEditor(args: {
  id: string
  account: string
  hostname: string
  editorWrapperRef: Readonly<ShallowRef<HTMLElement | null>>
  editorRef: Readonly<ShallowRef<HTMLElement | null>>
  scrollerRef: Readonly<ShallowRef<HTMLElement | null>> 
  toolbarRef: Readonly<ShallowRef<HTMLElement | null>>
}) {
  const { id, account, hostname, editorWrapperRef, editorRef, scrollerRef, toolbarRef } = args
  const { projectStore, settingStore } = useStore()
  const bridge = inject('bridge') as Bridge
  let editor: Editor
  const shell = useShell<CreatorShell>()
  watch(
    () => settingStore.theme,
    () => {
      const themeProvider = editor?.get(ThemeProvider)
      themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
    }
  )
  onBeforeUnmount(() => {
    try {
      editor.get(ResizeService).destory()
      editor.get(OutlineService).destory()
      editor.get(DialogProvider).destory()
      editor.get(ColorProvider).destory()
      editor.get(Structurer).destory()
      editor.get(ThemeProvider).destory()
      editor.get(ImgToUrlService).destory()
      editor.get(MemoProvider).destroy()
      // console.log('销毁依赖')
    } catch (error) {
      console.error('编辑器依赖销毁失败！', error)
    }
  })
  return new Promise<{ editor: Editor, content: string }>((resolve, reject) => {
    onMounted(() => {
      projectStore.fetchAndSet(id, account, hostname).then(project => {
        try {
          editor = createEditor(getNoteConfig({
            account,
            hostname,
            projectEl: bridge.projectEl!,
            editorWrapperEl: editorWrapperRef.value!,
            editorEl: editorRef.value!,
            scrollerEl: scrollerRef.value!,
            toolbarEl: toolbarRef.value!,
            content: project.content,
            dirname: project.dirname
          }))
          editor.mount(editorRef.value!).then(() => {
            const themeProvider = editor?.get(ThemeProvider)
            themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
            // ⚠ 由于 tb 中解析嵌套 formatter 时，标签顺序可能会发生变化，所以应该在加载之后再获取 html 作为脏值检测依据
            const htmlstr = editor.getHTML()
            project.content = htmlstr // 确保一致性
            resolve({ editor, content: htmlstr })
          })
        } catch (error) {
          console.log(error)
          reject(error)
        }
      }).catch(err => {
        reject(err)
        const node = shell.workbench.findNodeByName(id)
        node && shell.workbench.removeByNode(node)
        shell.workbench.clearFocus()
      })
    })
  })
}