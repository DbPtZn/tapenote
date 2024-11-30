import { onMounted, onUnmounted } from 'vue'
import { useReCaptcha } from 'vue-recaptcha-v3'

/**
 * 谷歌行为验证
 */
export function useReCaptchaVerify() {
  const isReCaptchaOpen = import.meta.env.VITE_GOOGLE_ACTION_CAPTCHA_OPEN === 'true'
  const iReCaptcha = isReCaptchaOpen ? useReCaptcha() : undefined

  onMounted(() => {
    isReCaptchaOpen && iReCaptcha?.instance.value?.showBadge()
  })
  onUnmounted(() => {
    isReCaptchaOpen && iReCaptcha?.instance.value?.hideBadge()
  })

  async function getRecaptcha() {
    if (!isReCaptchaOpen) return ''
    await iReCaptcha?.recaptchaLoaded() // 确保reCAPTCHA已加载
    const token = await iReCaptcha?.executeRecaptcha('auth') || ''
    return token
  }

  return { getRecaptcha }
}
