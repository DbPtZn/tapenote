import { registerAs } from '@nestjs/config'
export default registerAs('common', () => ({
  openValidateCode: process.env.V_CODE_OPEN === 'true', // 是否开启验证码
  userDir: process.env.USER_DIR || '/assets', // 用户目录
  publicDir: process.env.PUBLIC_DIR || '/public', // 公共目录
  staticPrefix: process.env.STATIC_RESOURCE_PREFIX || `${process.env.PUBLIC_DIR}`,
  privateDir: process.env.PRIVATE_DIR || '/private', // 私有目录
  logDir: process.env.LOG_DIR || '/logs', // 日志目录
  logOpen: process.env.LOG_OPEN === 'true' // 是否开启系统日志
}))
