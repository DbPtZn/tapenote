import { Request } from 'express'
export const getRealIp = (req: Request): string => {
  const result = req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip'] || req?.socket?.remoteAddress || req.ip
  return Array.isArray(result) ? result[0] : result
}
