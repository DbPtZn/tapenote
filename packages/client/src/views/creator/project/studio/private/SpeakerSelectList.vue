<script lang="ts" setup>
import { NMessageProvider, useDialog, useThemeVars } from 'naive-ui'
import { computed, h, ref } from 'vue'
import useStore from '@/store'
import { Icon } from '@iconify/vue'
import AddSpeaker from './AddSpeaker.vue'

type Speaker = ReturnType<typeof useStore>['speakerStore']['data'][0]
type CreateSpeakerDto = Parameters<ReturnType<typeof useStore>['speakerStore']['create']>[0]
type SpeakerType = 'human' | 'machine'
const props = defineProps<{
  account: string
  hostname: string
  speakerHistory: { human: string; machine: string }
  data: Speaker[]
  type: SpeakerType
}>()

const emits = defineEmits<{
  select: [id: string, type: SpeakerType]
  add: [args: CreateSpeakerDto]
  remove: [id: string]
}>()

const dialog = useDialog()
const themeVars = useThemeVars()
const isShowRole = ref(false)
const speakerType = ref(props.type)
const humanSpeaker = computed(() => props.data.filter(i => i.type === 'human'))
const machineSpeaker = computed(() => props.data.filter(i => i.type === 'machine'))
const { speakerStore } = useStore()
function handleClick(id: string, type: SpeakerType) {
  emits('select', id, type)
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
              onSubmit: result => {
                emits('add', result)
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
      emits('remove', id)
    }
  })
}

const currentSpeaker = ref<Speaker>()
function handleMouseEnter(speaker: Speaker) {
  currentSpeaker.value = speaker
}

function handleMouseLeave() {
  currentSpeaker.value = undefined
}

function getModelName(value?: string) {
  if(!value) return ''
  if(speakerType.value === 'machine') {
    return speakerStore.ttsOptions.find(i => i.value === value)?.label
  }
  return speakerStore.asrOptions.find(i => i.value === value)?.label
}

</script>

<template>
  <div class="speaker-select-list">
    <n-tabs type="line" animated :default-value="speakerType" @update:value="speakerType = $event">
      <template #suffix>
        <n-button v-show="speakerType === 'machine'" text>
          <Icon
            :icon="!isShowRole ? 'mdi:card-account-details-outline' : 'mdi:card-account-details'"
            height="24px"
            @click="isShowRole = !isShowRole"
          />
        </n-button>
      </template>
      <n-tab-pane name="machine" tab="合成语音">
        <n-flex>
          <div class="speaker-item" v-for="speaker in machineSpeaker" :key="speaker.id" @mouseenter="handleMouseEnter(speaker)" @mouseleave="handleMouseLeave">
            <div
              :class="['speaker-wrapper', speakerHistory.machine === speaker.id ? 'active' : '']"
              :style="{ width: '50px' }"
              @click="handleClick(speaker.id, 'machine')"
            >
              <Icon v-if="speaker.id" class="speaker-close" icon="mdi:close" height="24" @click.stop="handleRemove(speaker.id, 'machine')" />
              <div class="speaker-avatar">
                <img
                  :src="speaker.avatar"
                  :alt="speaker.name"
                  :style="{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '3px' }"
                  @error="e => ((e.target! as HTMLImageElement).src = './default.png')"
                />
              </div>
              <span class="speaker-name">{{ !isShowRole ? speaker.name : speaker.role }}</span>
            </div>
          </div>
          <div class="speaker-add" @click="handleAdd('machine')">
            <Icon icon="mdi:plus" height="24" />
          </div>
        </n-flex>
      </n-tab-pane>
      <n-tab-pane name="human" tab="角色扮演">
        <n-flex>
          <div class="speaker-item" v-for="speaker in humanSpeaker" :key="speaker.id"  @mouseenter="handleMouseEnter(speaker)" @mouseleave="handleMouseLeave">
            <div
              :class="['speaker-wrapper', speakerHistory.human === speaker.id ? 'active' : '']"
              :style="{ width: '50px' }"
              @click="handleClick(speaker.id, 'human')"
            >
              <Icon v-if="speaker.id" class="speaker-close" icon="mdi:close" height="24" @click.stop="handleRemove(speaker.id, 'human')" />
              <div class="speaker-avatar">
                <img
                  :src="speaker.avatar"
                  :alt="speaker.name"
                  :style="{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '3px' }"
                  @error="e => ((e.target! as HTMLImageElement).src = './default.png')"
                />
              </div>
              <span class="speaker-name">{{ speaker.name }}</span>
            </div>
          </div>
          <div class="speaker-add" @click="handleAdd('human')">
            <Icon icon="mdi:plus" height="24" />
          </div>
        </n-flex>
      </n-tab-pane>
    </n-tabs>
    <div :class="{ detail: true, 'show-detail': !!currentSpeaker }">
      <h2>详情</h2>
      <p>名称：{{ currentSpeaker?.name }}</p>
      <p>模型：{{ getModelName(currentSpeaker?.model) }}</p>
      <p v-if="speakerType === 'machine'">音色：{{ currentSpeaker?.role }}</p>
      <p v-if="speakerType === 'machine'">语速：{{ currentSpeaker?.speed }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 446px;
  background-color: v-bind('themeVars.cardColor');
  padding: 0px 24px;
  box-sizing: border-box;
  border-radius: 3px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.show-detail {
  opacity: 1;
}
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
