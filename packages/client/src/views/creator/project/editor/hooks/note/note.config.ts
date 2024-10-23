import {
  InlineToolbarPlugin,
  OutlinePlugin,
  ResizeService,
  OutlineService,
  Toolbar,
  boldTool,
  historyBackTool,
  historyForwardTool,
  headingTool,
  italicTool,
  strikeThroughTool,
  underlineTool,
  olTool,
  ulTool,
  fontSizeTool,
  textIndentTool,
  colorTool,
  textBackgroundTool,
  insertParagraphBeforeTool,
  insertParagraphAfterTool,
  linkTool,
  fontFamilyTool,
  unlinkTool,
  imageTool,
  textAlignTool,
  tableRemoveTool,
  formatPainterTool,
  tableAddTool,
  cleanTool,
  colorFormatter,
  textBackgroundColorFormatLoader,
  colorFormatLoader,
  textBackgroundColorFormatter,
  defaultGroupTool,
  DialogProvider,
  imageB2UComponent,
  imageB2UComponentLoader,
  outlineTool,
  Clipboard,
  ContextMenu,
  CustomCommander,
  ColorProvider,
  componentsTool,
  rootComponent,
  rootComponentLoader,
  listComponent,
  listComponentLoader,
  Structurer,
  ThemeProvider,
  ImgToUrlService,
  preComponent,
  preComponentLoader,
  KeyboardManager,
  MemoService,
  MemoProvider,
  ImgToolbarPlugin,
  ImgService,
  MessageService,
  tableComponent,
  tableComponentLoader
} from '@/editor'
import { Commander, fromEvent, Injector, Keyboard } from '@textbus/core'
import {
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  EditorOptions,
  I18n,
  LinkJumpTipPlugin
} from '@textbus/editor'
import { CaretLimit, Input } from '@textbus/platform-browser'
import { useUploadImg } from '../../../../_utils'
import { i18n } from '../i18n'
import { getResourceDomain } from '../../../../_hooks'
import { resolve } from 'path'
import { uploader } from '../uploader'
export function getNoteConfig(args: {
  account: string
  hostname: string
  dirname: string
  rootRef: HTMLElement
  editorRef: HTMLElement
  scrollerRef: HTMLElement
  toolbarRef?: HTMLElement
  controllerRef?: HTMLElement
  content?: string
}) {
  const { account, hostname, dirname, rootRef, editorRef, scrollerRef, toolbarRef, controllerRef, content } = args
  const ResourceDomain = getResourceDomain(hostname)
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
    components: [imageB2UComponent, preComponent, listComponent, tableComponent, ...defaultComponents.filter(i => !(['ListComponent', 'TableComponent'].includes(i.name)))], // 组件虽然可以覆盖,但快捷键仍然会被注册, 所以得过滤掉
    componentLoaders: [imageB2UComponentLoader, preComponentLoader, listComponentLoader, tableComponentLoader, ...defaultComponentLoaders],
    formatters: [colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    i18n: i18n,
    providers: [
      { provide: Commander, useClass: CustomCommander },
      ResizeService,
      OutlineService,
      DialogProvider,
      ColorProvider,
      Structurer,
      ThemeProvider,
      ImgToUrlService,
      MemoProvider,
      MemoService,
      ImgService,
      MessageService
    ],
    plugins: [
      () =>
        new Toolbar(
          [
            [historyBackTool, historyForwardTool],
            [defaultGroupTool],
            [componentsTool],
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
            // [formatPainterTool],
            [cleanTool]
            // [outlineTool]
          ],
          toolbarRef!
        ),
      () =>
        new InlineToolbarPlugin(
          [
            [headingTool],
            [textAlignTool],
            [boldTool, italicTool, strikeThroughTool, underlineTool],
            [colorTool, textBackgroundTool],
            [fontSizeTool],
            [olTool, ulTool],
            [cleanTool]
          ],
          scrollerRef
        ),
      () => new ImgToolbarPlugin([`${ResourceDomain}`]),
      () => new LinkJumpTipPlugin(),
      () => new OutlinePlugin()
      // () => new Clipboard(),
      // () => new ContextMenu()
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

      // const keyboardManager = injector.get(KeyboardManager)
      // keyboardManager.setup(injector)
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
      // 上传图片
      const imgToUrlService = injector.get(ImgToUrlService)
      const { uploadImgFunction } = useUploadImg('/upload/img', account, hostname)
      imgToUrlService.setup(uploadImgFunction)
      // imgToUrlService.onFinish.subscribe((value) => {
      //   console.log('上传成功:')
      //   console.log(value)
      // })
    }
  }
  return config
}
