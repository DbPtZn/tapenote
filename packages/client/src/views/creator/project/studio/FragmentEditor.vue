<script lang="ts" setup>
import _ from 'lodash'
import { useMessage } from 'naive-ui'
import useStore from '@/store'
import AudioEditor, { SegmentFragment } from './private/AudioEditor.vue'
import TxtEditor from './private/TxtEditor.vue'

type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]

const props = defineProps<{
  projectId: string
  fragment: Fragment
}>()

const emits = defineEmits<{
  close: []
}>()

const { projectStore } = useStore()
const message = useMessage()

const audioMethods = {
  handleConfirm: (fragments: SegmentFragment[]) => {
    const data = fragments.map(fragment => {
      return {
        audio: fragment.audio,
        duration: fragment.duration,
        speaker: props.fragment.speaker,
        txt: fragment.txt,
        timestamps: fragment.timestamps,
        transcript: fragment.transcript,
        tags: fragment.tags,
        promoters: fragment.promoters
      }
    })
    projectStore.fragment(props.projectId).createBySegment(data, props.fragment.id).then(() => {
      message.success('创建成功')
    }).catch(() => {
      message.error('创建失败')
    })
  },
  handleCancel: () => {
    emits('close')
  }
}

const txtMethods = {
  handleConfirm: (newTranscript: string[]) => {
    if (_.isEqual(props.fragment.transcript, newTranscript)) {
      message.warning('未进行任何更改')
      return
    }
    projectStore
      .fragment(props.projectId)
      .updateTranscript({ fragmentId: props.fragment.id, newTranscript })
      .then(() => {
        message.success('更新成功')
      }).catch(() => {
        message.error('更新失败')
      })
  },
  handleCancel: () => {
    emits('close')
  }
}
</script>

<template>
  <div class="fragment-editor">
    <n-tabs type="line" animated>
      <n-tab-pane name="txt-editor" tab="文本编辑器">
        <TxtEditor :transcript="fragment.transcript" @confirm="txtMethods.handleConfirm" @cancel="txtMethods.handleCancel" />
      </n-tab-pane>
      <n-tab-pane name="audio-editor" tab="音频编辑器">
        <AudioEditor :fragment="fragment" @confirm="audioMethods.handleConfirm" @cancel="audioMethods.handleCancel" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style lang="scss" scoped>
.fragment-editor {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
