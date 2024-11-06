import { VIP } from "src/enum"

/** 是不是付费 vip */
export function isPaidVip(vip: VIP) {
  return [VIP.GOLD, VIP.SILVER].includes(vip)
}