import { articleService } from "~/services"

export default defineEventHandler(async (event) => {
  try {
    const uid = getRouterParam(event, 'uid')
    if(!uid) throw new Error('未提供 uid 参数！')
    const data = await articleService.getAll(uid)
    // console.log(uid)
    return data
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      message: '获取文章列表数据失败！',
    })
  }
})                