<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'
import { RoutePathEnum } from '@/enums'
import { FormInst, FormItemRule, FormRules, useMessage } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { useVerificationCode } from './hooks/useVerificationCode'
import axios from 'axios'
import FilingsFooter from '../_common/FilingsFooter.vue'
import { useReCaptchaVerify } from './hooks/useReCaptchaVerify'
interface ModelType {
  hostname: string
  nickname: string
  account: string
  password: string
  code: string
}

// electron 环境下向主进程询问本地服务的端口号
window.electronAPI &&
  window.electronAPI.getPort().then(port => {
    console.log('当前本地服务监听的端口：' + port)
    model.value.hostname = `http://localhost:${port}`
  })
const router = useRouter()
const { userListStore } = useStore()
const formRef = ref<FormInst | null>(null)
const allowRegister = import.meta.env.VITE_VIEW_REGISTER === 'true'
const message = useMessage()

// 服务条款和隐私政策
const terms = import.meta.env.VITE_TERMS_OF_SERVICE_URL || '#'
const privacy = import.meta.env.VITE_PRIVACY_POLICY_URL || '#'
const isAgree = ref(false)

/** 表单数据 */
const model = ref<ModelType>({
  hostname: import.meta.env.VITE_BASE_URL || '',
  account: import.meta.env.VITE_ACCOUNT || '',
  password: import.meta.env.VITE_PASSWORD || '',
  nickname: '',
  code: ''
})
console.log(model.value)
/** 表单规则 */
const rules: FormRules = {
  hostname: [
    {
      required: true,
      message: '请输入服务器主机地址'
    }
  ],
  account: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      message: '密码长度应该在8~32个字符之间',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length >= 8 && value.length <= 32
      }
    }
  ]
}
/** 自动补全邮箱地址 */
const autoCompleteOptions = computed(() => {
  // 可能还需要清理空格（空字符），防止用户输入的时候多了空字符
  return ['@qq.com', '@163.com', '@139.com', '@gmail.com'].map(suffix => {
    const prefix = model.value.account!.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
})

const { getRecaptcha } = useReCaptchaVerify()
/** 提交注册 */
function handleRegister(e: MouseEvent) {
  e.preventDefault()
  if (!isAgree.value) return message.warning('请先同意服务条款和隐私政策')
  if (isQuerying.value) return message.loading('正在连接服务器...')
  if (!isHostValid.value) return message.error('服务器地址不可用！')
  formRef.value?.validate(async errors => {
    if (!errors) {
      const registerMsg = message.loading('正在注册...', { duration: 0 })
      try {
        const captcha = await getRecaptcha()
        await userListStore.register(
          {
            account: model.value.account,
            password: model.value.password,
            code: model.value.code,
            nickname: model.value.nickname,
            captcha: captcha
          },
          model.value.hostname
        )
        registerMsg.destroy()
        message.success('注册成功！')
        router.push(RoutePathEnum.LOGIN)
      } catch (error: any) {
        registerMsg?.destroy()
        const msg = error?.response?.data?.message || '注册失败！'
        console.log(msg)
        if(msg) message.error(typeof msg === 'string' ? msg : JSON.stringify(msg))
        else message.error('注册失败！')
      }
    } else {
      if (Array.isArray(errors)) {
        errors.forEach(error => {
          error.forEach(item => {
            item.message && message.error(item.message)
          })
        })
      }
    }
  })
}

function handleToLogin() {
  router.push(RoutePathEnum.LOGIN)
}

/** ------------------------------- 邮箱 验证 --------------------------- */
const { codeTxt, sendCode } = useVerificationCode()
function handleSendCode() {
  if (isQuerying.value) return message.loading('正在连接服务器...')
  if (!isHostValid.value) return message.error('服务器地址不可用！')
  sendCode(model.value.account, model.value.hostname)
}

/** ------------------------------- 服务器 验证 --------------------------- */
const isQuerying = ref(false)
const isHostValid = ref(false) // 服务器是否有效
const isEnableEmailVerify = ref(false) // 是否开启邮箱验证
onMounted(() => {
  // 默认自动获取焦点
  isQuerying.value = true
  axios
    .get<boolean>(`${model.value.hostname}/hello`)
    .then(res => {
      isEnableEmailVerify.value = res.data
      isHostValid.value = true
    })
    .catch(err => {
      isHostValid.value = false
    })
    .finally(() => {
      isQuerying.value = false
    })
})
function handleHostInputBlur() {
  isQuerying.value = true
  axios
    .get<boolean>(`${model.value.hostname}/hello`)
    .then(res => {
      isEnableEmailVerify.value = res.data
      isHostValid.value = true
    })
    .catch(err => {
      isHostValid.value = false
    })
    .finally(() => {
      isQuerying.value = false
    })
}
</script>

<template>
  <div class="register-container">
    <div v-if="allowRegister" class="register">
      <n-space vertical>
        <div class="tip">注册</div>
        <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
          <n-form-item path="hostname" label="服务器地址">
            <n-input class="form-input" v-model:value="model.hostname" type="text" placeholder="https://" @blur="handleHostInputBlur">
              <template #suffix>
                <Icon
                  :style="{ color: isHostValid ? 'greenyellow' : 'red' }"
                  :icon="isHostValid ? 'material-symbols:check-circle-outline' : 'ic:baseline-do-not-disturb'"
                  height="18"
                />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="account" label="账号 ( 仅支持邮箱注册 )">
            <n-auto-complete v-model:value="model.account" :options="autoCompleteOptions" placeholder="请输入邮箱" />
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input class="form-input" v-model:value="model.password" type="password" placeholder="密码" :show-password-on="'click'" />
          </n-form-item>
          <n-form-item v-if="isEnableEmailVerify" path="code" label="验证码">
            <n-input class="form-input" v-model:value="model.code" :type="'text'" placeholder="验证码">
              <template #suffix>
                <n-button :size="'small'" @click="handleSendCode">{{ codeTxt }}</n-button>
              </template>
            </n-input>
          </n-form-item>
        </n-form>
        <!-- 服务条款和隐私政策 -->
        <div class="aggree">
          <n-checkbox v-model:checked="isAgree" size="small">
            <span>同意</span>
            <span style="margin: 0 3px">笔记映画</span>
            <a :href="terms" target="_blank">服务条款</a>
            <span>和</span>
            <a :href="privacy" target="_blank">隐私政策</a>
          </n-checkbox>
        </div>
        <n-button block class="confirm" @click="handleRegister">&nbsp;注册</n-button>
        
        <div class="footer">
          <span>已有帐号？<a @click="handleToLogin">去登录</a></span>
        </div>
      </n-space>
    </div>
    <FilingsFooter />
  </div>
</template>

<style lang="scss" scoped>
.register-container {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.register {
  position: relative;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
  box-sizing: border-box;
  border-radius: 15px;
  padding: 0 24px;
  margin: auto;
  z-index: 1;
  .tip {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin: 25px auto 30px auto;
  }
  .confirm {
    border: none;
    font-weight: bold;
    letter-spacing: 8px;
    border-radius: 10px;
    cursor: pointer;
  }
}
.aggree {
  display: flex;
  justify-content: center;
  :deep(.n-checkbox) {
    margin: 0;
    padding: 0;
  }
  a {
    color: #999;
    // margin: 0 5px;
  }
}
.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  a {
    cursor: pointer;
    color: plum;
  }
}
</style>
