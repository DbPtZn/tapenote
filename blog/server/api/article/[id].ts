import { articleService } from "~/server/services"
const runtimeConfig = useRuntimeConfig()
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if(!id) throw new Error('未提供 uid 参数！')
    const artilce = await articleService.get(id)
    if(artilce?.type === 'course') {
      artilce.audio = artilce.audio ? runtimeConfig.staticPrefix + artilce.audio.split(runtimeConfig.staticDir)[1] : ''
    }
    // console.log(uid)
    return artilce
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      message: '获取文章列表数据失败！',
    })
  }
})                