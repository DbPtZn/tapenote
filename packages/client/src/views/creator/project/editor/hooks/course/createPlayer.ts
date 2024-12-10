import { AnimeProvider, CourseData, DialogProvider, MemoProvider, OutlineService, Player, RootEventService, Structurer, ThemeProvider } from '@/editor'
import useStore from '@/store'
import { Editor, createEditor } from '@textbus/editor'
import { ShallowRef, inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { getCourseConfig } from './player.config'
import { useShell } from '@/renderer'
import { CreatorShell } from '../../../../shell'
import { Bridge } from '../../../bridge'

export function createPlayer(args: {
  id: string
  account: string
  hostname: string
  editorWrapperRef: Readonly<ShallowRef<HTMLElement | null>>
  editorRef: Readonly<ShallowRef<HTMLElement | null>>
  scrollerRef: Readonly<ShallowRef<HTMLElement | null>>
  controllerRef: Readonly<ShallowRef<HTMLElement | null>>
}) {
  const { id, account, hostname, editorWrapperRef, editorRef, scrollerRef, controllerRef } = args
  const { projectStore, settingStore, userStore } = useStore()
  const bridge = inject('bridge') as Bridge
  const shell = useShell<CreatorShell>()
  let editor: Editor
  watch(
    () => settingStore.theme,
    () => {
      const themeProvider = editor?.get(ThemeProvider)
      themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
    }
  )
  onBeforeUnmount(() => {
    try {
      editor.get(MemoProvider).destroy()
      editor.get(Player).destory()
      editor.get(OutlineService).destory()
      editor.get(DialogProvider).destory()
      editor.get(AnimeProvider).destory()
      editor.get(Structurer).destory()
      editor.get(ThemeProvider).destory()
      editor.get(RootEventService).destory()
      // console.log('销毁依赖')
    } catch (error) {
      console.error('依赖销毁失败！', error)
    }
  })
  // console.log([id, editorRef, scrollerRef, controllerRef])
  return new Promise<{ editor: Editor, content: string }>((resolve, reject) => {
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

          // 音频换源 (检查浏览器是否支持 ogg 格式)
          const aud = new Audio()
          const result = aud.canPlayType('audio/ogg')
          if (result === '') courseData.audio = courseData.audio.replace('.ogg', '.mp3')
          aud.remove()

          const content = project.content
          try {
            editor = createEditor(
              getCourseConfig({
                projectEl: bridge.projectEl!,
                editorWrapperEl: editorWrapperRef.value!,
                editorEl: editorRef.value!,
                scrollerEl: scrollerRef.value!,
                controllerEl: controllerRef.value!,
                content
              })
            )
            editor.mount(editorRef.value!).then(() => {
              const themeProvider = editor?.get(ThemeProvider)
              themeProvider?.handleThemeUpdate(settingStore.getCurrentTheme())
              /** 载入微课数据 */
              const isAutoLoad = !!userStore.config?.autoLoadCourse
              const player = editor?.get(Player)
              isAutoLoad ? player.loadData([courseData]) : player.preLoadData([courseData])
              resolve({ editor, content: editor.getHTML() })
            })
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
