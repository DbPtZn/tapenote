import { AnimeEventService, AnimeProvider, ColorProvider, CourseData, DialogProvider, ImgToUrlService, OutlineService, Player, ResizeService, RootEventService, Structurer, ThemeProvider } from '@/editor'
import useStore from '@/store'
import { Editor, createEditor } from '@textbus/editor'
import { Ref, onMounted, onUnmounted, watch } from 'vue'
import { getCourseConfig } from './player.config'
import { useShell } from '@/renderer'
// import { CreatorShell } from '../../../../shell'

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
  // const shell = useShell<CreatorShell>()
  let editor: Editor
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
      editor.get(Player).destory()
      editor.get(OutlineService).destory()
      editor.get(DialogProvider).destory()
      editor.get(AnimeProvider).destory()
      editor.get(Structurer).destory()
      editor.get(ThemeProvider).destory()
      editor.get(RootEventService).destory()
      editor.get(AnimeEventService).destory()
      console.log('编辑器是否已经销毁：' + editor.destroyed)
    } catch (error) {
      console.error('编辑器销毁失败！')
    }
  })
  // console.log([id, editorRef, scrollerRef, controllerRef])
  return new Promise<{ editor: Editor, content: string }>((resolve, reject) => {
    onMounted(() => {
      projectStore
        .fetchAndSet(id, account, hostname)
        .then(project => {
          // 音频换源
          // const aud = new Audio()
          // const result = aud.canPlayType('audio/ogg')
          // if (result === '') project.audio = project.audio.replace('.ogg', '.mp3')
          // console.log('project audio:', project.audio)
          // const courseData: CourseData = {
          //   audio: project.audio,
          //   duration: project.duration,
          //   promoterSequence: project.promoterSequence,
          //   keyframeSequence: project.keyframeSequence,
          //   subtitleSequence: project.subtitleSequence,
          //   subtitleKeyframeSequence: project.subtitleKeyframeSequence
          // }
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
              // const player = editor?.get(Player)
              // player.loadData([courseData])
            })

            resolve({ editor, content: project.content })
          } catch (error) {
            console.log(error)
            reject(error)
          }
        })
        .catch(error => {
          // shell.workbench.useError(error.response.status)
          reject(error)
        })
    })
  })
}