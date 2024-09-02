<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'
import { RoutePathEnum } from '@/enums'
import { FormInst, FormItemRule, FormRules, useMessage } from 'naive-ui'
import { CheckCircleOutlineOutlined, DoNotDisturbAltOutlined } from '@vicons/material'
import axios from 'axios'
import FilingsFooter from './FilingsFooter.vue'
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
  nickname: [
    {
      required: true,
      message: '请输入用户昵称',
      trigger: 'blur'
    },
    {
      message: '姓名长度不能超过18个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 18
      }
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
      message: '密码长度应该在8~24个字符之间',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length >= 8 && value.length <= 24
      }
    }
  ]
}
/** 自动补全邮箱地址 */
const autoCompleteOptions = computed(() => {
  // 可能还需要清理空格（空字符），防止用户输入的时候多了空字符
  return ['@qq.com', '@gmail.com', '@163.com', '@139.com'].map(suffix => {
    const prefix = model.value.account!.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
})
/** 提交注册 */
function handleRegister(e: MouseEvent) {
  e.preventDefault()
  if (isQuerying.value) return message.loading('正在连接服务器...')
  if (!isHostValid.value) return message.error('服务器地址不可用！')
  formRef.value?.validate(errors => {
    if (!errors) {
      userListStore
        .register(
          {
            account: model.value.account,
            password: model.value.password,
            code: model.value.code,
            nickname: model.value.nickname
          },
          model.value.hostname
        )
        .then(res => {
          console.log(res)
          router.push(RoutePathEnum.LOGIN)
        })
        .catch(err => {
          const data = err?.response?.data || '注册失败！'
          console.log(data.message)
          if (data) {
            if (typeof data === 'string') return message.error(data)
            if (Array.isArray(data.message)) return data.message.forEach(msg => message.error(msg))
            message.error('注册失败！')
          }

          // console.log(err)
        })
    } else {
      message.error('表单校验失败！')
      console.log(errors)
    }
  })
}

function handleToLogin() {
  router.push(RoutePathEnum.LOGIN)
}

/** ------------------------------- 邮箱 验证 --------------------------- */

const codeTxt = ref('获取验证码')
function handleSendCode() {
  if (isQuerying.value) return message.loading('正在连接服务器...')
  if (!isHostValid.value) return message.error('服务器地址不可用！')
  // TODO: 发送验证码
  console.log(`${model.value.hostname}/auth/sendCode/${model.value.account}`)
  axios
    .get(`${model.value.hostname}/auth/sendCode/${model.value.account}`)
    .then(res => {
      // message.success('验证码已发送！')
      let count = 60
      const timer = setInterval(() => {
        codeTxt.value = `${--count}秒后重发`
        if (count <= 0) {
          clearInterval(timer)
          codeTxt.value = '获取验证码'
        }
      }, 1000)
    })
    .catch(err => {
      message.error('验证码发送失败！')
    })
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
    <n-card v-if="allowRegister" class="register">
      <n-space vertical>
        <div class="tip">注册</div>
        <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
          <n-form-item path="hostname" label="服务器地址">
            <n-input class="form-input" v-model:value="model.hostname" type="text" placeholder="https://" @blur="handleHostInputBlur">
              <template #suffix>
                <n-icon
                  :color="isHostValid ? '' : 'red'"
                  :component="isHostValid ? CheckCircleOutlineOutlined : DoNotDisturbAltOutlined"
                  :size="18"
                />
              </template>
            </n-input>
          </n-form-item>
          <!-- <n-form-item path="nickname" label="昵称">
          <n-input class="form-input" v-model:value="model.nickname" type="text" placeholder="请输入姓名" />
        </n-form-item> -->
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
        <n-button class="confirm" @click="handleRegister">注册</n-button>
        <div class="footer">
          <span>已有帐号？<a @click="handleToLogin">去登录</a></span>
        </div>
      </n-space>
    </n-card>
    <FilingsFooter />
  </div>
</template>

<style lang="scss" scoped>
.register-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.register {
  position: relative;
  width: 350px;
  height: 580px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
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
    width: 280px;
    height: 40px;
    border: none;
    font-weight: bold;
    letter-spacing: 8px;
    border-radius: 10px;
    cursor: pointer;
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
