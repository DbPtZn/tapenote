/** 导出编辑器配置 */
// import type { EditorOptions } from '@textbus/editor'

import type { Injector } from '@textbus/core'
import type { Editor, EditorOptions } from '@textbus/editor'
import type { CaretLimit } from '@textbus/platform-browser'
import type { CourseData } from '~/editor'
import type { ArticleType, PublicArticleType } from '~/types'

async function getConfig(args: {
  rootRef: HTMLElement
  editorRef: HTMLElement
  scrollerRef: HTMLElement
  outlineRef?: HTMLElement
  controllerRef?: HTMLElement
  content?: string
}) {
  const { rootRef, editorRef, scrollerRef, outlineRef, controllerRef, content } = args
  console.log(outlineRef)
  const { defaultComponentLoaders, defaultComponents, defaultFormatLoaders, defaultFormatters, LinkJumpTipPlugin } = await import('@textbus/editor')
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
    speedDownTool,
    rewindTool,
    startTool,
    forwardTool,
    speedUpTool,
    replayTool,
    stopTool,
    volumeUpTool,
    volumeDownTool,
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
    OutlinePlugin
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
    providers: [Player, OutlineService, DialogProvider, AnimeProvider, RootEventService, AnimeEventService, Structurer, ThemeProvider],
    plugins: [
      () =>
        new Controller(
          [speedDownTool, rewindTool, startTool, forwardTool, speedUpTool, replayTool, stopTool, volumeUpTool, volumeDownTool],
          controllerRef!
        ),
      () => new PlayerContextMenuPlugin(),
      () => new OutlinePlugin(outlineRef, false),
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
        editorRef,
        controllerRef
      })
      /** 大纲视图 */
      const outlineService = injector.get(OutlineService)
      outlineService.setup(true)
      // outlineService.handleExpand()
      /** 播放器依赖注入 */
      const player = injector.get(Player)
      player.setup(injector, scrollerRef, scrollerRef)
    }
  }
  return config
}

export function usePlayer(args: {
  data: ArticleType | PublicArticleType
  rootRef: Ref<HTMLElement>
  editorRef: Ref<HTMLElement>
  scrollerRef: Ref<HTMLElement>
  controllerRef: Ref<HTMLElement>
  outlineRef: Ref<HTMLElement>
}) {
  const { data, rootRef, editorRef, scrollerRef, outlineRef, controllerRef } = args
  // const { debounceTime } = await import('@textbus/core')
  let editor: Editor
  return new Promise<Editor>(async (resolve, reject) => {
    console.log('create editor')
    const { createEditor } = await import('@textbus/editor')
    const { Player, OutlineService, DialogProvider, AnimeProvider, Structurer, ThemeProvider, RootEventService, AnimeEventService } = await import(
      '~/editor'
    )
    const courseData: CourseData = {
      audio: data.audio,
      duration: data.detail?.duration || 0,
      promoterSequence: data.promoterSequence,
      keyframeSequence: data.keyframeSequence,
      subtitleSequence: data.subtitleSequence,
      subtitleKeyframeSequence: data.subtitleKeyframeSequence
    }
    // console.log(courseData)
    const content = data.content
    console.log(content)
    try {
      const config = await getConfig({
        rootRef: rootRef.value,
        editorRef: editorRef.value,
        scrollerRef: scrollerRef.value,
        controllerRef: controllerRef.value,
        outlineRef: outlineRef.value,
        content
      })
      editor = createEditor(config)
      editor.mount(editorRef.value).then(() => {
        const themeProvider = editor?.get(ThemeProvider)
        const appConfig = useAppConfig()
        themeProvider?.handleThemeUpdate(appConfig.theme.dark ? 'dark' : 'light')
        console.log(themeProvider.theme)
        /** 载入微课数据 */
        if (data.type === 'course') {
          const player = editor?.get(Player)
          player.loadData([courseData])
        }
      })
      resolve(editor)
    } catch (error) {
      reject(error)
    }
  })
}

// export function usePlayer() {
//   return createPlayer
// }

// $fetch<ArticleType>('/api/manage/article/:id')
// .then(async data => {
//   const courseData: CourseData = {
//     audio: data.audio,
//     duration: data.detail?.duration || 0,
//     promoterSequence: data.promoterSequence,
//     keyframeSequence: data.keyframeSequence,
//     subtitleSequence: data.subtitleSequence,
//     subtitleKeyframeSequence: data.subtitleKeyframeSequence
//   }
//   // console.log(courseData)
//   const content = data.content
//   try {
//     const config = await getConfig({
//       rootRef: rootRef.value,
//       editorRef: editorRef.value,
//       scrollerRef: scrollerRef.value,
//       controllerRef: controllerRef.value,
//       content
//     })
//     editor = createEditor(config)
//     editor.mount(editorRef.value).then(() => {
//       // const themeProvider = editor?.get(ThemeProvider)
//       // themeProvider?.handleThemeUpdate()
//       /** 载入微课数据 */
//       const player = editor?.get(Player)
//       player.loadData([courseData])
//     })

//     resolve(editor)
//   } catch (error) {
//     console.log(error)
//     reject(error)
//   }
// })
// .catch(error => {
//   reject(error)
// })
