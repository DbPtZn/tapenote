<script lang="ts" setup>
import { Character, AudioFragment, TTS, ASR, TipBtn, StudioToolbar, SpeakerSelectList, TxtEdit, FragmentTrash, CreateBlankFragment } from './private'
import useStore from '@/store'
import { computed, h, inject, nextTick, onMounted, onUnmounted, reactive, ref, useTemplateRef, watch } from 'vue'
import { DropdownOption, MessageReactive, NIcon, NMessageProvider, SelectOption, useDialog, useMessage, useThemeVars } from 'naive-ui'
import { Bridge } from '../bridge'
import _ from 'lodash'
import utils from '@/utils'
import { useFragment, usePromoter, useRecorder, checkSilenceAudio, useInput, useTrash, useSpeech } from './hooks'
import { auditTime } from '@tanbo/stream'
import { LibraryEnum } from '@/enums'
import { Voice, Delete, Interpreter, ArrowDropDown, CommentAdd, FileImport, TextT24Filled } from '@/components'
import { DeleteOutlined, EditOutlined, HeadsetOutlined, AddReactionSharp, KeyboardOutlined } from '@vicons/material'
import Delegater from './Delegater.vue'
import { splitText, collapseText } from './_utils'
import { VueDraggable } from 'vue-draggable-plus'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { AudioRecorder } from './_utils/recorder'
type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]
type Speaker = ReturnType<typeof useStore>['speakerStore']['data'][0]
const bridge = inject('bridge') as Bridge
const props = defineProps<{
  id: string
  lib: LibraryEnum
  account: string
  hostname: string
  focus: () => boolean
  readonly: () => boolean
}>()
const { projectStore, clipboardStore } = useStore()
// const dialog = useDialog()
const message = useMessage()
const themeVars = useThemeVars()
const { t } = useI18n()
const scrollerRef = ref()
const state = reactive({
  isReadonly: computed(() => props.readonly()),
  isFocus: computed(() => props.focus()),
  isShortcutAllow: true,
})
const studioEl = useTemplateRef<HTMLElement>('studioEl')

onMounted(() => {
  bridge.studioRef = studioEl.value
})

const { recorderMode, ttsSpeed, speakerId, speaker, isAudioInputting, inputtingDuration, speedOptions, handleTextOutput, handleAudioOutput, handleInputting, handleAddBlank, handleModeSwitch, handleSpeakerChange } = useInput(props.id, props.account, props.hostname)
const { removedFragments, handleTrashManage } = useTrash(props.id, props.account, props.hostname)
const { checkAnimeState, checkPromoter, handleReorder } = usePromoter(props.id, bridge)
const { dropdownState, selectedFragments, playerState, studioOptions, isShowName, isShowOrder, isShowSpeechModeToolbar, handleContextmenu, handleExpand, handleSelect, handlePlay, handleEdit, handleRemove, handleMove } = useFragment(props.id, bridge, checkAnimeState, checkPromoter, handleReorder)

const fragments = ref<Fragment[]>(projectStore.fragment(props.id).getBySort())
const fragmentsLength = computed(() => fragments.value.length)
watch(() => projectStore.fragment(props.id).getBySort(), (fragmentsData) => {
  if (fragmentsLength.value < fragmentsData.length) {
    nextTick(() => {
      // 新增片段时，将滚动条滚动到底部
      scrollerRef.value.scrollTop = scrollerRef.value.scrollHeight
    })
  }
  fragments.value = fragmentsData
})

