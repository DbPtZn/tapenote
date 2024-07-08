import { articleService } from "~/services"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    console.log(id)
    if(!id) throw new Error('缺少 id 参数错误')
    const data = await articleService.findOne(id, event.context.auth.id)
    return data
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      message: '获取专栏数据失败！',
    })
  }
})                