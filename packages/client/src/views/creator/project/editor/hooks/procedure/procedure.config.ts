import { 
  InlineToolbarPlugin, Toolbar, boldTool,
  historyBackTool, historyForwardTool,
  italicTool, strikeThroughTool, underlineTool,
  fontSizeTool, textIndentTool, colorTool, textBackgroundTool,
  linkTool, fontFamilyTool, unlinkTool, imageTool, textAlignTool, tableRemoveTool,
  formatPainterTool, tableAddTool, cleanTool,
  colorFormatLoader, colorFormatter, textBackgroundColorFormatter,
  textBackgroundColorFormatLoader, animeFormatter, animeFormatLoader,
  AddAnimeService, AnimeComponentSupport,
  defaultGroupTool, DialogProvider, componentsTool,
  AnimeContextmenuPlugin,
  OutlinePlugin, outlineTool, OutlineService, PreviewPlayerController,
  preview_startTool, preview_stopTool,
  imageB2UComponent, imageB2UComponentLoader,  CustomCommander,
  ColorProvider, Structurer, ThemeProvider, Player, ImgToUrlService,
  AnimeService,
  preComponent,
  imageCardComponent,
  jumbotronComponent,
  imageCardComponentLoader,
  jumbotronComponentLoader,
  preComponentLoader,
  ContextMenu,
  MemoService,
  MemoPlugin,
  MessageService,
  StudioService,
  ImgService,
  i18n,
  rootAnimeComponent,
  rootAnimeComponentLoader,
  animeTool, animeBadgeVisibleTool, animeIgnoreTool, animeElementVisibleTool, AnimeProvider,
  listComponent, listComponentLoader, headingComponent, headingComponentLoader,
  paragraphComponent, paragraphComponentLoader,
  animeComponent, animeComponentLoader, animeIgnoreComponent, animeIgnoreComponentLoader,
  headingTool, olTool, ulTool, insertParagraphAfterTool, insertParagraphBeforeTool, 
  tableComponent, tableComponentLoader,
  dividerTool, dividerComponent, dividerComponentLoader, Memo, ImgToolbarPlugin, ShotcutPlugin, MemoProvider,
} from '@/editor'
import { Commander, fromEvent, Injector } from '@textbus/core'
import {
  alertComponent,
  alertComponentLoader,
  audioComponent,
  audioComponentLoader,
  blockComponent,
  blockComponentLoader,
  blockquoteComponent,
  blockquoteComponentLoader,
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  EditorOptions,
  katexComponent,
  katexComponentLoader,
  LinkJumpTipPlugin,
  stepComponent,
  stepComponentLoader,
  timelineComponent,
  timelineComponentLoader,
  todolistComponent,
  todolistComponentLoader,
  videoComponent,
  videoComponentLoader,
  wordExplainComponent,
  wordExplainComponentLoader
} from '@textbus/editor'
import { CaretLimit, Input } from '@textbus/platform-browser'
import { useUploadImg } from '../../../../_utils'
import '@/editor/anime.css'
import { uploader } from '../uploader'
import { getResourceDomain } from '@/views/creator/_hooks'

export function getProcedureConfig(args: {
  account: string,
  hostname: string,
  dirname: string,
  rootRef: HTMLElement,
  editorRef: HTMLElement,
  scrollerRef: HTMLElement,
  memos: Memo[],
  toolbarRef?: HTMLElement,
  controllerRef?: HTMLElement,
  content?: string
}) {
  const { account, hostname, rootRef, editorRef, scrollerRef, toolbarRef, controllerRef, memos, content } = args
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
    components: [
      paragraphComponent, animeComponent, imageB2UComponent, animeIgnoreComponent, listComponent, headingComponent,
      audioComponent,
      blockComponent,
      blockquoteComponent,
      headingComponent,
      paragraphComponent,
      preComponent,
      tableComponent,
      videoComponent,
      imageCardComponent,
      todolistComponent,
      katexComponent,
      wordExplainComponent,
      timelineComponent,
      stepComponent,
      alertComponent,
      jumbotronComponent,
      dividerComponent,
    ],
    componentLoaders: [
      paragraphComponentLoader, animeComponentLoader, imageB2UComponentLoader, animeIgnoreComponentLoader, listComponentLoader, headingComponentLoader,
      imageCardComponentLoader,
      todolistComponentLoader,
      katexComponentLoader,
      wordExplainComponentLoader,
      timelineComponentLoader,
      stepComponentLoader,
      alertComponentLoader,
      jumbotronComponentLoader,
      audioComponentLoader,
      blockquoteComponentLoader,
      blockComponentLoader,
      headingComponentLoader,
      listComponentLoader,
      paragraphComponentLoader,
      preComponentLoader,
      tableComponentLoader,
      videoComponentLoader,
      dividerComponentLoader,
    ],
    formatters: [animeFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animeFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    providers: [
      { provide: Commander, useClass: CustomCommander },
      AnimeProvider, AddAnimeService, DialogProvider, 
      OutlineService, ColorProvider, AnimeService,
      Structurer, ThemeProvider, Player, ImgToUrlService,
      MemoService, MessageService, StudioService,
      ImgService, MemoProvider
    ],
    plugins: [
      () => new Toolbar([
        [historyBackTool, historyForwardTool],
        [defaultGroupTool],
        [componentsTool],
        [headingTool],
        [animeTool, animeIgnoreTool],
        [boldTool, italicTool, strikeThroughTool, underlineTool],
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
        [cleanTool],
      ], toolbarRef!),
      () =>
        new InlineToolbarPlugin([
          [headingTool],
          [animeTool, animeIgnoreTool],
          [textAlignTool],
          [boldTool, italicTool, strikeThroughTool, underlineTool],
          [colorTool, textBackgroundTool],
          [fontSizeTool],
          [animeBadgeVisibleTool, animeElementVisibleTool],
          [cleanTool]
        ], scrollerRef),
      () => new OutlinePlugin(),
      // () => new ContextMenu(),
      () => new LinkJumpTipPlugin(),
      // () => new AnimeContextmenuPlugin(),
      () => new ImgToolbarPlugin([`${ResourceDomain}`]),
      () => new AnimeComponentSupport(),
      () => new ShotcutPlugin(),
      () => new PreviewPlayerController([
        preview_startTool,
        preview_stopTool
      ],controllerRef!),
      // () => new MemoPlugin(memos),
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
      const { uploadImgFunction } = useUploadImg(account, hostname)
      imgToUrlService.setup(uploadImgFunction)
    }
  }
  return config
}
