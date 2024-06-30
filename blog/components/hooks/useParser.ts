/** 导出编辑器配置 */
import {
  colorFormatter,
  textBackgroundColorFormatLoader,
  colorFormatLoader,
  textBackgroundColorFormatter,
  animeIgnoreComponentLoader,
  animePlayerComponent,
  animeIgnoreComponent,
  animePlayerComponentLoader,
  imageB2UComponent,
  imageB2UComponentLoader,
  animePlayerFormatter,
  animePlayerFormatLoader,
  ImgToUrlService
} from './editor'
import { Injector, debounceTime } from '@textbus/core'
import {
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  rootComponent,
  rootComponentLoader,
  type EditorOptions,
  createEditor,
  Layout
} from '@textbus/editor'
function getEditorConfig(content: string, hostname: string, accessToken: string, uploadImgUrl: string) {
  const config: EditorOptions = {
    rootComponent: rootComponent,
    rootComponentLoader: rootComponentLoader,
    content: content || '',
    components: [imageB2UComponent, animePlayerComponent, animeIgnoreComponent, ...defaultComponents],
    componentLoaders: [imageB2UComponentLoader, animePlayerComponentLoader, animeIgnoreComponentLoader, ...defaultComponentLoaders],
    formatters: [animePlayerFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animePlayerFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    plugins: [],
    providers: [ImgToUrlService],
    setup(injector: Injector) {
      const imgToUrlService = injector.get(ImgToUrlService)
      // imgToUrlService.setup({
      //   hostname: hostname,
      //   accessToken: accessToken || '',
      //   uploadImgUrl: '/upload/img'
      // })
      imgToUrlService
    }
  }
  return config
}

/** 获取内容数据 */
function parseContent(args: { content: string; hostname: string; accessToken: string; uploadImgUrl: string }) {
  const { content, hostname, accessToken, uploadImgUrl } = args
  return new Promise<{ content: string; firstPicture: string }>((resolve, reject) => {
    const config = getEditorConfig('', hostname, accessToken, uploadImgUrl)
    const editor = createEditor(config)
    const host = document.createElement('div')
    editor.mount(host)

    const img2url = editor.get(ImgToUrlService)

    // 因为组件加载在外部依赖 setup 之前，所以需要在编辑器 ready 之后再替换内容
    editor.onReady.subscribe(() => {
      editor.replaceContent(content)
    })

    editor.onChange.pipe(debounceTime(1000)).subscribe(() => {
      // 1s 后如果没有图片转换任务，则说明已经转换完成或者不存在需要替换的图片组件
      if (img2url.tasks === 0) {
        console.log('replace')
        resolve({ content: editor.getHTML(), firstPicture: '' })
      }
    })

    Promise.all(img2url.promiseSequence).then(() => {
      console.log('all finish')
      img2url.promiseSequence = []
    })

    // 图片转换完成时：
    img2url.onFinish.subscribe(() => {
      console.log('img replace finish')
      const container = editor.get(Layout).container
      const firstImg = container.querySelector('img')
      let firstPicture = ''
      if (firstImg) {
        // 找到最后一个斜杠的索引
        // const lastIndex = imageUrl.lastIndexOf('/')
        // 使用substring方法获取文件名
        // const fileName = imageUrl.substring(lastIndex + 1)
        // console.log(fileName)
        firstPicture = firstImg.src
      }
      // console.log(firstPicture)
      // 导出富文本数据
      resolve({ content: editor.getHTML(), firstPicture: firstPicture })
      // editor.destroy()
    })

    img2url.onError.subscribe(error => {
      console.log(error)
      reject(error)
    })
  })
}


export function useParser(content: string) {
  return {
    parseContent
  }
}