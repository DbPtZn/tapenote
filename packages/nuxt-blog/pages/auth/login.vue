<script lang="ts" setup>
import { useMessage, useThemeVars } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import { FormRules, FormItemRule } from 'naive-ui'
interface ModelType {
  account: string
  password: string
}
const router = useRouter()
const message = useMessage()
const themeVars = useThemeVars()
const formRef = ref()
const model = ref<ModelType>({
  account: '261849747@qq.com',
  password: 'dbx5201314',
})
const rules: any = {
  account: [
    {
      required: true,
      message: '不能包含 & 符号',
      validator(rule: any, value: string) {
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
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      // 先判断是否已经登录
      try {
        const accessToken = await $fetch('/api/auth/login', {
          method: 'post',
          body: {
            account: model.value.account,
            password: model.value.password
          }
        })
        if (!accessToken) {
          message.error('账号或密码错误！')
          return
        }
        console.log(accessToken)
        const accessTokenCookie = useCookie('Authorization',{ maxAge: 60*60*24 })
        accessTokenCookie.value = `Bearer ${accessToken}`
        // localStorage.setItem('accessToken', accessToken)
        router.push('/manage')
      } catch (error) {
        console.log(error)
        message.error('登录失败！')
      }
   
      // userStore.login({
      //   account: model.value.account,
      //   password: model.value.password,
      // }, model.value.hostname).then((res) => {
        
      //   message.success('登录成功')
      // }).catch(err => {
      //   console.log(err)
      //   message.error('登录失败！')
      // })
    } else {
      message.error('表单校验失败！')
      console.log(errors)
    }
  })
}

function handleToRegister() {
  router.push('./register')
}
</script>

<template>
  <div class="login">
    <div class="wrapper">
      <div class="tip">欢迎登录</div>
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <n-form-item path="account" label="账号">
          <n-input class="form-input" v-model:value="model.account" type="text" placeholder="帐号" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input class="form-input" v-model:value="model.password" type="password" placeholder="密码" />
        </n-form-item>
      </n-form>
      <n-button block class="confirm" @click="handleLogin">登录</n-button>
      <div class="footer">
        <span>没有帐号？<a @click="handleToRegister">去注册</a></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  height: 100%;
  display: flex;
  align-items: center;
  color: v-bind('themeVars.textColor1');
  background-color: v-bind('themeVars.cardColor');
  .wrapper {
    width: 100%;
    max-width: 450px;
    padding: 0 24px;
    margin: 0 auto;
    margin-bottom: 64px;
  }
  .tip {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 26px;
    margin: 15px auto 20px auto;
  }
  .form-input {
    // width: 280px;
    transition: border-bottom 0.5s;
  }
  .confirm {
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
  margin-top: 24px;
  a {
    cursor: pointer;
    color: plum;
  }
}
</style>
