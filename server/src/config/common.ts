import { registerAs } from '@nestjs/config'
export default registerAs('common', () => ({
  openValidateCode: process.env.V_CODE_OPEN === 'true', // 是否开启验证码
  appDir: process.env.APP_DIR,
  userDir: process.env.USER_DIR || '', // 用户目录
  publicDir: process.env.PUBLIC_DIR || '', // 公共目录
  staticPrefix: process.env.STATIC_RESOURCE_PREFIX || `${process.env.PUBLIC_DIR}`,
  privateDir: process.env.PRIVATE_DIR || '', // 私有目录
  logDir: process.env.LOG_DIR || '', // 日志目录
  logOpen: process.env.LOG_OPEN === 'true' // 是否开启系统日志
}))
