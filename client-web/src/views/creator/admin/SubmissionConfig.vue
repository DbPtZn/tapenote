<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, NSpace, useMessage } from 'naive-ui'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { Main } from '@/components'
import useStore from '@/store'
interface ModelType {
  id: string // id
  name: string // 名称
  site: string // 站点
  code: string // 授权码
  desc: string // 描述
}

const { userStore } = useStore()
const message = useMessage()
const props = defineProps<{
  config: {
    id: string
    name: string // 名称
    site: string // 站点
    code: string // 授权码
    desc: string // 描述
  }
}>()
/** 表单数据 */
const model = ref<ModelType>({
  id: props.config.id,
  name: props.config.name || '',
  site: props.config.site || '',
  code: props.config.code || '',
  desc: props.config.desc || ''
})
/** 表单规则 */
const rules: FormRules = {
  site: [],
  code: [],
  desc: [
    {
      required: false,
      message: '请输入描述',
      trigger: 'blur'
    },
    {
      message: '描述长度不能超过60个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 60
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
      userStore.updateSubmissionConfig(model.value).then(() => {
        message.success('保存成功')
      })
    } else {
      console.log(errors)
    }
  })
}

</script>

<template>
  <div class="submission-config">
    <!-- <Header :height="34"></Header> -->
    <Main :flex="1">
        <n-card title="投稿配置" style="height: 100%; margin-bottom: 16px; border-radius: 0">
          <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
            <!-- 配置名称 -->
            <n-form-item path="name" label="名称">
              <n-input v-model:value="model.name" type="text" placeholder="名称（不可重复）" maxlength="36" show-count />
            </n-form-item>
            <!-- 博客地址 -->
            <n-form-item path="site" label="博客地址">
              <n-input v-model:value="model.site" type="text" placeholder="https://" />
            </n-form-item>
            <!-- 授权码 -->
            <n-form-item path="code" label="授权码">
              <n-input v-model:value="model.code" type="text" placeholder="授权码" maxlength="18" show-count />
            </n-form-item>
            <!-- 用户简介 -->
            <n-form-item path="desc" label="描述">
              <n-input v-model:value="model.desc" type="textarea" placeholder="描述" maxlength="64" show-count />
            </n-form-item>
          </n-form>
          <n-space :justify="'end'">
            <n-button type="primary" @click="handleSubmit">保存</n-button>
          </n-space>
        </n-card>
    </Main>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  height: 80px;
  width: 80px;
}
.submission-config {
  margin-top: 16px;
  z-index: 0;
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
}
</style>
