<script lang="ts" setup>
import useStore from '@/store'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { getServerToken } from '@/api'
import { UploadFileInfo } from 'naive-ui'

const { userStore } = useStore()
const accessToken = computed(() => getServerToken(userStore.account, userStore.hostname))
const emits = defineEmits<{
  finish: [url: string]
}>()
function handleFinish(args: { file: UploadFileInfo; event?: ProgressEvent }) {
  if (args.event) {
    const path = userStore.resourceDomain + (args.event.currentTarget as XMLHttpRequest).response
    emits('finish', path)
  }
}

</script>

<template>
  <n-upload
    class="uploader"
    :action="`${userStore.hostname}/upload/img`"
    :headers="{
      Authorization: `Bearer ${accessToken}`
    }"
    @finish="handleFinish"
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
