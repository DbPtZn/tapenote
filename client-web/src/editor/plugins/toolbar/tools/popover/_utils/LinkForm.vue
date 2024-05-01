<script lang="ts" setup>
import { inject, ref } from 'vue'
import { FormInst, FormItemRule, FormRules, UploadFileInfo } from 'naive-ui'
interface ModelType {
  url: string
  target: '_blank' | '_parent' | '_self' | '_top'
}
const useClose = inject('useClose') as () => void
const props = defineProps<{
  url: () => string
  onConfirm?: (res: ModelType) => void
  onConfirmEnd?: () => void
}>()
const formRef = ref<FormInst | null>(null)
const model = ref<ModelType>({
  url: props.url() || '',
  target: '_blank'
})
const rules: FormRules = {
  url: [
    {
      required: false,
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 255
      }
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
      // console.log(errors)
      props.onConfirmEnd && props.onConfirmEnd()
    }
  })
}
// const handleFinish = (options: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
//   const reader = new FileReader()
//   if (options.file.file) {
//     const file = options.file.file
//     reader.readAsDataURL(file)
//     reader.onload = function (event: ProgressEvent<FileReader>) {
//       if (event.target) {
//         model.value.url = event.target.result as string
//       }
//     }
//   }
// }
</script>

<template>
  <div class="link-form">
    <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
      <n-form-item path="url" label="外部链接地址">
        <n-input v-model:value="model.url" :type="'text'" placeholder="请输入链接" />
      </n-form-item>
      <n-form-item path="window" label="打开窗口方式">
        <n-flex>
          <n-radio
            :checked="model.target === '_blank'"
            value="_blank"
            name="_blank"
            @change="model.target = '_blank'"
          >
            新窗口
          </n-radio>
          <!-- FIXME: _self 目前无效 -->
          <n-radio
            :checked="model.target === '_self'"
            value="_self"
            name="_self"
            @change="model.target = '_self'"
          >
            当前窗口
          </n-radio>
        </n-flex>
      </n-form-item>
      <n-button block @click="handleConfirm">确定</n-button>
    </n-form>
  </div>
</template>

<style lang="scss" scoped>
.link-form {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 6px;
}
</style>
