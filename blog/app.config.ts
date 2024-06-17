/**
 * app.config：在构建时确定的公共令牌，网站配置（如主题变体、标题）以及不敏感的项目配置等
 * 环境变量 ×
 * 响应式 √
 * 类型支持 √
 * 每个请求的配置 √
 * 热模块替换 √
 * 非原始js类型 √
 */

export default defineAppConfig({
  title: 'Hello Nuxt',
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000'
    }
  },
  icon: {
    size: '24px', // default <Icon> size applied
    class: 'icon', // default <Icon> class applied
    mode: 'css', // default <Icon> mode applied
    aliases: {
      'nuxt': 'logos:nuxt-icon',
    }
  }
})
