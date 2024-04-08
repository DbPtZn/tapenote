<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { NButton, NSpace, useMessage } from 'naive-ui'
import type { DataTableColumns, FormInst, FormItemRule, FormRules, UploadFileInfo } from 'naive-ui'
import { Main, Header } from '@/components'
import useStore from '@/store'
import { onMounted } from 'vue'
interface ModelType {
  oldPwd: string
  newPwd: string
  confirmPwd: string
}
const message = useMessage()
const { userStore, userListStore } = useStore()
/** 表单数据 */
const model = ref<ModelType>({
  oldPwd: '',
  newPwd: '',
  confirmPwd: ''
})
/** 表单规则 */
const rules: FormRules = {
  oldPwd: [
    {
      required: true,
      message: '旧密码不能为空',
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
  newPwd: [
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
    },
    {
      message: '新密码与旧密码相同',
      trigger: ['blur', 'change'],
      validator: (rule: FormItemRule, value: string) => {
        return value !== model.value.oldPwd
      }
    }
  ],
  confirmPwd: [
  {
      required: true,
      message: '确认密码不能为空',
      trigger: 'blur'
    },
    {
      message: '密码长度应该在8~24个字符之间',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length >= 8 && value.length <= 24 
      }
    },
    {
      message: '确认密码与新密码不一致',
      trigger: ['blur', 'change'],
      validator: (rule: FormItemRule, value: string) => {
        return value === model.value.newPwd
      }
    }
  ]
}

const formRef = ref<FormInst | null>(null)
/** 提交 */
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      if (model.value.newPwd === model.value.oldPwd) {
        message.error('新密码与旧密码相同')
        return
      }
      if (model.value.newPwd !== model.value.confirmPwd) {
        message.error('二次确认密码不一致')
        return
      }
      const dto = {
        oldPwd: model.value.oldPwd,
        newPwd: model.value.newPwd
      }
      userStore.updatePassword(dto).then(() => {
        model.value = {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        }
        message.success('修改成功')
      })
    } else {
      console.log(errors)
    }
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
        <!-- 旧密码 -->
        <n-form-item path="oldPwd" label="旧密码">
          <n-input v-model:value="model.oldPwd" type="text" placeholder="请输入旧密码" />
        </n-form-item>
        <!-- 新密码 -->
        <n-form-item path="newPwd" label="新密码">
          <n-input v-model:value="model.newPwd" type="text" placeholder="请输入新密码" />
        </n-form-item>
        <!-- 确认密码 -->
        <n-form-item path="confirmPwd" label="确认密码">
          <n-input v-model:value="model.confirmPwd" type="text" placeholder="再次确认密码" />
        </n-form-item>
      </n-form>
      <n-space :justify="'end'">
        <n-button type="primary" @click="handleSubmit">保存</n-button>
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
