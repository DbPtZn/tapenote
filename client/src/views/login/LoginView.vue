<script lang="ts" setup>
import { VNode, computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'
import { FormInst, useMessage, FormRules, FormItemRule, useDialog, NButton, SelectOption, SelectGroupOption, NText, NFlex, NAvatar } from 'naive-ui'
import { RoutePathEnum } from '@/enums'
import { h } from 'vue'
import { KeyboardArrowDownRound, KeyboardArrowUpRound } from '@vicons/material'
import ValidateCode from './ValidateCode.vue'
import LoginInfoCard from './private/LoginInfoCard.vue' 
interface ModelType {
  hostname: string
  account: string
  password: string
}

// electron 环境下向主进程询问本地服务的端口号
window.electronAPI &&
  window.electronAPI.getPort().then(port => {
    console.log('当前本地服务监听的端口：' + port)
    model.value.hostname = `http://localhost:${port}`
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
  // hostname: import.meta.env.VITE_BASE_URL || '',
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
      // const result = userStore.queryCache(model.value.account, model.value.hostname)
      setLoginStorage()
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
        .then(res => {
          router.push(RoutePathEnum.HOME)
        })
        .catch(err => {
          message.error('登录失败！')
        })
    } else {
      message.error('表单校验失败！')
      console.log(errors)
    }
  })
}

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
const rememberAccount = ref(false)
const rememberPassword = ref(false)

function setLoginStorage() {
  console.log(rememberAccount.value)
  if (rememberAccount.value) {
    localStorage.setItem(`Remember:${model.value.account}&${model.value.hostname}`, rememberPassword.value ? model.value.password : '')
  }
}

function handleRememberAccount(value) {
  rememberAccount.value = value
  if (rememberPassword.value) rememberPassword.value = false
}
function handleRememberPassword(value) {
  rememberPassword.value = value
  if (!rememberAccount.value) rememberAccount.value = true
}
function handleSelectUpdate(value) {
  console.log(value)
  model.value.account = value
}

const isMenuShow = ref(false)
function handleMenuShow() {
  isMenuShow.value = !isMenuShow.value
}

let searchValue = ''
function handleSearch(value) {
  console.log(value)
  searchValue = value
}
function handleBlur() {
  model.value.account = searchValue
}
function handleFocus() {
  model.value.account = searchValue
}

const options = computed(() => {
  return getLoginInfoData().map(item => {
    return {
      key: item.key,
      label: item.account,
      value: item.account,
      hostname: item.hostname,
      pwd: item.pwd
    }
  })
})

function getLoginInfoData() {
  const option = {
    key: '',
    // label: '',
    account: '',
    hostname: '',
    pwd: ''
  }
  const options: Array<typeof option> = []
  // 获取localStorage中的所有键名
  const keys = Object.keys(localStorage)

  // 遍历键名，获取对应的值
  keys.forEach(function (key) {
    // console.log(key + ': ' + localStorage.getItem(key))
    option.key = key
    const prefix = key.substring(0, 9)
    const suffix = key.substring(9)
    // option.label = suffix
    console.log(prefix)
    console.log(prefix === 'Remember:')
    if (prefix === 'Remember:') {
      const arr = suffix.split('&')
      const account = arr[0]
      const hostname = arr[1]
      option.account = account
      option.hostname = hostname
      option.pwd = localStorage.getItem(key) || ''
      options.push(option)
    }
  })
  console.log(options)
  return options
}
function handleFallback(value: string | number) {
  console.log(value)
}

function renderOption(info: { node: VNode; option: SelectOption | SelectGroupOption; selected: boolean }) {
  const { node, option, selected } = info
  console.log(option)
  return h(LoginInfoCard, { 
    avatar: 'avatar03.png', 
    account: option.value as string,
    hostname: option.hostname as string,
    onSelected: (account, hostname) => {
      console.log('sed')
      console.log(account, hostname)
      model.value.account = account
      model.value.hostname = hostname
      console.log(model.value)
      isMenuShow.value = false
    },
    onClose: (account, hostname) => {
      console.log('close')
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="tip">
      {{ tip }}
    </div>
    <n-card class="login">
      <n-space vertical>
        <div class="title">登录</div>
        <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
          <n-form-item path="hostname" label="服务器地址">
            <n-input class="form-input" v-model:value="model.hostname" type="text" placeholder="https://" />
          </n-form-item>
          <n-form-item path="account" label="账号">
            <n-input class="form-input" v-model:value="model.account" placeholder="帐号">
              <template #suffix>
                <div class="input-suffix" @click="handleMenuShow">
                  <n-icon :component="KeyboardArrowUpRound" v-if="isMenuShow" size="18" />
                  <n-icon :component="KeyboardArrowDownRound" v-else size="18" />
                </div>
              </template>
            </n-input>
            <!-- <n-select
              :value="model.account"
              :show="isMenuShow"
              @update:value="handleSelectUpdate"
              :options="options"
              filterable
              :render-option="renderOption"
              @search="handleSearch"
              @blur="handleBlur"
              @focus="handleFocus"
            >
              <template #arrow>
                <div @click="handleMenuShow">
                  <transition name="slide-left">
                    <KeyboardArrowUpRound v-if="isMenuShow" />
                    <KeyboardArrowDownRound v-else />
                  </transition>
                </div>
              </template>
            </n-select> -->
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input class="form-input" v-model:value="model.password" type="password" placeholder="密码" />
          </n-form-item>
          <n-flex justify="space-between">
            <n-checkbox v-model:checked="rememberAccount" :on-update:checked="handleRememberAccount"> 记住账号 </n-checkbox>
            <n-checkbox v-model:checked="rememberPassword" :on-update:checked="handleRememberPassword"> 记住密码 </n-checkbox>
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
