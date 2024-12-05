import {
  InlineToolbarPlugin,
  Toolbar,
  boldTool,
  historyBackTool,
  historyForwardTool,
  italicTool,
  strikeThroughTool,
  underlineTool,
  fontSizeTool,
  textIndentTool,
  colorTool,
  textBackgroundTool,
  linkTool,
  fontFamilyTool,
  unlinkTool,
  imageTool,
  textAlignTool,
  tableRemoveTool,
  tableAddTool,
  cleanTool,
  animeFormatter,
  animeFormatLoader,
  AddAnimeService,
  AnimeComponentSupport,
  defaultGroupTool,
  DialogProvider,
  componentsTool,
  AnimeContextmenuPlugin,
  OutlinePlugin,
  OutlineService,
  PreviewPlayerController,
  CustomCommander,
  ColorProvider,
  Structurer,
  ThemeProvider,
  Player,
  ImgToUrlService,
  AnimeService,
  ContextMenu,
  MemoService,
  MessageService,
  StudioService,
  ImgService,
  i18n,
  rootAnimeComponent,
  rootAnimeComponentLoader,
  animeTool,
  animeBadgeVisibleTool,
  animeIgnoreTool,
  animeElementVisibleTool,
  AnimeProvider,
  headingTool,
  olTool,
  ulTool,
  insertParagraphAfterTool,
  insertParagraphBeforeTool,
  dividerTool,
  Memo,
  ImgToolbarPlugin,
  ShotcutPlugin,
  MemoProvider,
  defaultComponents,
  defaultComponentLoaders,
  defaultAttributeLoaders,
  defaultAttributes,
  defaultFormatters,
  defaultFormatLoaders,
  codeTool
} from '@/editor'
import { Commander, fromEvent, Injector } from '@textbus/core'
import {
  EditorOptions,
  LinkJumpTipPlugin
} from '@textbus/editor'
import { CaretLimit, Input } from '@textbus/platform-browser'
import { useUploadImg } from '../../../../_hooks'
import { uploader } from '../uploader'
import { getResourceDomain } from '@/views/creator/_hooks'

export function getProcedureConfig(args: {
  account: string
  hostname: string
  dirname: string
  rootRef: HTMLElement
  editorRef: HTMLElement
  scrollerRef: HTMLElement
  memos: Memo[]
  toolbarRef?: HTMLElement
  controllerRef?: HTMLElement
  content?: string
}) {
  const { account, hostname, rootRef, editorRef, scrollerRef, toolbarRef, controllerRef, memos, content } = args
  editorRef.classList.add('anime-editor')
  const ResourceDomain = getResourceDomain(hostname)
  const config: EditorOptions = {
    theme: 'darkline',
    autoFocus: true,
    autoHeight: true,
    zenCoding: true,
    historyStackSize: 30,
    placeholder: '在此输入正文',
    content: content || '',
    i18n: i18n,
    rootComponent: rootAnimeComponent,
    rootComponentLoader: rootAnimeComponentLoader,
    components: defaultComponents,
    componentLoaders: defaultComponentLoaders,
    formatters: [animeFormatter, ...defaultFormatters],
    formatLoaders: [animeFormatLoader, ...defaultFormatLoaders],
    attributes: defaultAttributes,
    attributeLoaders: defaultAttributeLoaders,
    providers: [
      { provide: Commander, useClass: CustomCommander },
      AnimeProvider,
      AddAnimeService,
      DialogProvider,
      OutlineService,
      ColorProvider,
      AnimeService,
      Structurer,
      ThemeProvider,
      Player,
      ImgToUrlService,
      MessageService,
      StudioService,
      ImgService,
      MemoService,
      MemoProvider
    ],
    plugins: [
      () =>
        new Toolbar(
          [
            [historyBackTool, historyForwardTool],
            [defaultGroupTool],
            [componentsTool],
            [headingTool],
            [animeTool, animeIgnoreTool],
            [boldTool, italicTool, strikeThroughTool, underlineTool, codeTool],
            [olTool, ulTool],
            [fontSizeTool, textIndentTool],
            [colorTool, textBackgroundTool],
            [insertParagraphBeforeTool, insertParagraphAfterTool],
            [fontFamilyTool],
            [linkTool, unlinkTool],
            [imageTool],
            [tableAddTool, tableRemoveTool],
            // [formatPainterTool],
            [dividerTool],
            [cleanTool]
          ],
          toolbarRef!
        ),
      () =>
        new InlineToolbarPlugin(
          [
            [headingTool],
            [animeTool, animeIgnoreTool],
            [textAlignTool],
            [boldTool, italicTool, strikeThroughTool, underlineTool, codeTool],
            [colorTool, textBackgroundTool],
            [fontSizeTool],
            [animeBadgeVisibleTool, animeElementVisibleTool],
            [cleanTool]
          ],
          scrollerRef
        ),
      () => new ImgToolbarPlugin([`${ResourceDomain}`]),
      () => new LinkJumpTipPlugin(),
      () => new OutlinePlugin(),
      () => new ShotcutPlugin(),
      () => new ContextMenu(),
      () => new AnimeContextmenuPlugin(),
      () => new AnimeComponentSupport(),
      () => new PreviewPlayerController(controllerRef!)
    ],
    uploader(config) {
      return uploader(config, account, hostname)
    },
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
      // 动画依赖
      const animeProvider = injector.get(AnimeProvider)
      animeProvider.setup(injector, scrollerRef)
      // 组成元素
      const structurer = injector.get(Structurer)
      structurer.setup({
        rootRef,
        scrollerRef,
        toolbarRef,
        editorRef,
        controllerRef
      })
      // 主题依赖
      const themeProvider = injector.get(ThemeProvider)
      themeProvider.setup(injector)
      // 播放器依赖
      const player = injector.get(Player)
      player.setup(injector, scrollerRef)
      // 图片工具
      const imgToUrlService = injector.get(ImgToUrlService)
      const { uploadImgBase64 } = useUploadImg(account, hostname)
      imgToUrlService.setup(uploadImgBase64)
    }
  }
  return config
}
