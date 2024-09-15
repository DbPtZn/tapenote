<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { NButton, NSpace, useMessage } from 'naive-ui'
import type { DataTableColumns, FormInst, FormItemRule, FormRules, UploadFileInfo } from 'naive-ui'
import { Main, Header } from '@/components'
import useStore from '@/store'
import { onMounted } from 'vue'
import axios from 'axios'
interface ModelType {
  pwd: string
  code: string
}
const message = useMessage()
const { userStore } = useStore()
/** 表单数据 */
const model = ref<ModelType>({
  pwd: '',
  code: ''
})
/** 表单规则 */
const rules: FormRules = {
  pwd: [
    {
      required: true,
      message: '新密码不能为空',
      trigger: 'blur'
    },
    {
      message: '密码长度应该在8~24个字符之间',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length >= 8 && value.length <= 24
      }
    }
  ],
  code: [
    {
      required: true,
      message: '验证码不能为空',
      trigger: 'blur'
    }
  ]
}

const formRef = ref<FormInst | null>(null)
/** 提交 */
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      const dto = {
        oldPwd: '',
        newPwd: model.value.pwd,
        code: model.value.code
      }
      userStore.updatePassword(dto).then(() => {
        model.value = {
          pwd: '',
          code: ''
        }
        message.success('修改成功')
      }).catch(err => {
        console.log(err)
        message.error('密码修改失败')
      })
    } else {
      console.log(errors)
    }
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
    .get<boolean>(`${userStore.hostname}/hello`)
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

/** ------------------------------- 邮箱 验证 --------------------------- */
const codeTxt = ref('获取验证码')
let hadSendCode = false // 是否已经发出验证码
function handleSendCode() {
  if (isQuerying.value) return message.loading('正在连接服务器...')
  if (!isHostValid.value) return message.error('服务器地址不可用！')
  // TODO: 发送验证码
  // console.log(`${userStore.hostname}/auth/sendCode/${userStore.account}`)
  axios
    .get(`${userStore.hostname}/auth/sendCode/${userStore.account}`)
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
  <div class="password">
    <n-card title="修改密码" style="height: 100%; margin-bottom: 16px; border-radius: 0">
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <!-- 用户账号（不可更改） -->
        <n-form-item path="account" label="账号">
          <n-input v-model:value="userStore.account" type="text" placeholder="账号" disabled />
        </n-form-item>
        <!-- 新密码 -->
        <n-form-item path="newPwd" label="新密码">
          <n-input v-model:value="model.pwd" type="text" placeholder="请输入新密码" />
        </n-form-item>
        <!-- 验证码 -->
        <n-form-item path="code" label="验证码">
          <n-input class="form-input" v-model:value="model.code" :type="'text'" placeholder="验证码">
            <template #suffix>
              <n-button :disabled="!isEnableEmailVerify" :size="'small'" @click="handleSendCode">{{ codeTxt }}</n-button>
            </template>
          </n-input>
        </n-form-item>
      </n-form>
      <n-space :justify="'end'">
        <n-tooltip :disabled="isEnableEmailVerify" trigger="hover">
          <template #trigger>
            <n-button :disabled="!isEnableEmailVerify" type="primary" class="confirm" @click="handleSubmit">保存</n-button>
          </template>
          目标服务器不支持邮箱验证码修改密码
        </n-tooltip>
      </n-space>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.password {
  z-index: 0;
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
}
</style>
