/** @desc 正则-手机号码 */
export const Phone = /^1[3-9]\d{9}$/

/** @desc 正则-邮箱 */
export const Email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

/** @desc 正则-6位数字验证码正则 */
export const Code_6 = /^\d{6}$/

/** @desc 正则-4位数字验证码正则 */
export const Code_4 = /^\d{4}$/

/** @desc 正则-16进颜色值 #333 #8c8c8c */
export const ColorRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/

/** @desc 正则-只能是中文 */
export const OnlyCh = /^[\u4e00-\u9fa5]+$/gi

/** @desc 正则-只能是英文 */
export const OnlyEn = /^[a-zA-Z]*$/

/** @desc 登录注册-密码 6-16位大小写字母、数字的js正则 */
export const Password = /^[a-zA-Z0-9]{6,16}$/

