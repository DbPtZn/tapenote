import {
  DialogProvider,
  OutlinePlugin,
  OutlineService,
  Controller,
  rootPlayerComponentLoader,
  rootPlayerComponent,
  Player,
  RootEventService,
  PlayerContextMenuPlugin,
  AnimeProvider,
  Structurer,
  ThemeProvider,
  animeFormatter,
  animeFormatLoader,
   MemoProvider, MessageService, MemoService, defaultPlayerComponents, defaultPlayerComponentLoaders, defaultAttributeLoaders, defaultAttributes, defaultFormatLoaders, defaultFormatters
} from '@/editor'
import { fromEvent, Injector } from '@textbus/core'
import {
  EditorOptions,
  LinkJumpTipPlugin
} from '@textbus/editor'
import { CaretLimit, Input } from '@textbus/platform-browser'
export function getCourseConfig(args: {
  projectEl: HTMLElement,
  editorWrapperEl: HTMLElement,
  editorEl: HTMLElement,
  scrollerEl: HTMLElement, 
  toolbarEl?: HTMLElement,
  controllerEl?: HTMLElement,
  content?: string
}) {
  const { projectEl, editorWrapperEl, editorEl, scrollerEl, toolbarEl, controllerEl, content } = args
  editorEl.classList.add('player-editor')
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
    components: defaultPlayerComponents,
    componentLoaders: defaultPlayerComponentLoaders,
    formatters: [animeFormatter, ...defaultFormatters],
    formatLoaders: [animeFormatLoader, ...defaultFormatLoaders],
    attributes: defaultAttributes,
    attributeLoaders: defaultAttributeLoaders,
    styleSheets: [],
    providers: [
      Player,
      OutlineService,
      DialogProvider,
      AnimeProvider,
      RootEventService,
      Structurer,
      ThemeProvider,
      MessageService,
      MemoProvider,
      MemoService
    ],
    plugins: [
      () => new Controller(controllerEl!),
      () => new PlayerContextMenuPlugin(),
      () => new OutlinePlugin(),
      () => new LinkJumpTipPlugin()
    ],
    setup(injector: Injector) {
      const input = injector.get(Input)
      input.caret.correctScrollTop({
        onScroll: fromEvent(scrollerEl, 'scroll'),
        getLimit(): CaretLimit {
          const rect = scrollerEl.getBoundingClientRect()
          return {
            top: 0,
            bottom: rect.height + rect.top
          }
        },
        setOffset(offsetScrollTop: number) {
          scrollerEl.scrollTop += offsetScrollTop
        }
      })
      /** 依赖注入 */
      // 主题依赖
      const themeProvider = injector.get(ThemeProvider)
      themeProvider.setup(injector)
      // 组成元素
      const structurer = injector.get(Structurer)
      structurer.setup({
        projectEl,
        editorWrapperEl,
        scrollerEl,
        toolbarEl,
        editorEl,
        controllerEl
      })
      /** 播放器依赖注入 */
      const player = injector.get(Player)
      player.setup(injector, scrollerEl)
    }
  }
  return config
}
