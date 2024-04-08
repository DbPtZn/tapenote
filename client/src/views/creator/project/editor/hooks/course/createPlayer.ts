import { ConfigProvider, CourseData, Player, ThemeProvider } from '@/editor'
import useStore from '@/store'
import { Editor, createEditor } from '@textbus/editor'
import { Ref, onMounted, watch } from 'vue'
import { getCourseConfig } from './player.config'
import { useShell } from '@/renderer'
import { CreatorShell } from '../../../../shell'
import { Commander, RootComponentRef } from '@textbus/core'

export function createPlayer(args: {
  id: string
  account: string
  hostname: string
  rootRef: Ref<HTMLElement>
  editorRef: Ref<HTMLElement>
  scrollerRef: Ref<HTMLElement>
  controllerRef: Ref<HTMLElement>
}) {
  const { id, account, hostname, rootRef, editorRef, scrollerRef, controllerRef } = args
  const { projectStore, settingStore } = useStore()
  const shell = useShell<CreatorShell>()
  let editor: Editor
  watch(
    () => settingStore.theme,
    () => {
      const themeProvider = editor?.get(ThemeProvider)
      themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
    }
  )
  // console.log([id, editorRef, scrollerRef, controllerRef])
  return new Promise<Editor>((resolve, reject) => {
    onMounted(() => {
      projectStore
        .fetchAndSet(id, account, hostname)
        .then(project => {
          const courseData: CourseData = {
            audio: project.audio,
            duration: project.duration,
            promoterSequence: project.promoterSequence,
            keyframeSequence: project.keyframeSequence,
            subtitleSequence: project.subtitleSequence,
            subtitleKeyframeSequence: project.subtitleKeyframeSequence
          }
          // console.log(courseData)
          const content = project.content
          try {
            editor = createEditor(
              getCourseConfig({
                rootRef: rootRef.value,
                editorRef: editorRef.value,
                scrollerRef: scrollerRef.value,
                controllerRef: controllerRef.value,
                content
              })
            )
            editor.mount(editorRef.value).then(() => {
              const themeProvider = editor?.get(ThemeProvider)
              themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
              /** 载入微课数据 */
              const player = editor?.get(Player)
              player.loadData([courseData])
            })

            resolve(editor)
          } catch (error) {
            console.log(error)
            reject(error)
          }
        })
        .catch(error => {
          shell.workbench.useError(error.response.status)
          reject(error)
        })
    })
  })
}
