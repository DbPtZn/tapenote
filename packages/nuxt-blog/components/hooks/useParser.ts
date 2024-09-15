/** 导出编辑器配置 */
// import type { EditorOptions } from '@textbus/editor'

import { Injector, Subscription } from '@textbus/core'
import { useUploadImg } from './useUploadImg'
import type { Editor } from '@textbus/editor'

async function getEditorConfig() {
  const { defaultComponentLoaders, defaultComponents, defaultFormatLoaders, defaultFormatters, rootComponent, rootComponentLoader } = await import(
    '@textbus/editor'
  )
  const {
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
  } = await import('~/editor')
  // const { Injector } = await import('@textbus/core')
  const config = {
    rootComponent: rootComponent,
    rootComponentLoader: rootComponentLoader,
    content: '',
    components: [imageB2UComponent, animePlayerComponent, animeIgnoreComponent, ...defaultComponents],
    componentLoaders: [imageB2UComponentLoader, animePlayerComponentLoader, animeIgnoreComponentLoader, ...defaultComponentLoaders],
    formatters: [animePlayerFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animePlayerFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    plugins: [],
    providers: [ImgToUrlService],
    setup(injector: Injector) {
      const imgToUrlService = injector.get(ImgToUrlService)
      const { uploadImgFunction } = useUploadImg()
      imgToUrlService.setup(uploadImgFunction)
    }
  }
  return config
}

/** 获取内容数据 */
function parseContent(content: string) {
  const subs: Subscription[] = []
  let editor: Editor | null = null
  const host = document.createElement('div')
  return new Promise<{ content: string; cover: string }>(async (resolve, reject) => {
    const config = await getEditorConfig()
    const { createEditor, Layout } = await import('@textbus/editor')
    const { ImgToUrlService } = await import('~/editor')
    const { debounceTime } = await import('@textbus/core')
    editor = createEditor(config)
    // console.log(config)
    editor.mount(host)

    const img2url = editor.get(ImgToUrlService)

    // 因为组件加载在外部依赖 setup 之前，所以需要在编辑器 ready 之后再替换内容
    subs.push(
      editor.onReady.subscribe(() => {
        editor!.replaceContent(content)
      }),
      editor.onChange.pipe(debounceTime(2000)).subscribe(() => {
        // 2s 后如果没有图片转换任务，则说明已经转换完成或者不存在需要替换的图片组件
        if (img2url.tasks === 0) {
          console.log('replace')
          resolve({ content: editor!.getHTML(), cover: '' })
          destroy()
        }
      }),
      // 图片转换完成时：
      img2url.onFinish.subscribe(() => {
        console.log('img replace finish')
        const container = editor!.get(Layout).container
        const firstImg = container.querySelector('img')
        let cover = ''
        if (firstImg) {
          // 找到最后一个斜杠的索引
          // const lastIndex = imageUrl.lastIndexOf('/')
          // 使用substring方法获取文件名
          // const fileName = imageUrl.substring(lastIndex + 1)
          // console.log(fileName)
          cover = firstImg.src
        }
        // console.log(editor.getHTML())
        // 导出富文本数据
        resolve({ content: editor!.getHTML(), cover: cover })
        destroy()
        host.remove()
      }),
      img2url.onError.subscribe(error => {
        // console.log(error)
        destroy()
        reject(error)
      })
    )
  })

  function destroy() {
    if(editor && !editor.destroyed) {
      editor?.destroy()
    }
    subs.forEach(sub => sub.unsubscribe())
    host.remove()
  }
}

export function useParser() {
  return {
    parseContent
  }
}
