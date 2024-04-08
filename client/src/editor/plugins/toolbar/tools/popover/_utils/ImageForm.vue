<script lang="ts" setup>
import { inject, ref } from 'vue'
import { FormInst, FormItemRule, FormRules, UploadFileInfo, useThemeVars } from 'naive-ui'
interface ModelType {
  src: string
}
const useClose = inject('useClose') as () => void
const props = defineProps<{
  onConfirm?: (res: ModelType) => void
  onConfirmEnd?: () => void
}>()
const formRef = ref<FormInst | null>(null)
const model = ref<ModelType>({
  src: ''
})
const rules: FormRules = {
  src: [
    {
      required: false
      // validator: (rule: FormItemRule, value: string) => {
      //   return value.length < 100
      // }
    }
  ]
}
function handleConfirm(e: MouseEvent) {
  // e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      props.onConfirm && props.onConfirm(model.value)
      props.onConfirmEnd && props.onConfirmEnd()
      useClose()
    } else {
      console.log(errors)
      props.onConfirmEnd && props.onConfirmEnd()
    }
  })
}
const handleFinish = (options: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  const reader = new FileReader()
  if (options.file.file) {
    const file = options.file.file
    reader.readAsDataURL(file)
    reader.onload = function (event: ProgressEvent<FileReader>) {
      if (event.target) {
        model.value.src = event.target.result as string
      }
    }
  }
}
</script>

<template>
  <div class="image-form">
    <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
      <n-form-item path="src" label="图片链接地址">
        <n-input v-model:value="model.src" :type="'text'" placeholder="请输入图片链接" />
      </n-form-item>
      <n-form-item path="upload" label="上传图片">
        <n-upload :default-upload="false" :file-list="[]" @before-upload="handleFinish">
          <n-button>上传文件</n-button>
        </n-upload>
      </n-form-item>
      <n-button block @click="handleConfirm">确定</n-button>
    </n-form>
  </div>
</template>

<style lang="scss" scoped>
.image-form {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 6px;
}
</style>
