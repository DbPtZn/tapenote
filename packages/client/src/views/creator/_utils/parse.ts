import { Subscription, debounceTime } from '@textbus/core'
import { type Editor, createEditor, Layout } from '@textbus/editor'
import { ImgToUrlService } from '@/editor'
import { getInputEditorConfig } from './inputEditorConfig'
export function useParser(account: string, hostname: string) {
  function parseContent(content: string) {
    const subs: Subscription[] = []
    let editor: Editor | null = null
    const host = document.createElement('div')
    return new Promise<{ content: string; cover: string }>(async (resolve, reject) => {
      const config = getInputEditorConfig(account, hostname)
      editor = createEditor(config)
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
      if (editor && !editor.destroyed) {
        editor?.destroy()
      }
      subs.forEach(sub => sub.unsubscribe())
      host.remove()
    }
  }
  return {
    parseContent
  }
}
