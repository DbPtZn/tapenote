import { registerAs } from '@nestjs/config'

export default registerAs('xunfei', () => ({
  secretId: process.env.XUNFEI_SecretId,
  secretKey: process.env.XUNFEI_SecretKey,
}))
