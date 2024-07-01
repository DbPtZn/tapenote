// /** 导出编辑器配置 */
// // import type { EditorOptions } from '@textbus/editor'

// import { Injector, debounceTime } from '@textbus/core'
// import {
//   rootComponent,
//   rootComponentLoader,
//   defaultComponents,
//   defaultComponentLoaders,
//   colorFormatter,
//   textBackgroundColorFormatter,
//   defaultFormatters,
//   colorFormatLoader,
//   textBackgroundColorFormatLoader,
//   defaultFormatLoaders,
//   createEditor,
//   Layout
// } from '@textbus/editor'
// import {
//   imageB2UComponent,
//   animePlayerComponent,
//   animeIgnoreComponent,
//   imageB2UComponentLoader,
//   animePlayerComponentLoader,
//   animeIgnoreComponentLoader,
//   animePlayerFormatter,
//   animePlayerFormatLoader,
//   ImgToUrlService
// } from '~/editor'

// async function getEditorConfig() {
//   const config = {
//     rootComponent: rootComponent,
//     rootComponentLoader: rootComponentLoader,
//     content: '',
//     components: [imageB2UComponent, animePlayerComponent, animeIgnoreComponent, ...defaultComponents],
//     componentLoaders: [imageB2UComponentLoader, animePlayerComponentLoader, animeIgnoreComponentLoader, ...defaultComponentLoaders],
//     formatters: [animePlayerFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
//     formatLoaders: [animePlayerFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
//     plugins: [],
//     providers: [ImgToUrlService],
//     setup(injector: Injector) {
//       const imgToUrlService = injector.get(ImgToUrlService)
//       imgToUrlService.setup(img => {
//         return new Promise<string>((resolve, reject) => {
//           const formdata = new FormData()
//           const file = ImgToUrlService.base64ImgtoFile(img)
//           formdata.append('file', file) //图片文件
//           $fetch('/api/uploads/img', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'multipart/form-data'
//             },
//             body: formdata
//           })
//         })
//       })
//     }
//   }
//   return config
// }

// /** 获取内容数据 */
// function parseContent(content: string) {
//   return new Promise<{ content: string; cover: string }>(async (resolve, reject) => {
//     const config = await getEditorConfig()
//     const editor = createEditor(config)
//     console.log(config)
//     const host = document.createElement('div')
//     editor.mount(host)

//     const img2url = editor.get(ImgToUrlService)

//     // 因为组件加载在外部依赖 setup 之前，所以需要在编辑器 ready 之后再替换内容
//     editor.onReady.subscribe(() => {
//       editor.replaceContent(content)
//     })

//     editor.onChange.pipe(debounceTime(1000)).subscribe(() => {
//       // 1s 后如果没有图片转换任务，则说明已经转换完成或者不存在需要替换的图片组件
//       if (img2url.tasks === 0) {
//         console.log('replace')
//         resolve({ content: editor.getHTML(), cover: '' })
//       }
//     })

//     Promise.all(img2url.promiseSequence).then(() => {
//       console.log('all finish')
//       img2url.promiseSequence = []
//     })

//     // 图片转换完成时：
//     img2url.onFinish.subscribe(() => {
//       console.log('img replace finish')
//       const container = editor.get(Layout).container
//       const firstImg = container.querySelector('img')
//       let cover = ''
//       if (firstImg) {
//         // 找到最后一个斜杠的索引
//         // const lastIndex = imageUrl.lastIndexOf('/')
//         // 使用substring方法获取文件名
//         // const fileName = imageUrl.substring(lastIndex + 1)
//         // console.log(fileName)
//         cover = firstImg.src
//       }
//       // console.log(cover)
//       // 导出富文本数据
//       resolve({ content: editor.getHTML(), cover: cover })
//       editor.destroy()
//     })

//     img2url.onError.subscribe(error => {
//       console.log(error)
//       editor.destroy()
//       reject(error)
//     })
//   })
// }

// export function useParser() {
//   return {
//     parseContent
//   }
// }
