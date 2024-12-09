import { AnimeProvider, ColorProvider, DialogProvider, ImgToUrlService, MemoProvider, OutlineService, Player, Structurer, ThemeProvider } from '@/editor'
import useStore from '@/store'
import { Editor, createEditor } from '@textbus/editor'
import { ShallowRef, inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { getProcedureConfig } from './procedure.config'
import { useShell } from '@/renderer'
import { CreatorShell } from '../../../../shell'
import { Bridge } from '../../../bridge'
export function createAnimeEditor(args: {
  id: string,
  account: string,
  hostname: string,
  editorWrapperRef: Readonly<ShallowRef<HTMLElement | null>>
  editorRef: Readonly<ShallowRef<HTMLElement | null>>
  scrollerRef: Readonly<ShallowRef<HTMLElement | null>>
  toolbarRef: Readonly<ShallowRef<HTMLElement | null>>
  controllerRef: Readonly<ShallowRef<HTMLElement | null>>
}
) {
  const { id, account, hostname, editorWrapperRef, editorRef, scrollerRef, toolbarRef, controllerRef } = args
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
      editor.get(AnimeProvider).destory()
      editor.get(DialogProvider).destory()
      editor.get(OutlineService).destory()
      editor.get(ColorProvider).destory()
      editor.get(Structurer).destory()
      editor.get(ThemeProvider).destory()
      editor.get(Player).destory()
      editor.get(ImgToUrlService).destory()
      editor.get(MemoProvider).destroy()
    } catch (error) {
      console.error('依赖销毁失败！', error)
    }
  })
  
  // console.log([id, editorRef, scrollerRef, toolbarRef])
  return new Promise<{ editor: Editor, content: string }>((resolve, reject) => {
    onMounted(() => {
      projectStore
        .fetchAndSet(id, account, hostname)
        .then(project => {
          try {
            editor = createEditor(getProcedureConfig({
              account,
              hostname,
              projectEl: bridge.projectEl!,
              editorWrapperEl: editorWrapperRef.value!,
              editorEl: editorRef.value!,
              scrollerEl: scrollerRef.value!,
              toolbarEl: toolbarRef.value!,
              controllerEl: controllerRef.value!,
              content: project.content,
              dirname: project.dirname
            }))
            editor.mount(editorRef.value!).then(() => {
              const themeProvider = editor?.get(ThemeProvider)
              themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
              const htmlstr = editor.getHTML()
              project.content = htmlstr // 确保一致性
              resolve({ editor, content: htmlstr })
            })
          } catch (error) {
            console.log(error)
            reject(error)
          }
        })
        .catch(err => {
          reject(err)
          const node = shell.workbench.findNodeByName(id)
          node && shell.workbench.removeByNode(node)
          shell.workbench.clearFocus()
        })
    })
  })
}
