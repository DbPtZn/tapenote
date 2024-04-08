import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_DATE_BASE, // // host node18+ 的 localhost 默认 ipv6 可能会导致数据库连接出现问题
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  retryDelay: parseInt(process.env.DB_RETRY_DELAY, 10),
  retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS, 10),
  autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === 'true'
}))
