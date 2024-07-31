<script lang="ts" setup>
import { RendererElement, RendererNode, VNode, computed, onMounted, onUnmounted, ref } from 'vue'
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
  NText,
  NFlex,
  NAvatar,
  DropdownOption,
  DropdownGroupOption
} from 'naive-ui'
import { RoutePathEnum } from '@/enums'
import { h } from 'vue'
import { KeyboardArrowDownRound, KeyboardArrowUpRound } from '@vicons/material'
import ValidateCode from './ValidateCode.vue'
import LoginInfoCard from './private/LoginInfoCard.vue'
import { Subscription, fromEvent } from '@tanbo/stream'
interface ModelType {
  hostname: string
  account: string
  password: string
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
const { userListStore } = useStore()
const message = useMessage()
const dialog = useDialog()
// const props = defineProps<{
//   default?: {
//     hostname: string
//     account: string
//     password: string
//   }
// }>()
const tip = import.meta.env.VITE_LOGIN_TIP || ''
const formRef = ref<FormInst | null>(null)
const allowRegister = import.meta.env.VITE_VIEW_REGISTER === 'true' // 是否开放注册入口
const model = ref<ModelType>({
  hostname: import.meta.env.VITE_BASE_URL || '',
  account: import.meta.env.VITE_ACCOUNT || '',
  password: import.meta.env.VITE_PASSWORD || ''
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
  ]
}
function handleLogin() {
  submit()
}

const submit = () => {
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
            password: model.value.password
          },
          model.value.hostname
        )
        .then(avatar => {
          /** In Electron */
          window.electronAPI && setLoginStorage(avatar)
          router.push(RoutePathEnum.HOME)
        })
        .catch(err => {
          message.error('登录失败！')
        })
    } else {
      message.error('表单校验失败！')
      // console.log(errors)
    }
  })
}
const loginRef = ref()
let sub: Subscription
onMounted(() => {
  sub = fromEvent<KeyboardEvent>(loginRef.value, 'keypress').subscribe(ev => {
    // console.log(ev)
    if(ev.key === "Enter") {
      submit()
    }
  })
})
onUnmounted(() => {
  sub.unsubscribe()
})

function validateCode() {
  return new Promise<boolean>((resolve, reject) => {
    const dia = dialog.create({
      title: '验证码',
      content: () =>
        h(ValidateCode, {
          onConfirm: result => {
            dia.destroy()
            resolve(result)
          }
        }),
      onMaskClick: () => {
        dia.destroy()
        resolve(false)
      }
    })
  })
}

function handleToRegister() {
  router.push(RoutePathEnum.REGISTER)
}


const recordAccount = ref(false)
const recordPassword = ref(false)

function setLoginStorage(avatar?: string) {
  if (recordAccount.value) {
    window.electronAPI.setLoginInfo(`Record:${model.value.account}&${model.value.hostname}`, { pwd: recordPassword.value ? model.value.password : '', avatar: avatar || '' })
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
      if(item.value) {
        option.pwd = item.value.pwd || ''
        option.avatar = item.value.avatar || ''
      }
      options.push(option)
    }
  })
  // console.log(options)
  return options
}

function renderOption(props: { node: VNode; option: DropdownOption | DropdownGroupOption | SelectOption | SelectGroupOption }) {
  const { option } = props
  return h(LoginInfoCard, {
    avatar: option.avatar as string || './avatar03.png',
    account: option.value as string,
    hostname: option.hostname as string,
    onSelected: (account, hostname) => {
      // console.log(account, hostname)
      model.value.account = account
      // 本地登录时，原历史记录的端口可能被占用了, 所以自动替换成默认端口
      if(localhost !== '' && hostname !== localhost && hostname.includes('localhost')) {
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
        if(result) {
          options.value.some((item, index, arr) => {
            if(item.key === key) {
              arr.splice(index, 1)
              return true
            }
          })
        }
      })
    }
  })
}

const autoCompleteOptions = computed(() => {
  return loginData.value.filter(item => {
    if(item.account.startsWith(model.value.account)) {
      return true
    }
  }).map(item => {
    return {
      label: item.account,
      value: item.account,
      key: item.key,
      avatar: item.avatar,
      hostname: item.hostname,
      pwd: item.pwd
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
  if(value && value.length > 0) {
    isAutoCompleteOptionsShow.value = true
  } else {
    isAutoCompleteOptionsShow.value = false
  }
}
</script>

<template>
  <div ref="loginRef" class="login-container">
    <div class="tip">
      {{ tip }}
    </div>
    <n-card class="login">
      <n-space vertical>
        <div class="title">登录</div>
        <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
          <n-form-item path="hostname" label="服务器地址">
            <n-input class="form-input" v-model:value="model.hostname" type="text" placeholder="https://" clearable />
          </n-form-item>
          <n-form-item path="account" label="账号">
            <n-auto-complete
              class="form-input"
              v-model:value="model.account"
              placeholder="帐号"
              :get-show="handleShow"
              :options="autoCompleteOptions"
              :render-option="renderOption"
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
            <!-- <n-input class="form-input" v-model:value="model.account" placeholder="帐号">
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
                >
                  <div class="input-suffix" @click="handleMenuShow">
                    <n-icon :component="KeyboardArrowUpRound" v-if="isMenuShow" size="18" />
                    <n-icon :component="KeyboardArrowDownRound" v-else size="18" />
                  </div>
                </n-dropdown>
              </template>
            </n-input> -->
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input class="form-input" v-model:value="model.password" type="password" placeholder="密码" clearable/>
          </n-form-item>
          <n-flex v-if="inElectron" justify="space-between">
            <n-checkbox v-model:checked="recordAccount" :on-update:checked="handleRecordAccount"> 记住账号 </n-checkbox>
            <n-checkbox :disabled="!inElectron" v-model:checked="recordPassword" :on-update:checked="handleRecordPassword"> 记住密码 </n-checkbox>
          </n-flex>
        </n-form>
        <n-button class="confirm" @click="handleLogin">登录</n-button>
        <div class="footer">
          <span v-if="allowRegister">没有帐号？<a @click="handleToRegister">去注册</a></span>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tip {
  position: fixed;
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
  width: 350px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
    width: 280px;
    height: 40px;
    border: none;
    color: #ffffff;
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
