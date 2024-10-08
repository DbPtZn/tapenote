import {
  colorFormatLoader,
  colorFormatter,
  textBackgroundColorFormatter,
  textBackgroundColorFormatLoader,
  DialogProvider,
  OutlinePlugin,
  OutlineService,
  Controller,
  animePlayerComponent,
  rootPlayerComponentLoader,
  rootPlayerComponent,
  animePlayerComponentLoader,
  startTool,
  rewindTool,
  forwardTool,
  speedUpTool,
  speedDownTool,
  replayTool,
  stopTool,
  Player,
  CourseData,
  volumeUpTool,
  volumeDownTool,
  RootEventService,
  PlayerContextMenuPlugin,
  animeIgnoreComponent,
  animeIgnoreComponentLoader,
  AnimeProvider,
  Structurer,
  ThemeProvider,
  animeFormatLoader,
  animeFormatter
} from '@/editor'
import { fromEvent, Injector } from '@textbus/core'
import {
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  EditorOptions,
  LinkJumpTipPlugin
} from '@textbus/editor'
import { CaretLimit, Input } from '@textbus/platform-browser'
export function getCourseConfig(args: {
  rootRef: HTMLElement,
  editorRef: HTMLElement,
  scrollerRef: HTMLElement, 
  toolbarRef?: HTMLElement,
  controllerRef?: HTMLElement,
  content?: string
}) {
  const { rootRef, editorRef, scrollerRef, toolbarRef, controllerRef, content } = args
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
    formatters: [animeFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animeFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    styleSheets: [],
    providers: [
      Player,
      OutlineService,
      DialogProvider,
      AnimeProvider,
      RootEventService,
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
