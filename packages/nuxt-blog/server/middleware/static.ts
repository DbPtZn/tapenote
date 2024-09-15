import { defineEventHandler, fromNodeMiddleware } from 'h3'
import serveStatic from 'serve-static'
import { join } from 'path'

const runtimeConfig = useRuntimeConfig()
// console.log(runtimeConfig.staticDir)
const prefix = runtimeConfig.staticPrefix
const staticMiddleware = serveStatic(runtimeConfig.staticDir, {
  maxAge: '7d'
})

// 自定义中间件处理前缀
export default defineEventHandler(
  eventHandler(async event => {
    const { req } = event.node

    // 检查请求路径是否以前缀开头
    if (req.url?.startsWith(prefix)) {
      // 移除前缀

      req.url = req.url.substring(prefix.length)
      // console.log(req.url)
      // 使用 serveStatic 中间件处理请求
      await fromNodeMiddleware(staticMiddleware)(event)
    }
  })
)
