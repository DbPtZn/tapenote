import { InlineToolbarPlugin,
  Toolbar, boldTool, ConfigProvider, 
  historyBackTool, historyForwardTool, headingTool, 
  italicTool, strikeThroughTool, underlineTool, olTool, ulTool, 
  fontSizeTool, textIndentTool, colorTool, textBackgroundTool, 
  insertParagraphBeforeTool, insertParagraphAfterTool, linkTool, 
  fontFamilyTool, unlinkTool, imageTool, textAlignTool, tableRemoveTool, 
  formatPainterTool, tableAddTool, cleanTool,
  colorFormatLoader, colorFormatter, textBackgroundColorFormatter, 
  textBackgroundColorFormatLoader, animeFormatter, animeFormatLoader, 
  animeTool, AnimeUtilsProvider, AnimeService, 
  AnimeStateProvider, animeRootComponentLoader, 
  animeRootComponent, AddAnimeService, AnimeComponentSupport, 
  defaultGroupTool, DialogProvider, componentsTool, 
  animeComponent, animeComponentLoader, AnimeContextmenuPlugin, 
  OutlinePlugin, outlineTool, OutlineService, PreviewPlayerController, 
  preview_startTool, preview_stopTool, animeBadgeVisibleTool, animeElementVisibleTool, 
  AxiosProvider, imageB2UComponent, imageB2UComponentLoader, paragraphComponent, paragraphComponentLoader, 
  animeIgnoreComponent, animeIgnoreComponentLoader, animeIgnoreTool, CustomCommander, ColorProvider, AnimeProvider, Structurer, ThemeProvider, Player, ImgToUrlService 
} from '@/editor'
import { Commander, fromEvent, Injector } from '@textbus/core'
import {
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  EditorOptions,
  LinkJumpTipPlugin
} from '@textbus/editor'
import { CaretLimit, Input } from '@textbus/platform-browser'
export function getProcedureConfig(args: {
  account: string,
  hostname: string,
  rootRef: HTMLElement,
  editorRef: HTMLElement,
  scrollerRef: HTMLElement, 
  toolbarRef?: HTMLElement,
  controllerRef?: HTMLElement,
  content?: string
}) {
  const { account, hostname, rootRef, editorRef, scrollerRef, toolbarRef, controllerRef, content } = args
  const config: EditorOptions = {
    theme: 'darkline',
    autoFocus: true,
    autoHeight: true,
    zenCoding: true,
    historyStackSize: 30,
    placeholder: '在此输入正文',
    content: content || '',
    rootComponent: animeRootComponent,
    rootComponentLoader: animeRootComponentLoader,
    components: [animeComponent, paragraphComponent, imageB2UComponent, animeIgnoreComponent, ...defaultComponents],
    componentLoaders: [animeComponentLoader, paragraphComponentLoader, imageB2UComponentLoader, animeIgnoreComponentLoader, ...defaultComponentLoaders],
    formatters: [animeFormatter, colorFormatter, textBackgroundColorFormatter,...defaultFormatters],
    formatLoaders: [animeFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    styleSheets: [
      'anime:after{content: attr(data-serial);vertical-align: super;color:white;background-color:#c8c9cc;border-radius:24px;display:inline-block;width:23px;height:23px;font-size:15px;line-height:23px;-webkit-border-radius:24px;text-align:center;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);pointer-events: auto;}',
      'anime:hover:after{cursor: pointer;animation: .8s .5s tada infinite;}',
      '[data-theme="dark-theme"] anime:hover{outline: 1px dashed #aaaaaa30; border-radius: 3px;}',
      'anime:hover{outline: 1px dashed #aaaaaa30; border-radius: 3px;}',
      'anime{pointer-events:none;}',
      'anime:active{pointer-events:none;}',
      '[data-state="active"]:after { background-color:pink }',
      '.anime-element-hidden anime{ opacity: 0!important; }',
      '.anime-element-hidden anime-component{opacity:0!important;}',
      '.anime-badge-hidden anime:after{ display: none; opacity: 0!important; }',
      '.anime-badge-hidden .anime-component-tab:after{ display: none; opacity:0!important;}'
    ],
    providers: [
      { provide: Commander, useClass: CustomCommander },
      AnimeService, AnimeProvider, AddAnimeService, 
      AnimeUtilsProvider, AnimeStateProvider, DialogProvider, 
      OutlineService, ColorProvider,
      Structurer, ThemeProvider, Player, ImgToUrlService
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
        [textAlignTool],
        [tableAddTool, tableRemoveTool],
        [formatPainterTool],
        [cleanTool],
        [outlineTool],
        [animeBadgeVisibleTool, animeElementVisibleTool]
      ], toolbarRef!),
      () =>
        new InlineToolbarPlugin([
          [headingTool],
          [animeTool, animeIgnoreTool],
          [boldTool, italicTool, strikeThroughTool, underlineTool],
          [colorTool, textBackgroundTool],
          [fontSizeTool],
          [animeBadgeVisibleTool, animeElementVisibleTool],
          [cleanTool]
        ], scrollerRef),
      // () => new ContextMenu(),
      () => new AnimeContextmenuPlugin(),
      () => new OutlinePlugin(),
      () => new LinkJumpTipPlugin(),
      () => new AnimeComponentSupport(),
      () => new PreviewPlayerController([
        preview_startTool,
        preview_stopTool
      ],controllerRef!)
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
      // 动画状态依赖
      const animeStateProvider = injector.get(AnimeStateProvider)
      animeStateProvider.setup(injector, scrollerRef)
      // 动画工具依赖
      const animeUtilsProvider = injector.get(AnimeUtilsProvider)
      animeUtilsProvider.setup(injector, scrollerRef)
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
      const accessToken = sessionStorage.getItem(`User:${account}&${hostname}`)
      const imgToUrlService = injector.get(ImgToUrlService)
      imgToUrlService.setup({
        hostname: hostname,
        accessToken: accessToken || '',
        uploadImgUrl: '/upload/img'
      })
    }
  }
  return config
}
