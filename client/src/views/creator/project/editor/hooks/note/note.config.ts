import { InlineToolbarPlugin, OutlinePlugin, ResizeService, OutlineService, Toolbar, boldTool, historyBackTool, historyForwardTool, headingTool, italicTool, strikeThroughTool, underlineTool, olTool, ulTool, fontSizeTool, textIndentTool, colorTool, textBackgroundTool, insertParagraphBeforeTool, insertParagraphAfterTool, linkTool, fontFamilyTool, unlinkTool, imageTool, textAlignTool, tableRemoveTool, formatPainterTool, tableAddTool, cleanTool, colorFormatter, textBackgroundColorFormatLoader, colorFormatLoader, textBackgroundColorFormatter, defaultGroupTool, DialogProvider, imageB2UComponent, imageB2UComponentLoader, AxiosProvider, outlineTool, Clipboard, ContextMenu, CustomCommander, ColorProvider, componentsTool, rootComponent, rootComponentLoader, Structurer, ThemeProvider, ImgToUrlService, preComponent, preComponentLoader } from '@/editor'
import { Commander, fromEvent, Injector } from '@textbus/core'
import {
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  EditorOptions,
  LinkJumpTipPlugin,
} from '@textbus/editor'
import { CaretLimit, Input } from '@textbus/platform-browser'
export function getNoteConfig(args: {
  account: string,
  hostname: string,
  dirname: string,
  rootRef: HTMLElement,
  editorRef: HTMLElement,
  scrollerRef: HTMLElement,
  toolbarRef?: HTMLElement,
  controllerRef?: HTMLElement,
  content?: string
}) {
  const { account, hostname, dirname, rootRef, editorRef, scrollerRef, toolbarRef, controllerRef, content } = args
  const config: EditorOptions = {
    theme: 'darkline',
    autoFocus: true,
    autoHeight: true,
    zenCoding: true,
    historyStackSize: 30,
    placeholder: '在此输入正文',
    rootComponent: rootComponent,
    rootComponentLoader: rootComponentLoader,
    content: content || '',
    components: [imageB2UComponent, preComponent, ...defaultComponents],
    componentLoaders: [imageB2UComponentLoader, preComponentLoader, ...defaultComponentLoaders],
    formatters: [colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    // styleSheets: [],
    providers: [
      { provide: Commander, useClass: CustomCommander },
      ResizeService, 
      OutlineService,
      DialogProvider,
      ColorProvider,
      Structurer,
      ThemeProvider,
      ImgToUrlService
    ],
    plugins: [
      // () => new Toolbar([
      //   // [historyBackTool, historyForwardTool],
      //   // [defaultGroupTool],
      //   // [componentsTool],
      //   // [headingTool],
      //   // [boldTool, italicTool, strikeThroughTool, underlineTool],
      //   // [olTool, ulTool],
      //   // [fontSizeTool, textIndentTool],
      //   // [colorTool, textBackgroundTool],
      //   // [insertParagraphBeforeTool, insertParagraphAfterTool],
      //   // [fontFamilyTool],
      //   // [linkTool, unlinkTool],
      //   // [imageTool],
      //   // [textAlignTool],
      //   // [tableAddTool, tableRemoveTool],
      //   // [formatPainterTool],
      //   // [cleanTool],
      //   // [outlineTool]
      // ], toolbarRef!),
      // () =>
      //   new InlineToolbarPlugin([
      //     [headingTool],
      //     [boldTool, italicTool, strikeThroughTool, underlineTool],
      //     [colorTool, textBackgroundTool],
      //     [fontSizeTool],
      //     [olTool, ulTool],
      //     [cleanTool]
      //   ], scrollerRef),
      () => new LinkJumpTipPlugin(),
      () => new OutlinePlugin(),
      // () => new Clipboard(),
      // () => new ContextMenu()
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
      // 图片工具
      const accessToken = sessionStorage.getItem(`User:${account}&${hostname}`)
      const imgToUrlService = injector.get(ImgToUrlService)
      imgToUrlService.setup({
        hostname: hostname,
        accessToken: accessToken || '',
        uploadImgUrl: '/upload/img',
        dirname: dirname
      })
    }
  }
  return config
}
