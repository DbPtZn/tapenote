<script lang="ts" setup>
import useStore from '@/store'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { getServerToken } from '@/api'
import { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import { useUploadImg } from '../../../_hooks'
const { userStore } = useStore()
// const accessToken = computed(() => getServerToken(userStore.account, userStore.hostname))
const emits = defineEmits<{
  finish: [url: string]
  error: []
}>()

// function handleFinish(args: { file: UploadFileInfo; event?: ProgressEvent }) {
//   if (args.event) {
//     const path = userStore.resourceDomain + (args.event.currentTarget as XMLHttpRequest).response
//     emits('finish', path)
//   }
// }
const handleError = () => {
  emits('error')
}
// const cover = ref<string>('')
const { uploadImgFile } = useUploadImg(userStore.account, userStore.hostname)
async function useImgRequest(options: UploadCustomRequestOptions) {
  if(!options?.file?.file) return
  const url = await uploadImgFile(options.file.file)
  // model.value.avatar = url
  // cover.value = url
  emits('finish', url)
}

</script>

<template>
  <n-upload
    class="uploader"
    :custom-request="useImgRequest"
    @error="handleError"
  >
    <n-upload-dragger>
      <div style="margin-bottom: 12px">
        <Icon icon="material-symbols:archive-outline" height="48" />
      </div>
      <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
      <!-- <n-p depth="3" style="margin: 8px 0 0 0"> 请不要上传敏感数据 </n-p> -->
    </n-upload-dragger>
  </n-upload>
</template>

<style scoped lang="scss">
.uploader {
  margin: 24px 0;
}
</style>
