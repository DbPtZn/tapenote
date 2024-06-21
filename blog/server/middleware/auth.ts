import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
    console.log("auth middleware")
    //获取token
    // let token = getHeader(event)
    const token = getCookie(event, 'accessToken')
    // console.log('token', token)
    //判断是否有token
    if (token) {
    //去掉Bearer
        // token = token.replace("Bearer ", "")
        // 我们之前登录写的秘钥
        const runtime = useRuntimeConfig()
        const secret = runtime.jwtSecret
        try {
            // jwt验证
            var decoded = jwt.verify(token, secret);
            console.log('decoded:')
            console.log(decoded) 
            // 通过上下文判断是否有uid
            // event.context.auth = {}

        } catch (err) {
            // err
            console.log("jwt decode error", err)
        }

    }

})