<script lang="ts" setup>
import { VNode, computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'
import {
  FormInst,
  useMessage,
  FormRules,
  FormItemRule,
  useDialog,
  NButton,
  SelectOption,
  SelectGroupOption,
  NFlex,
  DropdownOption,
  DropdownGroupOption
} from 'naive-ui'
import { RoutePathEnum } from '@/enums'
import { h } from 'vue'
import { KeyboardArrowDownRound, KeyboardArrowUpRound } from '@vicons/material'
// import ValidateCode from './ValidateCode.vue'
import LoginInfoCard from './private/LoginInfoCard.vue'
import { Subscription, fromEvent } from '@tanbo/stream'
import { CheckCircleOutlineOutlined, DoNotDisturbAltOutlined } from '@vicons/material'
import FilingsFooter from './FilingsFooter.vue'
import axios from 'axios'
interface ModelType {
  hostname: string
  account: string
  password: string
  code: string
}
const inElectron = !!window.electronAPI
// electron 环境下向主进程询问本地服务的端口号
let localhost = ''
inElectron &&
  window.electronAPI.getPort().then(port => {
    console.log('当前本地服务监听的端口：' + port)
    model.value.hostname = `http://localhost:${port}`
    localhost = `http://localhost:${port}`
  })

const router = useRouter()
const { userListStore, microStore } = useStore()
const message = useMessage()
// const dialog = useDialog()
const tip = import.meta.env.VITE_LOGIN_TIP || ''
const loginMode = ref<'loginByPass' | 'loginByEmail'>('loginByPass')
const formRef = ref<FormInst | null>(null)
const allowRegister = import.meta.env.VITE_VIEW_REGISTER === 'true' // 是否开放注册入口
const model = ref<ModelType>({
  hostname: import.meta.env.VITE_BASE_URL || '',
  account: import.meta.env.VITE_ACCOUNT || '',
  password: import.meta.env.VITE_PASSWORD || '',
  code: ''
})

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
      message: '不能包含 & 符号',
      validator(rule: FormItemRule, value: string) {
        // console.log(value)
        if (value.includes('&')) return false
        return true
      },
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码'
    }
  ],
  code: [
    {
      message: '未填写验证码',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        if (value.length === 0 && loginMode.value === 'loginByEmail') return false
      }
    }
  ]
}
function handleLogin() {
  submit()
}

/** 提交登录表单 */
const submit = () => {
  if (isQuerying.value) return message.loading('正在连接服务器...')
  if (!isHostValid.value) return message.error('服务器地址不可用！')
  const isLoginByEmail = loginMode.value === 'loginByEmail'
  if (!hadSendCode && isLoginByEmail) return message.error('请先获取验证码！')
  formRef.value?.validate(async errors => {
    if (!errors) {
      // 先判断是否已经登录
      const result = userListStore.get(model.value.account, model.value.hostname)
      if (result) {
        message.info('该用户已登录')
        // router.push(RoutePathEnum.HOME)
        return
      }
      // const isAllow = await validateCode()
      // if (!isAllow) return
      userListStore
        .login(
          {
            account: model.value.account,
            password: isLoginByEmail ? ' ' : model.value.password,
            code: isLoginByEmail ? model.value.code : ''
          },
          model.value.hostname
        )
        .then(avatar => {
          /** In Electron */
          window.electronAPI && setLoginStorage(avatar)
          router.push(RoutePathEnum.HOME)
        })
        .catch(err => {
          console.log(err)
          // console.log(err?.response?.data?.message)
          const msg = err?.response?.data?.message
          message.error(msg ? msg : '登录失败！')
        })
    } else {
      console.log(errors)
      message.error('表单校验失败！')
    }
  })
}
const loginRef = ref()
let sub: Subscription
onMounted(() => {
  sub = fromEvent<KeyboardEvent>(loginRef.value, 'keypress').subscribe(ev => {
    // console.log(ev)
    if (ev.key === 'Enter') {
      submit()
    }
  })
})
onUnmounted(() => {
  sub.unsubscribe()
})

// function validateCode() {
//   return new Promise<boolean>((resolve, reject) => {
//     const dia = dialog.create({
//       title: '验证码',
//       content: () =>
//         h(ValidateCode, {
//           onConfirm: result => {
//             dia.destroy()
//             resolve(result)
//           }
//         }),
//       onMaskClick: () => {
//         dia.destroy()
//         resolve(false)
//       }
//     })
//   })
// }

function handleToRegister() {
  router.push(RoutePathEnum.REGISTER)
}

const recordAccount = ref(false)
const recordPassword = ref(false)

function setLoginStorage(avatar?: string) {
  if (recordAccount.value) {
    window.electronAPI.setLoginInfo(`Record:${model.value.account}&${model.value.hostname}`, {
      pwd: recordPassword.value ? model.value.password : '',
      avatar: avatar || ''
    })
  }
}

function handleRecordAccount(value) {
  recordAccount.value = value
  if (recordPassword.value) recordPassword.value = false
}
function handleRecordPassword(value) {
  recordPassword.value = value
  if (!recordAccount.value) recordAccount.value = true
}

