import axios from "axios"
import { useMessage } from "naive-ui"
import { ref } from "vue"


export function useVerificationCode() {
  const codeTxt = ref('获取验证码')
  const message = useMessage()
  function sendCode(account: string, hostname: string) {
    if (codeTxt.value !== '获取验证码') return
    let count = 60
    codeTxt.value = `${count}秒后重发`
    const timer = setInterval(() => {
      codeTxt.value = `${--count}秒后重发`
      if (count <= 0) {
        clearInterval(timer)
        codeTxt.value = '获取验证码'
      }
    }, 1000)
    axios
      .get(`${hostname}/auth/sendCode/${account}`)
      .catch(err => {
        console.log(err)
        message.error('验证码发送失败！')
        if(err?.response?.data &&  typeof err?.response?.data === 'string') {
          message.error(err?.response?.data)
        }
        clearInterval(timer)
        codeTxt.value = '获取验证码'
      })
  }
  return {
    codeTxt,
    sendCode
  }
}