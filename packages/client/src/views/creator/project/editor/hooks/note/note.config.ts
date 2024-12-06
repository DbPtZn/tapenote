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
  tableAddTool,
  cleanTool,
  defaultGroupTool,
  DialogProvider,
  codeTool,
  ContextMenu,
  CustomCommander,
  ColorProvider,
  componentsTool,
  rootComponent,
  rootComponentLoader,
  Structurer,
  ThemeProvider,
  ImgToUrlService,
  MemoService,
  ImgToolbarPlugin,
  ImgService,
  MessageService,
  i18n,
  dividerTool,
  ShotcutPlugin,
  Memo,
  MemoProvider,
  defaultComponents,
  defaultComponentLoaders,
  defaultAttributeLoaders,
  defaultAttributes,
  defaultFormatters,
  defaultFormatLoaders
} from '@/editor'
import { Commander, fromEvent, Injector } from '@textbus/core'
import {
  EditorOptions,
  LinkJumpTipPlugin} from '@textbus/editor'
import { CaretLimit, Input } from '@textbus/platform-browser'
import { useUploadImg } from '../../../../_hooks'
import { getResourceDomain } from '../../../../_hooks'
import { uploader } from '../uploader'
export function getNoteConfig(args: {
  account: string
  hostname: string
  dirname: string
  memos: Memo[],
  content?: string,
  projectEl: HTMLElement,
  editorWrapperEl: HTMLElement,
  editorEl: HTMLElement,
  scrollerEl: HTMLElement, 
  toolbarEl?: HTMLElement,
  controllerEl?: HTMLElement,
}) {
  const { account, hostname, projectEl, editorWrapperEl, editorEl, scrollerEl, toolbarEl, controllerEl, memos, content } = args

  editorEl.classList.add('note-editor')
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
    components: defaultComponents,
    componentLoaders: defaultComponentLoaders,
    formatters: defaultFormatters,
    formatLoaders: defaultFormatLoaders,
    attributes: defaultAttributes,
    attributeLoaders: defaultAttributeLoaders,
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
            [boldTool, italicTool, strikeThroughTool, underlineTool, codeTool],
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
            [dividerTool],
            [cleanTool]
            // [outlineTool]
          ],
          toolbarEl!
        ),
      () =>
        new InlineToolbarPlugin(
          [
            [headingTool],
            [textAlignTool],
            [boldTool, italicTool, strikeThroughTool, underlineTool, codeTool],
            [colorTool, textBackgroundTool],
            [fontSizeTool],
            [cleanTool]
          ],
          scrollerEl
        ),
      () => new ImgToolbarPlugin([`${ResourceDomain}`]),
      () => new LinkJumpTipPlugin(),
      () => new OutlinePlugin(),
      () => new ShotcutPlugin(),
      () => new ContextMenu()
    ],
    uploader(config) {
      return uploader(config, account, hostname)
    },
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
      // 上传图片
      const imgToUrlService = injector.get(ImgToUrlService)
      const { uploadImgBase64 } = useUploadImg(account, hostname)
      imgToUrlService.setup(uploadImgBase64)
    }
  }
  return config
}