const isMenuShow = ref(false)
function handleMenuShow() {
  isMenuShow.value = !isMenuShow.value
  isAutoCompleteOptionsShow.value = false
}

let loginInfoData: Awaited<ReturnType<typeof getLoginInfoData>> = []
const loginData = ref<Awaited<ReturnType<typeof getLoginInfoData>>>([])
const options = ref<(DropdownOption | DropdownGroupOption)[]>([])

onMounted(async () => {
  /** In Electron */
  if (inElectron) {
    loginInfoData = await getLoginInfoData()
    loginData.value = loginInfoData
    options.value = loginInfoData.map(item => {
      return {
        key: item.key,
        label: item.account,
        value: item.account,
        avatar: item.avatar,
        hostname: item.hostname,
        pwd: item.pwd
      }
    })
  }
})

async function getLoginInfoData() {
  const options: Array<{
    key: string
    avatar: string
    account: string
    hostname: string
    pwd: string
  }> = []

  const data = await window.electronAPI.getLoginInfo()
  // 遍历键名，获取对应的值
  data.forEach((item, index, arr) => {
    const option = {
      key: '',
      avatar: '',
      account: '',
      hostname: '',
      pwd: ''
    }
    option.key = item.key
    const prefix = item.key.substring(0, 7)
    const suffix = item.key.substring(7)
    if (prefix === 'Record:') {
      const arr = suffix.split('&')
      const account = arr[0]
      const hostname = arr[1]
      option.account = account
      option.hostname = hostname
      if (item.value) {
        option.pwd = item.value.pwd || ''
        option.avatar = item.value.avatar || ''
      }
      options.push(option)
    }
  })
  // console.log(options)
  return options
}

/** In Electron */
function renderOption(props: { node: VNode; option: DropdownOption | DropdownGroupOption | SelectOption | SelectGroupOption }) {
  const { option } = props
  // if(!inElectron) return model.value.account = account
  return h(LoginInfoCard, {
    avatar: (option.avatar as string) || './avatar03.png',
    account: option.value as string,
    hostname: option.hostname as string,
    onSelected: (account, hostname) => {
      // console.log(account, hostname)
      model.value.account = account
      // 本地登录时，原历史记录的端口可能被占用了, 所以自动替换成默认端口
      if (localhost !== '' && hostname !== localhost && hostname.includes('localhost')) {
        model.value.hostname = localhost
      } else {
        model.value.hostname = hostname
      }
      model.value.password = option.pwd as string
      recordAccount.value = true
      recordPassword.value = !!option.pwd
      isMenuShow.value = false
      isAutoCompleteOptionsShow.value = false
    },
    onClose: (account, hostname) => {
      const key = `Record:${account}&${hostname}`
      // console.log(window.electronAPI.removeLoginInfo)
      window.electronAPI.removeLoginInfo(key).then(result => {
        if (result) {
          options.value.some((item, index, arr) => {
            if (item.key === key) {
              arr.splice(index, 1)
              return true
            }
          })
        }
      })
    }
  })
}

