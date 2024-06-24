import { userService } from '~/services'
import formidable from 'formidable'

export default defineEventHandler(async (event) => {
  try {
    const account = getRouterParam(event, 'account')
    console.log(account)
    if(!account) throw new Error('缺少 account 参数！')

    // const file = event.node.req
    const user = await userService.findOneByAccount(account)
    if(!user) throw new Error('用户不存在！')

    const form = formidable({
      multiples: true,
      uploadDir: 'uploads/', // 指定上传文件存放的目录
      keepExtensions: true // 保持文件的原始扩展名
    })

    form.parse(event.node.req, (err, fields, files) => {
      if (err) {
        console.error(err)
        throw createError({
          message: '投稿失败！',
        })
      }
      console.log(fields)
      console.log(files)
      // files
    })

    // event.node.res.statusCode = 200
    // event.node.res.end('ok')
    event.node.res.statusCode = 400
    event.node.res.end('投稿失败!')
  } catch (error) {
    console.error(error)
    event.node.res.statusCode = 400
    event.node.res.end('投稿失败!')
  }
})