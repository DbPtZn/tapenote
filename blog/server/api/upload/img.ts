import { FileService, fileService } from '~/services'
import formidable from 'formidable'
import { CreateArticleDto } from '~/dto'
import { Types } from 'mongoose'
import { H3Event, EventHandlerRequest } from 'h3'
import { extname } from 'path'

export default defineEventHandler(async (event) => {
  try {
     /** 接收/处理 formdata 数据 */
     const form = formidable({
      multiples: true,
      uploadDir: 'uploads/', // 指定上传文件存放的目录
      keepExtensions: true, // 保持文件的原始扩展名
      maxFileSize: 12 * 1024 * 1024, // 限制文件大小为 12 MB
    })
     // 监听错误事件
    form.on('error', (err) => {
      if (err.code === 'ENOENT') {
        // 文件大小超出限制
        console.error('File size exceeds the limit')
        throw err
      }
    })

    const formParse = () => new Promise<{ fields: any, files: any }>((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) {
          reject(err)
        } else {
          resolve({ fields, files })
        }
      })
    })
    const { files } = await formParse()
    // console.log('files.file[0].filepath')
    // console.log(files.file[0].filepath)
    // console.log(event.context.auth.UID)
    const sourcePath = files.file[0].filepath
    const path = await fileService.saveImage({
      sourcePath,
      extname: extname(sourcePath),
      dirname: event.context.auth.UID
    }, event.context.auth.id)
    
    // console.log(path)
    const imgPath = path.split('public')[1]
    // console.log(imgPath)
    return imgPath
  } catch (error: any) {
    console.error('error')
    console.error(error.message)
    throw createError({
      statusCode: 400,
      message: '图片上传失败！'
    })
  }
})
