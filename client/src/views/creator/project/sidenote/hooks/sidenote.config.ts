import { InlineToolbarPlugin, OutlinePlugin, OutlineService, Toolbar, boldTool, ConfigProvider, historyBackTool, historyForwardTool, headingTool, italicTool, strikeThroughTool, underlineTool, olTool, ulTool, fontSizeTool, textIndentTool, colorTool, textBackgroundTool, insertParagraphBeforeTool, insertParagraphAfterTool, linkTool, fontFamilyTool, unlinkTool, imageTool, textAlignTool, tableRemoveTool, formatPainterTool, tableAddTool, cleanTool, colorFormatter, textBackgroundColorFormatLoader, colorFormatLoader, textBackgroundColorFormatter, defaultGroupTool, DialogProvider, outlineTool, ColorProvider, rootComponent, rootComponentLoader, ContextMenu, ThemeProvider, Structurer, ImgToUrlService } from '@/editor'
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
export function getSidenoteConfig(args: {
  account: string,
  hostname: string,
  rootRef?: HTMLElement,
  editorRef: HTMLElement,
  scrollerRef: HTMLElement, 
  toolbarRef: HTMLElement,
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
    rootComponent: rootComponent,
    rootComponentLoader: rootComponentLoader,
    components: [...defaultComponents],
    componentLoaders: [...defaultComponentLoaders],
    formatters: [colorFormatter, textBackgroundColorFormatter,...defaultFormatters],
    formatLoaders: [colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    styleSheets: [],
    providers: [
      OutlineService, 
      DialogProvider, 
      OutlineService, 
      ColorProvider, 
      ThemeProvider, 
      Structurer, 
      ImgToUrlService
    ],
    plugins: [
      () => new Toolbar([
        [historyBackTool, historyForwardTool],
        [defaultGroupTool],
        [headingTool],
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
        [outlineTool]
      ], toolbarRef),
      () =>
        new InlineToolbarPlugin([
          [headingTool],
          [boldTool, italicTool, strikeThroughTool, underlineTool],
          [colorTool, textBackgroundTool],
          [fontSizeTool],
          [olTool, ulTool],
          [cleanTool]
        ], scrollerRef),
      () => new OutlinePlugin(),
      () => new LinkJumpTipPlugin(),
      () => new ContextMenu()
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