/** 编辑器挂载完成后校验启动子和动画标记 */
const subscription = bridge.onEditorReady.pipe(auditTime(100)).subscribe((editor) => {
  checkPromoter()
  checkAnimeState()
  // TODO 动画启动子校验（暂不考虑实现）
  // editor.onChange.pipe(debounceTime(500)).subscribe(() => {
  //   // 校验启动子
  //   // 因为历史记录的原因，我们很难让启动子跟编辑器保持同步一致。
  //   // 如果用户删除了动画后，我们立即通过校验删除对应的启动子，那么用户撤销了删除操作后，该怎么办？
  //   // 此时动画标记会显示激活状态，而启动子已经被删除了，要么重新创建该启动子，要么进行动画标记校验，将取消错误激活的标记状态
  //   // 撤销和重做也很难区分，用户可以在创建一个动画后将其撤销，动画会被删除。也可以在删除动画后将其撤销，动画就被重做出来了。
  //   // 所以，我们只能通过监听编辑器的 onChange 事件，区分撤销和重做没有意义。
  //   // 如果我们在 onchange 一定延时后进行启动子校验，且校验后确实移除了启动子，那么用户再次执行历史记录操作时，就应该进行动画标记的校验
  //   // 在用户初始化项目后，应该同时进行启动子校验和动画标记校验。
  //   // 这样大致可以确保启动子和动画的一致性，且较大程度保持同步的时间紧密性。
  // })
})

onUnmounted(() => {
  subscription.unsubscribe()
})

// 总时长
const isTotalDurationShow = ref(false)
const totalDuration = computed(() => {
    return projectStore
      .fragment(props.id)
      .getBySort()
      .reduce((total, fragment) => {
        return total + Number(fragment.duration)
      }, 0)
  })

const { waveEl, isRecording, isWaveformVisible, isStarted, onStateUpdate, ondataavailable, handleStartPause, handleStopRecord, handleCut, handleWaveformVisible } = useRecorder()
const { startSpeech } = useSpeech(bridge)

const isWaitForSelectAnime = ref(false)
let msg: MessageReactive | undefined = undefined
const speechMethods = {
  start: () => {
    if(!isStarted.value) {
      if(isWaitForSelectAnime.value) {
        isWaitForSelectAnime.value = false
        message.info('已取消')
        msg?.destroy()
        return 
      }
      isWaitForSelectAnime.value = true
      msg = message.info('请选择一个动画块后开始录制', { duration: 0 })
      startSpeech(
        () => {
          handleStartPause()
          isWaitForSelectAnime.value = false
          msg?.destroy()
        }
      )
      return
    }
    handleStartPause()
  },
  stop: () => {
    // TODO
  }
}

ondataavailable.subscribe(async data => {
  if(!data.isSilence) {
    const blob = await AudioRecorder.toWAVBlob(data.blob)
    const duration = data.duration
    // handleAudioOutput({ audio: blob, duration })
    return
  }
  // TODO 一般可能最后一段音频才需要考虑是否包含说话声音
  // const txtLength = Math.floor(data.duration / 0.5)
  // projectStore.fragment(props.id).createBlank({
  //   txtLength,
  //   duration: data.duration
  // }).catch(e => {
  //   message.error(t('studio.msg.create_fragment_error'))
  // })
})

const recMode = ref('speech')
const options: SelectOption[] = [
  {
    label: '演讲模式',
    value: 'speech',
    txt: '演讲'
  },
  {
    label: '自由模式',
    value: 'free',
    txt: '自由'
  }
]

