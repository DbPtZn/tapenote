export * from './diff'
import { isDiff } from './diff'
import { dateFormat } from './date-format'
import { durationFormat } from './durationFormatter'
import { generateRandomString } from './randomstring'
const utils = {
  /** 格式化日期 */
  dateFormat,
  /** 格式化时长 */
  durationFormat,
  /** 脏值判断 */
  isDiff,
  randomString: generateRandomString
}
export default utils