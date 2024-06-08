import { AddAnimeService, AnimeProvider, AnimeService, AnimeStateProvider, AnimeUtilsProvider, ColorProvider, DialogProvider, ImgToUrlService, OutlineService, Player, Structurer, ThemeProvider } from '@/editor'
import useStore from '@/store'
import { Editor, createEditor } from '@textbus/editor'
import { Ref, onMounted, onUnmounted, watch } from 'vue'
import { getProcedureConfig } from './procedure.config'
import { useShell } from '@/renderer'
import { CreatorShell } from '../../../../shell'
import { Commander } from '@textbus/core'

export function createAnimeEditor(args: {
  id: string,
  account: string,
  hostname: string,
  rootRef: Ref<HTMLElement>,
  editorRef: Ref<HTMLElement>,
  scrollerRef: Ref<HTMLElement>,
  toolbarRef: Ref<HTMLElement>,
  controllerRef: Ref<HTMLElement>
}
) {
  const { id, account, hostname, rootRef, editorRef, scrollerRef, toolbarRef, controllerRef } = args
  const { projectStore, settingStore } = useStore()
  let editor: Editor
  const shell = useShell<CreatorShell>()
  watch(
    () => settingStore.theme,
    () => {
      const themeProvider = editor?.get(ThemeProvider)
      themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
    }
  )

  onUnmounted(() => {
    try {
      // editor.get(Commander).destory()
      editor.get(AnimeService).destory()
      editor.get(AnimeProvider).destory()
      editor.get(AddAnimeService).destory()
      editor.get(AnimeUtilsProvider).destory()
      editor.get(AnimeStateProvider).destory()
      editor.get(DialogProvider).destory()
      editor.get(OutlineService).destory()
      editor.get(ColorProvider).destory()
      editor.get(Structurer).destory()
      editor.get(ThemeProvider).destory()
      editor.get(Player).destory()
      editor.get(ImgToUrlService).destory()
      // console.log('销毁依赖')
      // console.log('编辑器是否已经销毁：' + editor.destroyed)
    } catch (error) {
      console.error('编辑器销毁失败！')
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
              rootRef: editorRef.value,
              editorRef: editorRef.value,
              scrollerRef: scrollerRef.value,
              toolbarRef: toolbarRef.value,
              controllerRef: controllerRef.value,
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
