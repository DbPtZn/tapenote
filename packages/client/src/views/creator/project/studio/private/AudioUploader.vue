<script lang="ts" setup>
import useStore from '@/store'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { getServerToken } from '@/api'
import { UploadCustomRequestOptions, UploadFileInfo, useMessage } from 'naive-ui'
import { findLowPoints, splitAudio } from '../_utils'
import { AudioRecorder } from '../_utils/recorder'

// const { userStore, projectStore } = useStore()
const message = useMessage()
// const props = defineProps<{
//   id: string
// }>()
const emits = defineEmits<{
  finish: [file: File]
  error: []
}>()
// const speakerId = computed(() => projectStore.get(props.id)?.speakerHistory.human)
// TODO 把上传的音频文件分割成小片段（不大于 60 s）
async function audioRequest(options: UploadCustomRequestOptions) {
  if(!options?.file?.file) return
  // console.log(options.file.file)
  const file = options.file.file
  if(!file.type.startsWith('audio')) {
    message.error('请上传音频文件')
    return
  }
  emits('finish', file)
}

const handleError = () => {
  emits('error')
}
</script>

<template>
  <n-upload
    class="uploader"
    :custom-request="audioRequest"
    @error="handleError"
    :show-file-list="false"
  >
    <n-upload-dragger>
      <div style="margin-bottom: 12px">
        <Icon icon="material-symbols:archive-outline" height="48" />
      </div>
      <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
    </n-upload-dragger>
  </n-upload>
</template>

<style scoped lang="scss">
.uploader {
  margin: 24px 0;
}
</style>
