import { authcodeService, userService, articleService } from '~/services'
import formidable from 'formidable'
import { CreateArticleDto } from '~/dto'

export default defineEventHandler(async (event) => {
  try {
    const params = getRouterParam(event, 'params')
    console.log(params)
    if(!params) throw new Error('缺少 params 参数！')
    const [account, code] = params.split('&')
    // TODO 或考虑 account 换成 UID
    const user = await userService.findOneByAccount(account)
    if(!user) throw new Error('用户不存在！')
    if(user.receiverConfig.status === 2) {
      throw new Error('收稿人拒绝任何投稿！')
    }

    /** 授权码验证 */
    // console.log(authcode)
    console.log(getHeader(event, 'Auth-Code'))
    const authcode = await authcodeService.findOneByCode(code, user._id)
    if(!authcode) {
      throw new Error('授权码验证失败！')
    }
    
    /** 接收/处理 formdata 数据 */
    const form = formidable({
      multiples: true,
      uploadDir: 'uploads/', // 指定上传文件存放的目录
      keepExtensions: true, // 保持文件的原始扩展名
      maxFileSize: 32 * 1024 * 1024, // 限制文件大小为 32MB
    })

    // 监听错误事件
    form.on('error', (err) => {
      if (err.code === 'ENOENT') {
        // 文件大小超出限制
        console.error('File size exceeds the limit')
        event.node.res.statusCode = 400
        event.node.res.end('文件大小超出限制，最大可上传文件大小为 32 MB')
      }
    })

    // 监听文件上传完成事件
    form.on('file', (name, file) => {
      // 这里可以处理上传的文件
      console.log('File uploaded:', name)
    })

    form.parse(event.node.req, async (err, fields, files) => {
      if (err) {
        console.log(err)
        throw new Error('表单解析失败！')
      }
      // console.log(fields)
      // console.log(fields['type']?.[0])
      // console.log(fields.penname?.[0])
      // console.log(files['jsonDocs']?.[0].filepath) // json 文档数据（未解析状态）
      if(!files['jsonDocs']?.[0].filepath) throw new Error('未提供有效文档内容！')
      const data: CreateArticleDto = {
        isParsed: false,
        editorVersion: '',
        authorizeId: authcode._id,
        penname: fields.penname?.[0] || '佚名',
        email: fields.email?.[0] || '',
        blog: fields.blog?.[0] || '',
        msg: fields.msg?.[0] || '',
        type: fields.type?.[0] || undefined,
        title: fields.title?.[0] || '',
        content: files['jsonDocs']?.[0].filepath,
        audio: files['audios']?.[0].filepath || '',
      }
      const article = await articleService.create(data, user._id)
      if(article) {
        event.node.res.statusCode = 200
        event.node.res.end({ editionId: article._id })
      } else {
        event.node.res.statusCode = 400
        event.node.res.end('投稿失败!')
      }
    })
  } catch (error: any) {
    console.log(error)
    event.node.res.statusCode = 400
    event.node.res.end(error.message)
  }
})