import { registerAs } from '@nestjs/config'
import { join } from 'path'

export default registerAs('common', () => {
  // console.log(process.env.SYSTEM_DIR)
  // console.log(process.cwd())
  // console.log(process.env.APP_DIR)
  // console.log(join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.PUBLIC_DIR))
  return {
    openValidateCode: process.env.V_CODE_OPEN === 'true', // 是否开启验证码
    systemDir: process.env.SYSTEM_DIR || '', // 系统目录
    appDir: process.env.APP_DIR || '',  // 应用目录
    publicDir: process.env.PUBLIC_DIR || '', // 公共目录
    privateDir: process.env.PRIVATE_DIR || '', // 私有目录
    logDir: process.env.LOG_DIR || '', // 日志目录
    logOpen: process.env.LOG_OPEN === 'true', // 是否开启系统日志
  
    // 本地静态资源请求前缀 (保留，请求一些临时资源时可能需要该选项)
    staticResourcePrefix: process.env.STATIC_RESOURCE_PREFIX || process.env.PUBLIC_DIR,
    // 本地资源请求前缀（启动 cos 时自动将该选项设置为空字符串）
    staticPrefix: process.env.ENABLE_COS === 'true' ? '' : (process.env.STATIC_RESOURCE_PREFIX || process.env.PUBLIC_DIR),
  
    // 基于环境自动补全目录路径
    /** 本地公开静态资源地址 */
    fullPublicDir: join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.PUBLIC_DIR),
    /** 本地私有静态资源地址 */
    fullPrivateDir: join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.PRIVATE_DIR),
    /** 本地临时静态资源地址 */
    fullTempDir: join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.TEMP_DIR),
    /** 本地日志地址 */
    fullLogDir: join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.LOG_DIR),
  
    // 对象存储相关配置
    enableCOS: process.env.ENABLE_COS === 'true',
    proxyDomain: process.env.COS_PROXY_DOMAIN,
    secretId: process.env.SecretId,
    secretKey: process.env.SecretKey,
    bucket: process.env.Bucket,
    region:process.env.Region,

    // SSO 单点登录相关配置
    ssoEnable: process.env.SSO_ENABLE === 'true',
    ssoDomain: process.env.SSO_DOMAIN,
    // ssoClientId: process.env.SSO_CLIENT_ID,
    // ssoClientSecret: process.env.SSO_CLIENT_SECRET,
    // ssoRedirectUri: process.env.SSO_REDIRECT_URI,
    // ssoLogoutUri: process.env.SSO_LOGOUT_URI,
    // ssoTokenUri: process.env.SSO_TOKEN_URI,
  }
})
