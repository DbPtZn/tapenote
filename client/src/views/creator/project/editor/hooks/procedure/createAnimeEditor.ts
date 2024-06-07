import { ThemeProvider } from '@/editor'
import useStore from '@/store'
import { Editor, createEditor } from '@textbus/editor'
import { Ref, onMounted, watch } from 'vue'
import { getProcedureConfig } from './procedure.config'
import { useShell } from '@/renderer'
import { CreatorShell } from '../../../../shell'

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
              // console.log('change axx')
              // const accessToken = sessionStorage.getItem(`User:${account}&${hostname}`)
              // const imgToUrlService = editor?.get(ImgToUrlService)
              // imgToUrlService.setup({
              //   hostname: hostname,
              //   accessToken: accessToken || '',
              //   uploadImgUrl: '/upload/img'
              // }) 

              // 测试
              // const root = editor?.get(RootComponentRef)
              // const commander = editor?.get(Commander)
              // const controller = editor?.get(Controller)
              // controller.onReadonlyStateChange.subscribe(v => {
              //   console.log('readonly:' + v)
              // })
              // root.component.slots.toArray().forEach((slot) => {
              //   slot.sliceContent().forEach((content) => {
              //     if (typeof content !== 'string') {
              //       console.log(content)
              //       const b = commander.removeComponent(content)
              //       console.log(b)
              //     }
              //   })
              // })
              // const root = editor?.get(RootComponentRef)
              // console.log(root.component)
              // root.component.onStateChange.subscribe(state => {
              //   console.log(state)
              // })
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
