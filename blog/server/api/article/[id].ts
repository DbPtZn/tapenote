import { articleService } from "~/services"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if(!id) throw new Error('未提供 uid 参数！')
    const artilce = await articleService.get(id)
    if(artilce?.type === 'course') {
      artilce.audio = artilce.audio ? artilce.audio.split('public')[1] : ''
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