</script>
<template>
  <div class="studio" ref="studioEl">
    <!-- 顶部 -->
    <div class="header" :height="47">
      <div style="width: 24px;" />
      <strong :class="[state.isReadonly ? 'disabled' : '']" style="white-space: nowrap; user-select: none;" @click="isTotalDurationShow = !isTotalDurationShow">
        <span v-if="!isTotalDurationShow && !playerState.isPlaying" style="display: inline-block; min-width: 72px;">录音台</span>
        <span v-if="isTotalDurationShow && !playerState.isPlaying" style="display: inline-block; min-width: 72px;">{{ utils.durationFormat(totalDuration) }}</span>
        <span v-if="playerState.isPlaying" style="display: inline-block; min-width: 72px;">{{ utils.durationFormat(playerState.currentTime) }}</span>
      </strong>
      <!-- 顶部下拉列表 -->
      <n-dropdown trigger="click" :options="studioOptions" :disabled="state.isReadonly">
        <n-button class="arrow" text size="small" :disabled="state.isReadonly">
          <template #icon>
            <n-icon :component="ArrowDropDown" :size="24"/>
          </template>
        </n-button>
      </n-dropdown>
    </div>
    <!-- 主展示区 -->
    <div ref="scrollerRef" class="main" @contextmenu="handleContextmenu">
      <Delegater :id="id">
        <!-- 拖拽组件 -->
        <VueDraggable class="draggable" v-model="fragments" :itemKey="'id'" @end="handleMove($event)">
            <AudioFragment
              v-for="(element, index) in fragments"
              :key="element.id"
              :id="element.id"
              :order="index + 1"
              :isShowOrder="isShowOrder"
              :speaker="element.speaker"
              :collapsed="element.collapsed"
              :is-loading="!!element.key"
              :is-show-name="isShowName"
              :is-cut="clipboardStore.fragment.length > 0 && clipboardStore.fragment[0].fragmentId === element.id && clipboardStore.fragment[0].type === 'cut'"
              :multiple="selectedFragments.length > 1"
              :duration="Number(element.duration)"
              :readonly="state.isReadonly"
              @expand="handleExpand(element)"
              @contextmenu="handleContextmenu($event, element)"
              @select="handleSelect($event, element)"
            >
              <template #txt>
                <Character
                  v-for="(item, index) in element.collapsed ? collapseText(element.transcript) : element.transcript"
                  :key="index"
                  :data-index="index"
                  :data-serial="!element.tags[index] ? '' : element.tags[index]!"
                  :serial="element.tags[index] || null"
                  :is-marked="!element.tags[index] ? false : true"
                >
                  {{ item }}
                </Character>
              </template>
              <template #loading>
                <n-spin v-if="element.key" size="small" />
              </template>
              <!-- 播放音频 -->
              <template #play>
                <n-icon v-if="!element.key" :component="HeadsetOutlined" :size="18" @click="handlePlay(element)" />
              </template>
              <!-- 编辑文字 -->
              <template #edit>
                <n-icon :component="EditOutlined" :size="18" @click="handleEdit(element)" />
              </template>
              <!-- 移除片段 （可以优化，不用每个片段都创建一个实例） -->
              <template #delete>
                <n-popconfirm :positive-text="t('confirm')" :negative-text="t('cancel')"  @positive-click="handleRemove(element)">
                  <template #trigger>
                    <n-icon :component="DeleteOutlined" :size="18" />
                  </template>
                  {{ t('studio.msg.whether_remove_fragment') }}
                </n-popconfirm>
              </template>
            </AudioFragment>
        </VueDraggable>
      </Delegater>
    </div>
    <!-- 底部 -->
    <div class="footer" :style="{ height: '200px' }" :overflow-x="'unset'">
      <!-- 工具栏 -->
      <StudioToolbar>
        <template #left>
          <!-- 角色选择 -->
          <n-popover trigger="hover" content-style="width: 60px;height: 80px;padding: 6px 0px 0px;display: flex;align-items: center;justify-content: center;" :disabled="state.isReadonly">
            <template #trigger>
              <n-button class="toolbar-btn" quaternary size="small" :disabled="state.isReadonly">
                <template #icon>
                  <n-icon :component="Interpreter" :size="24" @click="handleSpeakerChange(recorderMode === 'ASR'? 'human' : 'machine')" />
                </template>
              </n-button>
            </template>
            <div class="role" :style="{ width: '60px', height: '70px', cursor: 'pointer' }">
              <img
                class="role-avatar"
                :src="speaker?.avatar"
                :alt="speaker?.name"
                :style="{ width: '50px', height: '50px', objectFit: 'contain' }"
                @error="(e) => (e.target! as HTMLImageElement).src='./avatar03.png'"
                @click="handleSpeakerChange(recorderMode === 'ASR'? 'human' : 'machine')"
              >
              <span class="role-name">{{ speaker?.name || '' }}</span>
            </div>
          </n-popover>
        </template>
        <template #right>
          <!-- 语速选择 -->
          <n-popselect v-if="recorderMode === 'TTS'" v-model:value="ttsSpeed" :options="speedOptions" placement="top" trigger="click">
            <n-button class="toolbar-btn"  ghost size="small" :style="{ width: '50px' }" :disabled="state.isReadonly">
              {{ `${ttsSpeed === 1 ? '语速' : `${ttsSpeed}x`}`}}
            </n-button>
          </n-popselect>
          <!-- 导入音频文件 -->
            <n-button class="toolbar-btn" quaternary size="small" :disabled="true">
              <template #icon>
                <n-icon :component="FileImport" :size="24"/>
              </template>
            </n-button>
          <!-- 创建空白片段 -->
          <n-button class="toolbar-btn" quaternary size="small" :disabled="state.isReadonly" @click="handleAddBlank">
            <template #icon>
              <n-icon :component="CommentAdd" :size="24"/>
            </template>
          </n-button>
          <!-- 模式切换 -->
          <n-button class="toolbar-btn" quaternary size="small" :disabled="state.isReadonly" @keydown.prevent="" @click="handleModeSwitch">
            <template #icon>
              <n-icon :component="recorderMode === 'TTS' ? Voice : TextT24Filled" :size="24"/>
            </template>
          </n-button>
          <!-- 回收站 -->
          <n-button class="toolbar-btn" quaternary size="small" :disabled="state.isReadonly" @click="handleTrashManage">
            <template #icon>
              <n-icon :component="Delete" :size="24"/>
            </template>
          </n-button>
        </template>
      </StudioToolbar>
      <!-- 输入区 -->
      <div class="input-area" v-show="recorderMode === 'TTS' && !isStarted">
        <TTS  :readonly="state.isReadonly" @on-text-output="handleTextOutput"  />
      </div>
      <div class="input-area" v-show="recorderMode === 'ASR' && !isStarted">
        <ASR :readonly="state.isReadonly" :shortcut="state.isShortcutAllow && state.isFocus" @output="handleAudioOutput" @inputting="handleInputting" />
      </div>
      <div class="wave-area" v-show="isStarted">
        <canvas v-show="isWaveformVisible" class="wave" ref="waveEl" />
      </div>
      <div v-show="state.isFocus" class="shortcut">
        <n-popover trigger="hover" placement="bottom">
          <template #trigger>
            <Icon @click="state.isShortcutAllow = !state.isShortcutAllow" :icon="state.isShortcutAllow ? 'material-symbols:keyboard-outline-rounded' : 'material-symbols:keyboard-off-outline-rounded'" :height="24" />
          </template>
          <span>{{ state.isShortcutAllow ? 'Ctrl + Number0' : '快捷键已禁用' }}</span>
        </n-popover>
      </div>
      <div v-if="isAudioInputting" class="recording">
        <div class="recording-content">
          <Icon class="icon" icon="ic:sharp-settings-voice" height="64px"/>
          <span class="text">正在录音</span>
        </div>
        <span class="duration"> {{ inputtingDuration }} </span>
      </div>
    </div>
    <!-- 下拉列表 -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdownState.x"
      :y="dropdownState.y"
      :options="(dropdownState.options as DropdownOption[])"
      :show="dropdownState.isShow"
      :on-clickoutside="() => dropdownState.isShow = false"
    />
    
    <div :class="{ 'speech-mode': 1, 'speech-mode-hide' : !isShowSpeechModeToolbar }">
      <div class="btn-group">
        <div class="btn">
          <n-popselect v-model:value="recMode" :options="options" trigger="click">
            <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center' }">
              <span>{{ options.find(item => item.value === recMode)?.txt }}</span>
              <span>模式</span>
            </div>
          </n-popselect>
        </div>
        <div class="btn" @click="speechMethods.start()">
          {{ isRecording ? '暂停' : (isStarted ? '继续' : isWaitForSelectAnime ? '选择' : '开始') }}
          <Icon v-if="!isRecording && !isStarted && !isWaitForSelectAnime" icon="fluent:mic-48-regular" height="24" />
          <Icon v-if="!isRecording && isStarted"  icon="fluent:mic-pulse-48-regular" height="24" />
          <Icon v-if="isWaitForSelectAnime" icon="mynaui:location-selected" height="24" />
          <Icon v-if="isRecording" icon="svg-spinners:blocks-wave" height="24" />
        </div>
        <div :class="{ btn: 1, disabled: !isStarted }" @click="handleStopRecord">
          停止
          <Icon icon="fluent:mic-off-48-regular" height="24" />
        </div>
        <div :class="{ btn: 1, disabled: !isStarted }" @click="handleCut">
          分段
          <Icon icon="solar:video-frame-cut-broken" height="24" />
        </div>
        <div :class="{ btn: 1, disabled: !isStarted }" @click="handleWaveformVisible">
          波形图
          <Icon icon="mage:sound-waves" height="24" />
        </div>
      </div>
      <div class="collapse-btn" @click="isShowSpeechModeToolbar = !isShowSpeechModeToolbar">
        <Icon :icon="isShowSpeechModeToolbar ?'material-symbols:arrow-forward-ios-rounded' : 'material-symbols:arrow-back-ios-rounded'" height="24" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.speech-mode-hide {
  display: none;
  right: -80px!important;
  .collapse-btn {
    position: absolute;
    left: -44px;
    cursor: pointer;
  }
}
.speech-mode {
  position: absolute;
  bottom: 50%;
  right: 0;
  transform: translateY(50%);
  background-color: v-bind('themeVars.cardColor');
  border-radius: 3px;
  padding: 6px 6px;
  box-shadow: v-bind('themeVars.boxShadow3');
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease-in-out;
  .btn {
    user-select: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 60px;
    margin-top: 6px;
    background-color: v-bind('themeVars.buttonColor2');
    cursor: pointer;
    &:hover {
      background-color: v-bind('themeVars.buttonColor2Hover');
    }
    &:active {
      background-color: v-bind('themeVars.buttonColor2Pressed');
    }
    &:first-child {
      margin-top: 0px;
    }
  }
  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .collapse-btn {
    z-index: 1;
    position: absolute;
    bottom: 50%;
    left: -20px;
    transform: translateY(50%);
    cursor: pointer;
  }
}
.role {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .role-avatar {
    border-radius: 3px;
  }
  .role-name {
    margin-top: 5px;
    font-size: 14px;
    line-height: 18px;
    width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
}
.studio {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid v-bind('themeVars.dividerColor');
  background-color:  v-bind('themeVars.bodyColor');
  &:hover {
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: v-bind('themeVars.scrollbarColor');
    }
  }
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  overflow: hidden;
  box-sizing: border-box;
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
  .arrow {
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
    cursor: pointer;
  }
  &:hover{
    .arrow {
      opacity: 1;
    }
  }
  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
.main {
  position: relative;
  width: 100%;
  display: flex;
  flex: 1;
  box-sizing: border-box;
  // background-color: v-bind('themeVars.cardColor');
  background-color:  v-bind('themeVars.bodyColor');
  overflow-y: auto;
  overflow-x: hidden;
  .draggable {
    width: 100%;
  }
  .char {
    pointer-events: none;
    color: v-bind('themeVars.textColor2');
  }
}
.footer {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color:  v-bind('themeVars.bodyColor');
  .toolbar-btn {
    padding: 2px 4px;
  }
  .input-area {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wave-area {
    height: 100%;
    width: 100%;
    position: absolute;
    cursor: not-allowed;
    background-color: #3a3a3a3a;
    .wave {
      position: absolute;
      top: 38px;
      left: 0px;
      width: 100%;
      height: 100%;
      background-color: #2e2e2e36;
      // transform: rotateZ(90deg);
    }
  }
  .shortcut {
    cursor: pointer;
    position: absolute;
    top: 46px;
    right: 6px;
    opacity: 0.5;
  }
  .recording {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .recording-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      background-color: v-bind('themeVars.infoColor');
      padding: 12px;
      height: 160px;
      width: 160px;
      border-radius: 90px;
      box-shadow: v-bind('themeVars.boxShadow1');
      .text {
        margin-top: 12px;
        font-size: 16px;        
      }
    }
    .duration {
      margin-top: 6px;
    }
  }
}
/** 定制滚动条 */
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  background-color: unset;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: unset;
}

// /*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: unset;
  background-color: unset;
}
</style>