import { registerAs } from '@nestjs/config'
import { join, basename } from 'path'

export default registerAs('common', () => ({
  openValidateCode: process.env.V_CODE_OPEN === 'true', // 是否开启验证码
  systemDir: process.env.SYSTEM_DIR || '', // 系统目录
  appDir: process.env.APP_DIR || '',  // 应用目录
  publicDir: process.env.PUBLIC_DIR || '', // 公共目录
  staticPrefix: process.env.STATIC_RESOURCE_PREFIX || `${process.env.PUBLIC_DIR}`,
  privateDir: process.env.PRIVATE_DIR || '', // 私有目录
  logDir: process.env.LOG_DIR || '', // 日志目录
  logOpen: process.env.LOG_OPEN === 'true', // 是否开启系统日志


  // /** 本地公开静态资源地址 */
  // localFullPublicDir: path.join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.PUBLIC_DIR),
  // /** 本地私有静态资源地址 */
  // localFullPrivateDir: path.join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.PRIVATE_DIR),
  // /** 本地临时静态资源地址 */
  // localFullTempDir: path.join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.TEMP_DIR),
  // /** 本地日志地址 */
  // localFullLogDir: path.join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.LOG_DIR),

  // 基于环境自动补全目录路径
  /** 本地公开静态资源地址 */
  fullPublicDir: join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.PUBLIC_DIR),
  /** 本地私有静态资源地址 */
  fullPrivateDir: join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.PRIVATE_DIR),
  /** 本地临时静态资源地址 */
  fullTempDir: join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.TEMP_DIR),
  /** 本地日志地址 */
  fullLogDir: join(process.env.SYSTEM_DIR ? process.env.SYSTEM_DIR : process.cwd(), process.env.APP_DIR, process.env.LOG_DIR),

  // getResponsePath(path: string, dirname: string) {
  //   return process.env.ENABLE_COS === 'true' ? path :`${process.env.STATIC_RESOURCE_PREFIX}/${dirname}/${basename(path)}`
  // },

  // 对象存储相关配置
  enableCOS: process.env.ENABLE_COS === 'true',
  proxyDomain: process.env.COS_PROXY_DOMAIN,
  secretId: process.env.SecretId,
  secretKey: process.env.SecretKey,
  bucket: process.env.Bucket,
  region:process.env.Region,
}))
