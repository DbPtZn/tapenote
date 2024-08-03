/**
 * 在前端对笔记/微课数据进行打包（文本、图片、音频），发布到博客管理器中
 * 1. 获取目标富文本数据
 * 2. 实例一个新的编辑器（格式、组件等必须保持一致），接收上述数据
 * 3. 通过图片组件将图片转化成 base64，重新导出富文本数据（base64版本）
 * 4. 将富文本数据写入文件中。
 * 5. 将文件以及一些必要的信息发布到博客管理器中（富文本以外的信息可以考虑分开上传，也可以考虑与富文本数据一起写入一个json文件中）
 * 6. 可以考虑对文件进行压缩。
 * 7. 对于微课来说，音频文件以及对应的播放数据也需要上传，这些数据可以考虑写成一个json文件，但音频文件只能当都上传，可以考虑和json文件一起打包压缩后上传。
 */

import { Editor, createEditor } from '@textbus/editor'
import { getEditorConfig } from './exportEditorConfig'
import { Img2base64Service } from '@/editor'
import utils from '@/utils'
import axios from 'axios'
import jszip from 'jszip'
import dayjs from 'dayjs'
// import ejs from 'ejs'
import { Resources } from '@textbus/platform-browser'
interface ProductInfo {
  // -- 作品信息
  type: 'course' | 'note'
  site: string
  code: string
  penname: string
  email: string // 邮箱
  blog: string // 博客地址
  msg: string // 提交时的备注信息
}
interface ProductContent {
  // -- 作品内容
  title: string
  content: string
  audio?: string[]
  duration?: number
  promoterSequence?: Array<string>
  keyframeSequence?: Array<number>
  subtitleSequence?: Array<string>
  subtitleKeyframeSequence?: Array<number>
}

// type PackData = ProductInfo & ProductContent

interface PackData {
  // 版号
  editionId: string

  // -- 作品内容
  title: string
  content: string
  abbrev: string
  audio: string
  duration: number
  wordage: number
  promoterSequence: Array<string>
  keyframeSequence: Array<number>
  subtitleSequence: Array<string>
  subtitleKeyframeSequence: Array<number>

  // -- 作品信息
  type: 'course' | 'note'
  site: string
  code: string
  penname: string
  email: string // 邮箱
  blog: string // 博客地址
  msg: string // 提交时的备注信息
}
export class Pack {
  constructor() {}

  /** 获取内容数据: 将 html 数据中的图片转化成 base64 后重新导出 html 数据以及相关的样式资源 */
  getContent(content: string) {
    return new Promise<{ content: string; resources: Resources }>((resolve, reject) => {
      const config = getEditorConfig(content) // 获取导出模式的编辑器配置
      const editor = createEditor(config) // 创建编辑器
      const host = document.createElement('div') // 创建节点
      let timer
      editor.mount(host) // 挂载编辑器

      const img2base64 = editor.get(Img2base64Service) // 获取 img2base64 依赖注入实例

      editor.onReady.subscribe(() => {
        // 编辑器实例化 1s 后如果没有图片转换任务，则意味着已经转换完成或者不存在需要替换的图片组件，此时直接导出内容
        timer = setTimeout(() => {
          if (img2base64.tasks === 0) {
            try {
              resolve({ content: editor.getHTML(), resources: editor.getResources() })
              editor.destroy()
            } catch (error) {
              reject(error)
            }
          }
        }, 1000)
      })

      // 图片转换完成时：
      img2base64.onFinish.subscribe(() => {
        console.log('Base64 img replace finish!')
        clearTimeout(timer)
        // 导出富文本数据
        resolve({ content: editor.getHTML(), resources: editor.getResources() })
        editor.destroy()
      })

      img2base64.onError.subscribe(error => {
        console.error(error)
        clearTimeout(timer)
        reject(error)
      })
    })
  }

