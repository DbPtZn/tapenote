import jwt from 'jsonwebtoken'

export default defineEventHandler(async event => {
  console.log('auth middleware')
  // 获取token
  // let token = getHeader(event)
  let token = getCookie(event, 'Authorization')
  // console.log('token', token)
  //判断是否有token
  if (token) {
    // 去掉 Bearer
    token = token.replace("Bearer ", "")
    // 我们之前登录写的秘钥
    const runtime = useRuntimeConfig()
    const secret = runtime.jwtSecret
    try {
      // jwt验证
      const decoded = jwt.verify(token, secret)
      // console.log('decoded:')
      // console.log(decoded)
      // 通过上下文判断是否有uid
      if (typeof decoded === 'object') {
        event.context.auth = {
          id: decoded.id,
          account: decoded.account,
          UID: decoded.UID
        }
      }
    } catch (err) {
      // err
      console.log('jwt decode error', err)
    }
  }
})
