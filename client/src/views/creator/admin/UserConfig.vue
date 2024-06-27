<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { NButton, NSpace, useMessage } from 'naive-ui'
import type { DataTableColumns, FormInst, FormItemRule, FormRules, UploadFileInfo } from 'naive-ui'
import { Main, Header } from '@/components'
import useStore from '@/store'
import { onMounted } from 'vue'
interface ModelType {
  autosave: boolean 
  saveInterval: number
}
const message = useMessage()
const { userStore } = useStore()
/** 表单数据 */
const model = ref<ModelType>({
  autosave: userStore.config.autosave, 
  saveInterval: userStore.config.saveInterval
})
/** 表单规则 */
const rules: FormRules = {
  autosave: [
  ],
  saveInterval: [
  ]
}

const formRef = ref<FormInst | null>(null)
/** 提交 */
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      console.log('submit!', model.value)
      userStore.updateConfig(model.value).then(() => {
        message.success('修改成功')
      })
    } else {
      console.log(errors)
    }
  })
}
</script>

<template>
  <div class="config">
    <n-card title="用户习惯" style="height: 100%; margin-bottom: 16px; border-radius: 0">
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <n-form-item path="autosave" label="自动保存">
          <n-switch v-model:value="model.autosave" />
        </n-form-item>
        <n-form-item path="saveInterval" label="保存间隔">
          <n-input-number v-model:value="model.saveInterval" :precision="0" :min="1000" :max="100000" :step="1000">
            <template #suffix>
              ms
            </template>
          </n-input-number>
        </n-form-item>
      </n-form>
      <n-space :justify="'end'">
        <n-button type="primary" @click="handleSubmit">保存</n-button>
      </n-space>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.config {
  z-index: 0;
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
}
</style>