  toFiles(data: PackData) {
    const {
      title, content, audio, duration,
      promoterSequence, keyframeSequence, subtitleSequence, subtitleKeyframeSequence,
      // type, site, code, penname, email, blog, msg
    } = data
    const promoseArray = [
      new Promise<{ type: string; file: Blob }>((resolve, reject) => {
        // 获取富文本数据并结合其它数据生成 JSON Blob
        this.getContent(content)
          .then(({ content: contentbase64, resources }) => {
            const dto = {
              title,
              content: contentbase64,
              duration,
              promoterSequence,
              keyframeSequence,
              subtitleSequence,
              subtitleKeyframeSequence
            }
            const jsonString = JSON.stringify(dto)
            const blob = new Blob([jsonString], { type: 'application/json' })
            // const map = new Map<string, Blob>()
            // map.set('json', blob)
            resolve({ type: 'json', file: blob })
          })
          .catch(error => {
            console.error('导出富文本数据时出错:', error)
            reject(error)
          })
      })
    ]
    if (audio) {
      // 将音频地址转化为文件
      promoseArray.push(
        new Promise<{ type: string; file: Blob }>((resolve, reject) => {
          fetch(audio)
            .then(response => response.blob())
            .then(blob => {
              // console.log('获取到的 Blob 数据:', blob)
              const map = new Map<string, Blob>()
              map.set('audio', blob)
              resolve({ type: 'audio', file: blob })
            })
            .catch(error => {
              console.error('获取音频数据时出错:', error)
              reject(error)
            })
        })
      )
    }

    return Promise.all(promoseArray).then(files => {
      return files
    })
  }

  async download(data: PackData) {
    try {
      const zip = new jszip()
      const {
        title, content,
        audio, duration, promoterSequence, keyframeSequence, subtitleSequence, subtitleKeyframeSequence,
        type, penname, email, blog, msg
      } = data
      // 1.导出内容数据
      const { content: contentbase64, resources } = await this.getContent(content)
      // console.log(resources)
      // 2.获取 html 模板并插入数据，导出 html 文件
      await fetch('./template/template.html')
      .then(response => response.text())
      .then(template => {
          // const productData = { type, duration, promoterSequence, keyframeSequence, subtitleSequence, subtitleKeyframeSequence }
          // 渲染模板
          // const renderedHtml = ejs.render(template, {
          //   type: type === 'note' ? '文章' : '微课',
          //   title: title || '',
          //   content: contentbase64,
          //   penname: penname || '',
          //   email: email || '',
          //   blog: blog || '',
          //   version: '1.0.0',
          //   wordage: content.replace(/<[^>]+>/g, '').length,
          //   duration: duration || 0,
          //   msg: msg || '',
          //   productData: JSON.stringify(productData),
          // })
          // 打包 html文件
          // console.log('renderedHtml', renderedHtml)
          zip.file('index.html', template)
      })
      // 3.获取 js 模板
      const jsFiles = ['anime.min.js', 'component.js', 'main.js', 'player.js', 'presets.js', 'stream.js'].map(filename => {
        return fetch(`./template/scripts/${filename}`).then(response => response.blob()).then(blob => { zip.folder('scripts')?.file(`${filename}`, blob) })
      })
      await Promise.all(jsFiles)
      // 4.获取 css 模板
      const cssFiles = ['base.css', 'dark.css', 'edit-dark.css', 'index.css', 'light.css', 'textbus.cmpt.css'].map(filename => {
        return fetch(`./template/styles/${filename}`).then(response => response.blob()).then(blob => { zip.folder('styles')?.file(`${filename}`, blob) })
      })
      await Promise.all(cssFiles)
      zip.folder('styles')?.file('styleSheet.css', resources.styleSheet)
      // 5.获取音频文件
      if (audio) {
        await fetch(audio).then(response => response.blob()).then(blob => {
          zip.file('audio.wav', blob)
        })
      }
      // 6.打包课程所需的元数据
      const version = '1.0.0' // 应该从环境变量中读取
      const wordage = content.replace(/<[^>]+>/g, '').length
      const dto = { type, title, content: contentbase64, penname, email, blog, version, wordage, duration, msg, promoterSequence, keyframeSequence, subtitleSequence, subtitleKeyframeSequence }
      const jsonString = JSON.stringify(dto)
      // 在同源策略（CORS）下，无法从本地直接读取 json 文件，故需要通过 script 标签导入，并配置 window 全局变量的方式进行获取
      zip.file('metadata.json', "window['metadata'] = " + jsonString)
      // 7.打包 favicon 图标
      await fetch(`./template/favicon.ico`).then(response => response.blob()).then(blob => { zip.file(`favicon.ico`, blob) })
      // 8.导出默认配置
      // const defaultConfig = { type, penname, email, blog, msg }
      // 生成 ZIP 文件
      return zip
        .generateAsync({ type: 'blob' })
        .then(blob => {
          // 创建 URL 对象
          const url = URL.createObjectURL(blob)
          // 创建 <a> 标签并设置其属性
          const link = document.createElement('a')
          link.href = url
          link.download = `${title.slice(0, 24)}-${dayjs(Date.now()).format("YYMMDDHHmmss")}.zip` // 设置下载的文件名
          // 模拟点击 <a> 标签以触发下载
          link.click()
          // 清理 URL 对象
          URL.revokeObjectURL(url)
        })
        .catch(error => {
          console.error('Error generating ZIP:', error)
        })
    } catch (error) {
      console.error('Error downloading files:', error)
      throw error
    }
  }

