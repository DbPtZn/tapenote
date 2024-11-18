import { registerAs } from '@nestjs/config'

export default registerAs('ali', () => ({
  appKey: process.env.ALI_APP_KEY,
  secretId: process.env.ALI_SecretId,
  secretKey: process.env.ALI_SecretKey,
}))
