import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => ({
  /** 加密密钥 */
  secret: process.env.JWT_SECRET,
  /** 过期时间 */
  expiresIn: process.env.JWT_EXPIRES_IN,
  /** 刷新时间 */
  refreshIn: Number(process.env.JWT_REFRESH_IN)
}))
