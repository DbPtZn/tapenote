import { AddAnimeService, AnimeProvider, ColorProvider, DialogProvider, ImgToUrlService, MemoProvider, OutlineService, Player, Structurer, ThemeProvider } from '@/editor'
import useStore from '@/store'
import { Editor, createEditor } from '@textbus/editor'
import { Ref, ShallowRef, inject, onBeforeUnmount, onMounted, onUnmounted, watch } from 'vue'
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
      // console.log('销毁依赖')
    } catch (error) {
      console.error(error)
      console.error('依赖销毁失败！')
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
              memos: project.memos,
              content: project.content,
              dirname: project.dirname
            }))
            editor.mount(editorRef.value!).then(() => {
              const themeProvider = editor?.get(ThemeProvider)
              themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
              resolve({ editor, content: editor.getHTML() })
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
