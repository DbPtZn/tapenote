import { registerAs } from '@nestjs/config'
export default registerAs('common', () => ({
  openValidateCode: process.env.V_CODE_OPEN === 'true' // 是否开启验证码
}))
