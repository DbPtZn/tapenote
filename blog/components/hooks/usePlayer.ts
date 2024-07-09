/** 导出编辑器配置 */
// import type { EditorOptions } from '@textbus/editor'

import { Injector, Subscription } from '@textbus/core'
import type { Editor, EditorOptions } from '@textbus/editor'
import type { CaretLimit } from '@textbus/platform-browser'
import type { CourseData } from '~/editor'
import type { ArticleType } from '~/types'

async function getConfig(args: {
  rootRef: HTMLElement,
  editorRef: HTMLElement,
  scrollerRef: HTMLElement, 
  toolbarRef?: HTMLElement,
  controllerRef?: HTMLElement,
  content?: string
}) {
  const { rootRef, editorRef, scrollerRef, toolbarRef, controllerRef, content } = args
  const { defaultComponentLoaders, defaultComponents, defaultFormatLoaders, defaultFormatters, LinkJumpTipPlugin } = await import(
    '@textbus/editor'
  )
  const { fromEvent } = await import('@textbus/core')
  const { Input } = await import('@textbus/platform-browser')
  const {
    colorFormatter,
    textBackgroundColorFormatLoader,
    colorFormatLoader,
    textBackgroundColorFormatter,
    animeIgnoreComponentLoader,
    animePlayerComponent,
    animeIgnoreComponent,
    animePlayerComponentLoader,
    animePlayerFormatter,
    animePlayerFormatLoader,
    rootPlayerComponent,
    rootPlayerComponentLoader,
    speedDownTool, rewindTool, startTool, forwardTool, speedUpTool, replayTool, stopTool, volumeUpTool, volumeDownTool,
    Controller,
    Player,
    OutlineService,
    DialogProvider,
    AnimeProvider,
    RootEventService,
    AnimeEventService,
    Structurer,
    ThemeProvider,
    PlayerContextMenuPlugin,
    OutlinePlugin,
  } = await import('~/editor')
  // const { Injector } = await import('@textbus/core')
  const config: EditorOptions = {
    theme: 'darkline',
    autoFocus: true,
    autoHeight: true,
    zenCoding: true,
    historyStackSize: 30,
    placeholder: '在此输入正文',
    readonly: true,
    content: content || '',
    rootComponent: rootPlayerComponent,
    rootComponentLoader: rootPlayerComponentLoader,
    components: [animePlayerComponent, animeIgnoreComponent, ...defaultComponents],
    componentLoaders: [animePlayerComponentLoader, animeIgnoreComponentLoader, ...defaultComponentLoaders],
    formatters: [animePlayerFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animePlayerFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    styleSheets: [],
    providers: [
      Player,
      OutlineService,
      DialogProvider,
      AnimeProvider,
      RootEventService,
      AnimeEventService,
      Structurer,
      ThemeProvider
    ],
    plugins: [
      () =>
        new Controller(
          [speedDownTool, rewindTool, startTool, forwardTool, speedUpTool, replayTool, stopTool, volumeUpTool, volumeDownTool],
          controllerRef!
        ),
      () => new PlayerContextMenuPlugin(),
      () => new OutlinePlugin(),
      () => new LinkJumpTipPlugin()
    ],
    setup(injector: Injector) {
      const input = injector.get(Input)
      input.caret.correctScrollTop({
        onScroll: fromEvent(scrollerRef, 'scroll'),
        getLimit(): CaretLimit {
          const rect = scrollerRef.getBoundingClientRect()
          return {
            top: 0,
            bottom: rect.height + rect.top
          }
        },
        setOffset(offsetScrollTop: number) {
          scrollerRef.scrollTop += offsetScrollTop
        }
      })
      /** 依赖注入 */
      // 主题依赖
      const themeProvider = injector.get(ThemeProvider)
      themeProvider.setup(injector)
      // 组成元素
      const structurer = injector.get(Structurer)
      structurer.setup({
        rootRef,
        scrollerRef,
        toolbarRef,
        editorRef,
        controllerRef
      })
      /** 播放器依赖注入 */
      const player = injector.get(Player)
      player.setup(injector, scrollerRef)
    }
  }
  return config
}

async function createPlayer(args: {
  id: string
  account: string
  hostname: string
  rootRef: Ref<HTMLElement>
  editorRef: Ref<HTMLElement>
  scrollerRef: Ref<HTMLElement>
  controllerRef: Ref<HTMLElement>
}) {
  const { id, account, hostname, rootRef, editorRef, scrollerRef, controllerRef } = args
  const { createEditor, Layout } = await import('@textbus/editor')
  const { 
    Player, OutlineService, 
    DialogProvider, AnimeProvider, Structurer,
    ThemeProvider, RootEventService, AnimeEventService
  } = await import('~/editor')
  const { debounceTime } = await import('@textbus/core')
  let editor: Editor
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

  return new Promise<Editor>((resolve, reject) => {
    onMounted(() => {
      $fetch<ArticleType>('/api/manage/article/:id')
        .then(async project => {
          const courseData: CourseData = {
            audio: project.audio,
            duration: project.detail?.duration || 0,
            promoterSequence: project.promoterSequence,
            keyframeSequence: project.keyframeSequence,
            subtitleSequence: project.subtitleSequence,
            subtitleKeyframeSequence: project.subtitleKeyframeSequence
          }
          // console.log(courseData)
          const content = project.content
          try {
            const config = await getConfig({
              rootRef: rootRef.value,
              editorRef: editorRef.value,
              scrollerRef: scrollerRef.value,
              controllerRef: controllerRef.value,
              content
            })
            editor = createEditor(config)
            editor.mount(editorRef.value).then(() => {
              // const themeProvider = editor?.get(ThemeProvider)
              // themeProvider?.handleThemeUpdate()
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
          reject(error)
        })
    })
  })

}

export function usePlayer() {
  return createPlayer
}
