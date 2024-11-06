import { VIP } from '@/enums'

/** 是不是付费 vip */
export function isPaidVip(vip: VIP) {
  return [VIP.GOLD, VIP.SILVER].includes(vip)
}