/** ------------------------------- 桌面客户端 --------------------------- */
const autoCompleteOptions = computed(() => {
  if(inElectron) {
    return loginData.value
      .filter(item => {
        if (item.account.startsWith(model.value.account)) {
          return true
        }
      })
      .map(item => {
        return {
          label: item.account,
          value: item.account,
          key: item.key,
          avatar: item.avatar,
          hostname: item.hostname,
          pwd: item.pwd
        }
      })
  }
  return ['@qq.com', '@163.com', '@139.com', '@gmail.com'].map(suffix => {
    const prefix = model.value.account!.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
})
const isAutoCompleteOptionsShow = ref(false)
function handleShow(value: string) {
  return isAutoCompleteOptionsShow.value
}
function handleBlur() {
  isAutoCompleteOptionsShow.value = false
}
function handleUpdate(value: string | null) {
  if (value && value.length > 0) {
    isAutoCompleteOptionsShow.value = true
  } else {
    isAutoCompleteOptionsShow.value = false
  }
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

/** ------------------------------- 邮箱 验证 --------------------------- */
const codeTxt = ref('获取验证码')
let hadSendCode = false // 是否已经发出验证码
function handleSendCode() {
  if (isQuerying.value) return message.loading('正在连接服务器...')
  if (!isHostValid.value) return message.error('服务器地址不可用！')
  // TODO: 发送验证码
  console.log(`${model.value.hostname}/auth/sendCode/${model.value.account}`)
  axios
    .get(`${model.value.hostname}/auth/sendCode/${model.value.account}`)
    .then(res => {
      // message.success('验证码已发送！')
      hadSendCode = true
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
</script>

<template>
  <div ref="loginRef" class="login-container">
    <div class="tip">
      {{ tip }}
    </div>
    <div class="login">
      <n-tabs :value="loginMode" size="large" animated justify-content="space-evenly" @update:value="loginMode = $event">
        <n-tab-pane name="loginByPass" tab="密码登录">
          <n-space style="paddingtop: 18px" vertical>
            <!-- <div class="title">登录</div> -->
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
              <n-form-item path="account" label="账号">
                <n-auto-complete
                  class="form-input"
                  v-model:value="model.account"
                  placeholder="帐号"
                  :get-show="handleShow"
                  :options="autoCompleteOptions"
                  :render-option="inElectron ? renderOption : undefined"
                  @blur="handleBlur"
                  @update:value="handleUpdate"
                  @select="isAutoCompleteOptionsShow = false"
                >
                  <template #suffix>
                    <n-dropdown
                      v-if="inElectron"
                      trigger="click"
                      :show="isMenuShow && options.length > 0"
                      :options="options"
                      :render-option="renderOption"
                      :animated="false"
                      :placement="'bottom-end'"
                      :style="{ marginRight: '-12px', marginTop: '9px' }"
                      :width="280"
                      @clickoutside="isMenuShow = false"
                    >
                      <div class="input-suffix" @click.stop.prevent="handleMenuShow">
                        <n-icon :component="KeyboardArrowUpRound" v-if="isMenuShow" size="18" />
                        <n-icon :component="KeyboardArrowDownRound" v-else size="18" />
                      </div>
                    </n-dropdown>
                  </template>
                </n-auto-complete>
              </n-form-item>
              <n-form-item path="password" label="密码">
                <n-input class="form-input" v-model:value="model.password" type="password" placeholder="密码" clearable />
              </n-form-item>
              <n-flex v-if="inElectron" justify="space-between">
                <n-checkbox v-model:checked="recordAccount" :on-update:checked="handleRecordAccount"> 记住账号 </n-checkbox>
                <n-checkbox :disabled="!inElectron" v-model:checked="recordPassword" :on-update:checked="handleRecordPassword"> 记住密码 </n-checkbox>
              </n-flex>
            </n-form>
            <n-button block class="confirm" @click="handleLogin">&nbsp;登录</n-button>
            <div class="footer">
              <span v-if="allowRegister">没有帐号？<a @click="handleToRegister">去注册</a></span>
            </div>
          </n-space>
        </n-tab-pane>
        <n-tab-pane name="loginByEmail" tab="邮箱登录">
          <n-space style="paddingtop: 18px" vertical>
            <!-- <div class="title">登录</div> -->
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
              <n-form-item path="account" label="账号">
                <n-auto-complete v-model:value="model.account" :options="autoCompleteOptions" placeholder="请输入邮箱" />
              </n-form-item>
              <n-form-item path="code" label="验证码">
                <n-input class="form-input" v-model:value="model.code" :type="'text'" placeholder="验证码">
                  <template #suffix>
                    <n-button :disabled="!isEnableEmailVerify" :size="'small'" @click="handleSendCode">{{ codeTxt }}</n-button>
                  </template>
                </n-input>
              </n-form-item>
              <n-flex v-if="inElectron" justify="space-between">
                <n-checkbox v-model:checked="recordAccount" :on-update:checked="handleRecordAccount"> 记住账号 </n-checkbox>
                <n-checkbox :disabled="!inElectron" v-model:checked="recordPassword" :on-update:checked="handleRecordPassword"> 记住密码 </n-checkbox>
              </n-flex>
            </n-form>
            <n-tooltip :disabled="isEnableEmailVerify" trigger="hover">
              <template #trigger>
                <n-button :disabled="!isEnableEmailVerify" block class="confirm" @click="handleLogin">&nbsp;登录</n-button>
              </template>
              目标服务器不支持邮箱验证码登录
            </n-tooltip>
            <div class="footer">
              <span v-if="allowRegister">没有帐号？<a @click="handleToRegister">去注册</a></span>
            </div>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </div>
    <FilingsFooter />
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.tip {
  position: fixed;
  padding: 0 36px;
  top: 24px;
  margin-top: 24px;
  font-size: 24px;
  font-weight: bold;
}
.bg {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 0;
  left: 0;
  font-size: 128px;
  opacity: 0.1;
}
.svg-code {
  display: flex;
  align-items: center;
}
.code {
  height: 100%;
  display: flex;
  align-items: center;
}
.login {
  position: relative;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
  box-sizing: border-box;
  border-radius: 15px;
  margin: auto;
  z-index: 1;
  .title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin: 15px auto 20px auto;
  }
  .form-input {
    transition: border-bottom 0.5s;
    .input-suffix {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.6;
      &:hover {
        opacity: 1;
      }
    }
  }
  .confirm {
    height: 40px;
    border: none;
    font-weight: bold;
    letter-spacing: 8px;
    border-radius: 10px;
    margin-top: 6px;
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

@media screen and (max-width: 767px) {
  .login {
    max-width: 300px;
  }
}
</style>
<!-- // fetch('/api/user/create', {
  //   method: 'post',
  //   body: JSON.stringify(model.value),
  //   headers: {
  //     'content-type': 'application/json'
  //   }
  // })
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err)) -->