  submit(data: PackData) {
    return new Promise<string>((resolve, reject) => {
      this.toFiles(data).then(files => {
        // const map = mergeMaps<Map<string, Blob>>(maps)
        const jsonIndex = files.findIndex(item => item.type === 'json')
        const jsonBlob = files[jsonIndex].file
        const audioIndex = files.findIndex(item => item.type === 'audio')
        const audioBlob = audioIndex === -1 ? null : files[audioIndex].file
        // const file = new File([product], 'product_' + Date.now() + '.json', { type: 'application/json' })
        // const blob = new Blob([file], { type: 'application/octet-stream' })
        const { site, type, editionId, title, abbrev, code, penname, email, blog, msg, duration, wordage } = data

        const formData = new FormData()
        jsonBlob && formData.append('jsonDocs', jsonBlob, 'document.json')
        audioBlob && formData.append('audios', audioBlob, 'audio.wav')

        formData.append('type', type)
        formData.append('editionId', editionId)
        formData.append('title', title)
        formData.append('abbrev', abbrev)
        formData.append('code', code)
        formData.append('penname', penname)
        formData.append('email', email)
        formData.append('blog', blog)
        formData.append('msg', msg)
        formData.append('duration', `${duration || 0}`)
        formData.append('wordage', `${wordage || 0}`)

        axios({
          method: 'post',
          url: `${site}&${code}`,
          data: formData,
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          //   // 'authorization': `Bearer ${code}`,
          //   // 'auth-code': `Bearer ${code}`,
          // },
        })
          .then(res => {
            console.log(res)
            if(!res) throw new Error('投稿失败：推送目标可能无效！')
            const editionId = res.data.editionId
            resolve(editionId)
          })
          .catch(error => {
            // console.log(error)
            reject(error)
          })
      })
    })
  }
}

export const pack = new Pack()

// function mergeMaps<T>(...maps): T {
//   return new Map([...maps.reduce((acc, map) => [...acc, ...map], [])]) as T
// }

// genProduct(data: PackData) {
//   const {
//     title, content, audio, duration,
//     promoterSequence, keyframeSequence, subtitleSequence, subtitleKeyframeSequence,
//     type, site, code, penname, email, blog, msg
//   } = data
//   const product = {
//     title, content, audio, duration,
//     promoterSequence, keyframeSequence,subtitleSequence, subtitleKeyframeSequence
//   }
//   const info = { type, site, code, penname, email, blog, msg }
//   const jsonProduct = JSON.stringify(product);
//   const tempFilePath = fs.mkdtempSync('temp-')
//   压缩 JSON 数据
//   zlib.gzip(jsonProduct, (error, compressedData) => {
//     if (error) {
//       console.error('Compression failed:', error)
//       return
//     }
//      // 将压缩后的数据写入临时文件
//     fs.writeFile(tempFilePath, compressedData, (error) => {
//       if (error) {
//         console.error('Failed to write file:', error)
//         return
//       }

//       console.log('JSON data packed and compressed successfully.')
//     })
//   })
//   return { info, tempFilePath }
// }
