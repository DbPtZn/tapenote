<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'
import { FormInst, useMessage, FormRules, FormItemRule, useDialog, NButton } from 'naive-ui'
import { RoutePathEnum } from '@/enums'
import { h } from 'vue'
import ValidateCode from './ValidateCode.vue'
interface ModelType {
  hostname: string
  account: string
  password: string
}
const router = useRouter()
const { userListStore } = useStore()
const message = useMessage()
const dialog = useDialog()
const props = defineProps<{
  default?: {
    hostname: string
    account: string
    password: string
  }
}>()
const tip = import.meta.env.VITE_LOGIN_TIP || ''
const formRef = ref<FormInst | null>(null)
const allowRegister = import.meta.env.VITE_VIEW_REGISTER === 'true' // 是否开放注册入口
const model = ref<ModelType>({
  hostname: import.meta.env.VITE_BASE_URL || '',
  account: import.meta.env.VITE_ACCOUNT || '',
  password: import.meta.env.VITE_PASSWORD || '',
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
      const result = userListStore.get(model.value.account, model.value.hostname)
      if (result) {
        message.info('该用户已登录')
        // shell.useUserPanel()
        // router.push(RoutePathEnum.HOME)
        return
      }
      // const isAllow = await validateCode()
      // if (!isAllow) return
      userListStore.login({
        account: model.value.account,
        password: model.value.password,
      }, model.value.hostname).then((res) => {
        // shell.useUserPanel()
        router.push(RoutePathEnum.HOME)
      }).catch(err => {
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
      content: () => h(ValidateCode, {
        onConfirm: (result) => {
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
</script>

<template>
  <div class="login-container">
    <div class="tip">
      {{tip}}
    </div>
    <n-card class="login">
      <n-space vertical>
        <div class="title">登录</div>
        <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
          <n-form-item path="hostname" label="服务器地址">
            <n-input class="form-input" v-model:value="model.hostname" type="text" placeholder="https://" />
          </n-form-item>
          <n-form-item path="account" label="账号">
            <n-input class="form-input" v-model:value="model.account" type="text" placeholder="帐号" />
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input class="form-input" v-model:value="model.password" type="password" placeholder="密码" />
          </n-form-item>
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
    // width: 280px;
    transition: border-bottom 0.5s;
  }
  .confirm {
    width: 280px;
    height: 40px;
    border: none;
    color: #ffffff;
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
<!-- // fetch('/api/user/create', {
  //   method: 'post',
  //   body: JSON.stringify(model.value),
  //   headers: {
  //     'content-type': 'application/json'
  //   }
  // })
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err)) -->
