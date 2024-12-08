import { registerAs } from '@nestjs/config'

export default registerAs('cache', () => ({
  // redis
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  database: process.env.REDIS_DB,
  pass: process.env.REDIS_PASS,

  // cache
  ttl: Number(process.env.CACHE_TTL),
  max: Number(process.env.CACHE_MAX_SIZE)
}))
