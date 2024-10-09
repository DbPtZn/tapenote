<script lang="ts" setup>
import { Character, AudioFragment, TTS, ASR, StudioToolbar, SpeakerSelectList, TxtEdit, FragmentTrash, CreateBlankFragment } from './private'
import useStore from '@/store'
import { computed, h, inject, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { DropdownOption, NIcon, NMessageProvider, useDialog, useMessage, useThemeVars } from 'naive-ui'
import { Bridge } from '../bridge'
import _ from 'lodash'
import utils from '@/utils'
import { useFragment, usePromoter, useRecorder } from './hooks'
import { auditTime } from '@tanbo/stream'
import { LibraryEnum } from '@/enums'
import { Voice, Delete, Interpreter, ArrowDropDown, CommentAdd, FileImport, TextT24Filled } from '@/components'
import { DeleteOutlined, EditOutlined, HeadsetOutlined, AddReactionSharp, KeyboardOutlined } from '@vicons/material'
import Delegater from './Delegater.vue'
import { splitText } from './_utils'
import { VueDraggable } from 'vue-draggable-plus'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
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
const { projectStore, speakerStore, clipboardStore } = useStore()
const dialog = useDialog()
const message = useMessage()
const themeVars = useThemeVars()
const { t } = useI18n()
const scrollerRef = ref()
const state = reactive({
  isReadonly: computed(() => props.readonly()),
  isFocus: computed(() => props.focus()),
  isShortcutAllow: true, 
  isAudioInputting: false,
  duration: '00:00:00',
  ttsSpeed: 1,
  recorderMode: 'TTS' as 'TTS' | 'ASR',
})
onMounted(() => {
  // 获取说话人列表
  speakerStore.fetchAndSet(props.account, props.hostname)
})
const speakerId = computed(() => state.recorderMode === 'TTS' ? projectStore.get(props.id)?.speakerHistory.machine : projectStore.get(props.id)?.speakerHistory.human)
const speaker = computed(() => {
  return speakerStore.get(speakerId.value || '', props.account, props.hostname, state.recorderMode === 'TTS' ? 'machine' : 'human')
})
const speedOptions = [
  { label: '2.0x', value: 2.0 },
  { label: '1.5x', value: 1.5 },
  { label: '1.25x', value: 1.25 },
  { label: '1.0x', value: 1.0 },
  { label: '0.75x', value: 0.75 },
  { label: '0.5x', value: 0.5 },
]
const {
  handleAudioOutput,
  handleTextOutput,
  handleModeSwitch
} = {
  handleTextOutput(text: string) {
    if (text.length === 0) return
    // TODO 对过长的文本进行分片
    if (text.length > 32) {
      const chunks = splitText(text)
      if(typeof chunks === 'string') {
        console.log(chunks)
        // 防御：避免字符串文本，因为会被 for let...of 解析为单字符数组
        message.error(t('studio.msg.input_error'))
        return
      }
      const promiseArr: Promise<any>[] = []
      for(let chunk of chunks) {
        promiseArr.push(
          projectStore.fragment(props.id).createByText({
            txt: chunk,
            speakerId: speakerId.value || '',
            speed: state.ttsSpeed
          })
        )
      }
      // TODO 这里涉及并发问题，无法确定并发数量，如果中间有失败，则需要对失败片段重新上传，再次失败则放弃并提示用户
      // 理论上我们可以限制最大 6 个并发，这样用户一次输入的文本长度不应该超过 32 * 6 个字符（中文），当超过时提示用户手动分片
      Promise.all(promiseArr).catch(e => {
        message.error(t('studio.msg.create_fragment_error'))
      })
      return
    }
    projectStore.fragment(props.id).createByText({
      txt: text,
      speakerId: speakerId.value || '',
      speed: state.ttsSpeed
    }).catch(e => {
      message.error(t('studio.msg.create_fragment_error'))
    })
  },
  handleAudioOutput(data: { audio: Blob | undefined, duration: number }) {
    if (!data.audio) return
    projectStore.fragment(props.id).createByAudio({
      audio: data.audio,
      duration: data.duration,
      speakerId: speakerId.value || '',
    }).catch(e => {
      message.error(t('studio.msg.create_fragment_error'))
    })
  },
  handleModeSwitch() {
    state.recorderMode = state.recorderMode === 'ASR' ? 'TTS' : 'ASR'
  }
}
const { handleSpeakerChange, handleTrashManage, handleAddBlank } = {
  /** 切换语音合成角色 */
  handleSpeakerChange(type: 'human' | 'machine') {
    dialog.destroyAll()
    dialog.create({
      icon: () => h(NIcon, { component: AddReactionSharp, size: 24, style: { marginRight: '8px' } }),
      title: t('studio.changeRoles'),
      content: () => h(SpeakerSelectList, {
        account: props.account,
        hostname: props.hostname,
        speakerHistory: projectStore.get(props.id)?.speakerHistory || { human: '', machine: '' },
        data: speakerStore.data,
        type: type,
        onSelect: (speakerId: string, type: 'human' | 'machine') => {
          projectStore.updateSpeakerHistory({ id: props.id, type, speakerId }, props.account, props.hostname).catch(e => {
            message.error('Speaker history update error！')
          })
          dialog.destroyAll()
        },
        onAdd: (result) => {
          speakerStore.create({
            role: result.role,
            name: result.name,
            avatar: result.avatar,
            changer: result.changer
          }, props.account, props.hostname)
        },
        onRemove: (id: string) => {
          speakerStore.delete(id, props.account, props.hostname)
        },
      }),
    })
  },
  /** 添加空白音频过渡 */
  handleAddBlank() {
    dialog.create({
      title: '创建空白音频',
      content: () => h(NMessageProvider, null, 
        () => h(
          CreateBlankFragment, {
          onConfirm: (result) => {
            projectStore.fragment(props.id).createBlank(result).catch(e => {
              message.error(t('studio.msg.create_fragment_error'))
            })
            dialog.destroyAll()
          },
          onCancel: () => {
            dialog.destroyAll()
          }
        })
      )
    })
  },
  /** 打开回收站 */
  handleTrashManage() {
    dialog.create({
      title: '回收站',
      content: () => h(FragmentTrash, {
        data: removedFragments.value,
        onRestore: (fragmentId: string) => {
          projectStore.fragment(props.id).restore({ fragmentId })
        },
        onDelete: (fragmentId: string) => {
          projectStore.fragment(props.id).dele({
            fragmentId
          })
        },
        onExit: () => {
          dialog.destroyAll()
        }
      })
    })
  }
}
const { checkAnimeState, checkPromoter, handleReorder } = usePromoter(props.id, bridge)
const { dropdownState, selectedFragments, playerState, studioOptions, isShowName, isShowOrder, handleContextmenu, handleExpand, handleSelect, handlePlay, handleEdit, handleRemove, handleMove } = useFragment(props.id, bridge, checkAnimeState, checkPromoter, handleReorder)

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
const removedFragments = ref<Fragment[]>(projectStore.fragment(props.id).getRemovedBySort())
watch(() => projectStore.fragment(props.id).getRemovedBySort(), (removedFragmentsData) => {
  removedFragments.value = removedFragmentsData
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

const studioRef = ref()
onMounted(() => {
  bridge.studioRef = studioRef.value
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

/** 折叠转写文本的函数 */
function collapseText(transcript: string[]) {
  const head = transcript.slice(0, 6)
  const tail = transcript.slice(-4)
  return [...head, '...', ...tail]
}
function formatTime(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  const centiseconds = Math.floor((sec * 100) % 100); // Get first two digits of milliseconds
  return [minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0'), centiseconds.toString().padStart(2, '0')].join(':');
}
function setTimer(callback: (duration: string) => void, remaining: number) {
  let sec = 0
  const intervalId = setInterval(() => {
    sec += 0.01
    const formattedTime = formatTime(sec)
    callback(formattedTime)
    if (sec > remaining) {
      clearInterval(intervalId)
    }
  }, 10)
  return () => clearInterval(intervalId)
}

let timer: (() => void) | null = null
function handleInputting(is) {
  state.isAudioInputting = is
  if(is) timer = setTimer(duration => state.duration = duration, 60)
  else {
    timer?.()
    state.duration = '00:00:00'
  }
}

const { handleStartRecord, handleStopRecord } = useRecorder()
</script>
<template>
  <div class="studio" ref="studioRef">
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
              @on-expand="handleExpand(element)"
              @on-contextmenu="handleContextmenu($event, element)"
              @on-select="handleSelect($event, element)"
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
                  <n-icon :component="Interpreter" :size="24" @click="handleSpeakerChange(state.recorderMode === 'ASR'? 'human' : 'machine')" />
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
                @click="handleSpeakerChange(state.recorderMode === 'ASR'? 'human' : 'machine')"
              >
              <span class="role-name">{{ speaker?.name || '' }}</span>
            </div>
          </n-popover>
        </template>
        <template #right>
          <!-- 语速选择 -->
          <n-popselect v-if="state.recorderMode === 'TTS'" v-model:value="state.ttsSpeed" :options="speedOptions" placement="top" trigger="click">
            <n-button class="toolbar-btn"  ghost size="small" :style="{ width: '50px' }" :disabled="state.isReadonly">
              {{ `${state.ttsSpeed === 1 ? '语速' : `${state.ttsSpeed}x`}`}}
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
              <n-icon :component="state.recorderMode === 'TTS' ? Voice : TextT24Filled" :size="24"/>
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
      <div class="input-area" v-show="state.recorderMode === 'TTS'">
        <TTS  :readonly="state.isReadonly" @on-text-output="handleTextOutput"  />
      </div>
      <div class="input-area" v-show="state.recorderMode === 'ASR'">
        <ASR  :readonly="state.isReadonly" :shortcut="state.isShortcutAllow && state.isFocus" @output="handleAudioOutput" @inputting="handleInputting" />
      </div>
      <div v-show="state.isFocus" class="shortcut">
        <n-popover trigger="hover" placement="bottom">
          <template #trigger>
            <Icon @click="state.isShortcutAllow = !state.isShortcutAllow" :icon="state.isShortcutAllow ? 'material-symbols:keyboard-outline-rounded' : 'material-symbols:keyboard-off-outline-rounded'" :height="24" />
          </template>
          <span>{{ state.isShortcutAllow ? 'Ctrl + Number0' : '快捷键已禁用' }}</span>
        </n-popover>
      </div>
      <div v-if="state.isAudioInputting" class="recording">
        <div class="recording-content">
          <Icon class="icon" icon="ic:sharp-settings-voice" height="64px"/>
          <span class="text">正在录音</span>
        </div>
        <span class="duration"> {{ state.duration }} </span>
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
    
    <div class="speech-mode">
      <div class="btn"></div>
      <div class="btn" @click="handleStartRecord">{{ '开始' }}</div>
      <div class="btn" @click="handleStopRecord">停止</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.speech-mode {
  position: absolute;
  width: 60px;
  height: 360px;
  right: 30px;
  bottom: 50%;
  transform: translateY(50%);
  background-color: rgb(95, 95, 95);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  .btn {
    display: flex;
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