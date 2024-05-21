<script lang="ts" setup>
import { NMessageProvider, useDialog, useThemeVars } from 'naive-ui'
import { computed, h, onMounted, ref } from 'vue'
import { VpnKeyOffOutlined, AddRound, VpnKeyOutlined, CloseRound, RemoveRound } from '@vicons/material'
import AddSpeaker from './AddSpeaker.vue'
import useStore from '@/store'
type Speaker = ReturnType<typeof useStore>['speakerStore']['data'][0]
type SpeakerType = 'human' | 'machine'
const props = defineProps<{
  account: string
  hostname: string
  speakerHistory: { human: string; machine: string }
  data: Speaker[]
  type: SpeakerType
  onSelect: (id: string, type: SpeakerType) => void
  onAdd: (args: { type: SpeakerType; avatar: string; name: string; role: number; changer?: number }) => void
  onRemove: (id: string) => void
}>()

const dialog = useDialog()
const themeVars = useThemeVars()
const isShowKey = ref(false)
const humanSpeaker = computed(() => props.data.filter(i => i.type === 'human'))
const machineSpeaker = computed(() => props.data.filter(i => i.type === 'machine'))

function handleClick(id: string, type: SpeakerType) {
  props.onSelect(id, type)
}
function handleAdd(type: SpeakerType) {
  const d = dialog.create({
    title: `添加${type === 'human' ? '扮演角色' : '合成音色'}`,
    content: () =>
      h(
        NMessageProvider,
        {},
        {
          default: () =>
            h(AddSpeaker, {
              account: props.account,
              hostname: props.hostname,
              type,
              submit: result => {
                props.onAdd(result)
                d.destroy()
              }
            })
        }
      )
  })
}
function handleRemove(id: string, type?: SpeakerType) {
  dialog.create({
      title: '删除',
      content: `是否删除？`,
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: () => {
        props.onRemove(id)
      }
    })
}
</script>

<template>
  <div class="speaker-select-list">
    <n-tabs type="line" animated :default-value="type">
      <template #suffix>
        <n-button text>
          <n-icon :component="!isShowKey ? VpnKeyOutlined : VpnKeyOffOutlined" :size="24" @click="isShowKey = !isShowKey" />
        </n-button>
      </template>
      <n-tab-pane name="machine" tab="合成语音">
        <n-flex>
          <div class="speaker-item" v-for="speaker in machineSpeaker" :key="speaker.id">
            <div :class="['speaker-wrapper', speakerHistory.machine === speaker.id ? 'active' : '']" :style="{ width: '50px' }" @click="handleClick(speaker.id, 'machine')">
              <n-icon v-if="speaker.role !== 0" class="speaker-close" :component="CloseRound" @click.stop ="handleRemove(speaker.id, 'machine')" />
              <div class="speaker-avatar">
                <img
                  :src="speaker.avatar"
                  :alt="speaker.name"
                  :style="{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '3px' }"
                  @error="(e) => (e.target! as HTMLImageElement).src='./default.png'"
                />
              </div>
              <span v-if="!isShowKey" class="speaker-name">{{ speaker.name }}</span>
              <span v-if="isShowKey" class="speaker-name">{{ speaker.role }}</span>
            </div>
          </div>
          <div class="speaker-add" @click="handleAdd('machine')">
            <n-icon :component="AddRound" :size="24" />
          </div>
        </n-flex>
      </n-tab-pane>
      <n-tab-pane name="human" tab="角色扮演">
        <n-flex>
          <div class="speaker-item" v-for="speaker in humanSpeaker" :key="speaker.id">
            <div :class="['speaker-wrapper', speakerHistory.human === speaker.id ? 'active' : '']" :style="{ width: '50px' }" @click="handleClick(speaker.id, 'human')">
              <n-icon v-if="speaker.role !== 10000" class="speaker-close" :component="CloseRound" @click.stop ="handleRemove(speaker.id, 'human')" />
              <div class="speaker-avatar">
                <img
                  :src="speaker.avatar"
                  :alt="speaker.name"
                  :style="{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '3px' }"
                  @error="(e) => (e.target! as HTMLImageElement).src='./default.png'"
                />
              </div>
              <span v-if="!isShowKey" class="speaker-name">{{ speaker.name }}</span>
              <span v-if="isShowKey" class="speaker-name">{{ speaker.role }}</span>
            </div>
          </div>
          <div class="speaker-add" @click="handleAdd('human')">
            <n-icon :component="AddRound" :size="24" />
          </div>
        </n-flex>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style lang="scss" scoped>
.speaker-select-list {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 0px;
  margin-bottom: 20px;
}
.active {
  background-color: v-bind('themeVars.buttonColor2Pressed');
}
.speaker-wrapper {
  user-select: none;
  position: relative;
  width: 50px;
  height: 80px;
  display: flex;
  border-radius: 3px;
  padding: 5px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .speaker-close {
    position: absolute;
    top: 0;
    right: 0;
    color: v-bind('themeVars.textColor3');
    opacity: 0;
    transition: all 0.2s ease-in-out;
    &:hover {
      color: v-bind('themeVars.textColor1');
    }
  }
  .speaker-avatar {
    width: 50px;
    height: 50px;
    border-radius: 3px;
  }
  .speaker-name {
    font-size: 14px;
    line-height: 18px;
    margin-top: 8px;
    width: 50px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
    .speaker-close {
      opacity: 1;
    }
  }
}
.speaker-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.speaker-add {
  width: 50px;
  height: 80px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dotted v-bind('themeVars.borderColor');
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
  }
  &:active {
    background-color: v-bind('themeVars.buttonColor2Pressed');
  }
}
</style>
