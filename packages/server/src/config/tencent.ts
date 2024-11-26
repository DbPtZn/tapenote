import { registerAs } from '@nestjs/config'

export default registerAs('tencent', () => ({
  secretId: process.env.Tencent_SecretId,
  secretKey: process.env.Tencent_SecretKey,
}))
