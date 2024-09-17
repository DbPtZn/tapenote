<script lang="ts" setup>
import { inject, ref } from 'vue'
import { FormInst, FormItemRule, FormRules, UploadFileInfo, useMessage, useThemeVars } from 'naive-ui'
import { ImgToUrlService } from '../../../../../services'
import { Injector } from '@textbus/core'
interface ModelType {
  src: string
}
const injector = inject('injector') as Injector
const useClose = inject('useClose') as () => void
const message = useMessage()
const props = defineProps<{
  onConfirm?: (res: ModelType) => void
  onConfirmEnd?: () => void
}>()
const imgToUrlService = injector.get(ImgToUrlService)
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
  const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/svg+xml']
  if (options.file.file?.type && !acceptedImageTypes.includes(options.file.file.type)) {
    // console.log('非图片类型无法上传')
    message.error('非图片类型无法上传')
    return false
  }
  const reader = new FileReader()
  if (options.file.file) {
    const file = options.file.file
    reader.readAsDataURL(file)
    reader.onload = async function (event: ProgressEvent<FileReader>) {
      if (event.target) {
        let src = event.target.result
        if (typeof src !== 'string') {
          return
        }
        if (ImgToUrlService.isBase64(src)) {
          await imgToUrlService
            .uploadImg(src)
            .then(url => {
              src = url
            })
            .catch(err => {
              console.log(err)
              src = ''
            })
        }
        model.value.src = src as string
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
