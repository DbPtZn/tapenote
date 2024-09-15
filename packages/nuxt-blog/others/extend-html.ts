// 该插件注册一个钩子函数。 render:html 钩子函数的回调函数允许你在将 HTML 发送到客户端之前对其进行修改
// export default defineNitroPlugin((nitroApp) => {
//   nitroApp.hooks.hook('render:html', (html, { event }) => { 
//     // 这将是 HTML 模板的对象表示形式。
//     console.log(html)
//     html.head.push(`<meta name="description" content="My custom description" />`)
//   })
//   // 你也可以在这里拦截响应。
//   nitroApp.hooks.hook('render:response', (response, { event }) => { console.log(response) })
// })

export default {}