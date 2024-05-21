<script lang="ts" setup>
import Draggable from 'vuedraggable'
import { Character, AudioFragment, TTS, ASR, StudioToolbar, SpeakerSelectList, TxtEdit, FragmentTrash, CreateBlankFragment } from './private'
import useStore from '@/store'
import { computed, h, inject, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { NIcon, NMessageProvider, useDialog, useMessage, useThemeVars } from 'naive-ui'
import { Bridge } from '../bridge'
import _ from 'lodash'
import utils from '@/utils'
import { useFragment, usePromoter } from './hooks/_index'
import { auditTime } from '@tanbo/stream'
import { LibraryEnum } from '@/enums'
import { Voice, DrawText, Delete, Interpreter, ArrowDropDown, CommentAdd, FileImport, TextT24Filled } from '@/components'
import { DeleteOutlined, EditOutlined, HeadsetOutlined, AddReactionSharp, SpeedRound } from '@vicons/material'
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
const { projectStore, userStore, speakerStore, clipboardStore } = useStore()
const dialog = useDialog()
const message = useMessage()
const themeVars = useThemeVars()
const scrollerRef = ref()
const state = reactive({
  isReadonly: computed(() => props.readonly()),
  isFocus: computed(() => props.focus()),
  ttsSpeed: 1,
  recorderMode: 'TTS' as 'TTS' | 'ASR',
})
// const data = computed(() => projectStore.get(props.id))
// const speakerType = computed(() => {
//   return state.recorderMode === 'TTS' ? 'machine' : 'human'
// })
// const speakerHistory = computed(() => {
//   console.log(state.recorderMode)
//   return projectStore.get(props.id)?.speakerHistory
// })
const speakerId = computed(() => {
  console.log(state.recorderMode)
  return state.recorderMode === 'TTS' ? projectStore.get(props.id)?.speakerHistory.machine : projectStore.get(props.id)?.speakerHistory.human
})
// console.log(speakerId)
// const speaker = ref<Speaker>()
// onMounted(() => {
//    // 获取说话人列表
//   speakerStore.fetchAndSet(props.account, props.hostname)?.then(() => {
//     speaker.value = speakerStore.get((state.recorderMode === 'TTS' ? projectStore.get(props.id)?.speakerHistory.machine : projectStore.get(props.id)?.speakerHistory.human) || '', props.account, props.hostname, state.recorderMode === 'TTS' ? 'machine' : 'human')
//   })
//   console.log(speaker.value)
// })
// watch(() => projectStore.get(props.id)?.speakerHistory.human, (value) => {
//   speaker.value = speakerStore.get(value || '', props.account, props.hostname, 'human')
// })
// watch(() => projectStore.get(props.id)?.speakerHistory.machine, (value) => {
//   speaker.value = speakerStore.get(value || '', props.account, props.hostname, 'machine' )
// })
// const machineId = computed(() => projectStore.get(props.id)?.speakerHistory.machine)
// const humanId = computed(() => projectStore.get(props.id)?.speakerHistory.human)
const speaker = computed(() => {
  console.log('ddd')
  return speakerStore.get(speakerId.value || '', props.account, props.hostname, state.recorderMode === 'TTS' ? 'machine' : 'human')
})
// const speaker = computed(() => {
//   return state.recorderMode === 'TTS' ? ttsSpeaker.value : asrSpeaker.value
// })
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
    projectStore.fragment(props.id).createByText({
      txt: text,
      speakerId: speaker.value?.id || '',
      speed: state.ttsSpeed
    }).catch(e => {
      message.error('创建片段失败！')
    })
  },
  handleAudioOutput(data: { audio: Blob, duration: number }) {
    // console.log(data)
    projectStore.fragment(props.id).createByAudio({
      audio: data.audio,
      duration: data.duration,
      speakerId: speaker.value?.id || '',
    }).catch(e => {
      message.error('创建片段失败！')
    })
  },
  handleModeSwitch() {
    state.recorderMode === 'ASR' ? (state.recorderMode = 'TTS') : (state.recorderMode = 'ASR')
  }
}
const { handleSpeakerChange, handleTrashManage, handleAddBlank } = {
  /** 切换语音合成角色 */
  handleSpeakerChange(type: 'human' | 'machine') {
    dialog.destroyAll()
    dialog.create({
      icon: () => h(NIcon, { component: AddReactionSharp, size: 24, style: { marginRight: '8px' } }),
      title: ' 切换角色',
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
              message.error('创建片段失败！')
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

const { dropdownState, selectedFragments, playerState, studioOptions, handleContextmenu, handleSelect, handlePlay, handleEdit, handleRemove, handleMove } = useFragment(props.id, bridge)
const { handlePromoterSelect, handlePromoterUpdate, handlePromoterRemove, handleAnimeLocate, checkAnimeState, checkPromoter } = usePromoter(props.id, bridge)
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
</script>
<template>
  <div class="studio" ref="studioRef">
    <!-- 顶部 -->
    <Header class="header" :height="47">
      <!-- 占位 -->
      <div style="width: 24px;" />
      <strong :class="[state.isReadonly ? 'disabled' : '']" style="white-space: nowrap; user-select: none;" @click="isTotalDurationShow = !isTotalDurationShow">
        <span v-if="!isTotalDurationShow && !playerState.isPlaying" style="display: inline-block; min-width: 72px;">录音棚</span>
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
    </Header>
    <!-- 主展示区 -->
    <div ref="scrollerRef" class="main" @contextmenu="handleContextmenu">
      <!-- 拖拽组件 -->
      <Draggable class="draggable" v-model="fragments" :itemKey="'id'" @change="handleMove">
        <template #item="{ element }">
          <AudioFragment
            :key="element.id"
            :is-loading="!!element.key"
            :speaker="element.speaker"
            :is-cut="clipboardStore.fragment.length > 0 && clipboardStore.fragment[0].fragmentId === element.id && clipboardStore.fragment[0].type === 'cut'"
            :multiple="selectedFragments.length > 1"
            :duration="Number(element.duration)"
            :readonly="state.isReadonly"
            @on-contextmenu="handleContextmenu($event, element)"
            @on-select="handleSelect($event, element)"
          >
            <template #txt>
              <Character
                v-for="(item, index) in element.transcript"
                :key="index"
                :is-marked="element.tags[index] === null ? false : true"
                @on-select="handlePromoterSelect(element.id, index)"
                @on-update="handlePromoterUpdate(element.id, index, (element as Fragment).promoters[index])"
                @on-remove="handlePromoterRemove(element.id, index)"
                @on-locate="handleAnimeLocate((element as Fragment).promoters[index])"
              >
                <n-badge
                  color="#1989fa"
                  :value="element.tags[index] === null ? '' : element.tags[index]"
                  :max="9999"
                  :style="{ pointerEvents: 'none' }"
                >
                  <span class="character">{{ item }}</span>
                </n-badge>
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
            <!-- 移除片段 -->
            <template #delete>
              <n-popconfirm positive-text="确认" negative-text="取消"  @positive-click="handleRemove(element)">
                <template #trigger>
                  <n-icon :component="DeleteOutlined" :size="18" />
                </template>
                是否移除该片段 ?
              </n-popconfirm>
            </template>
          </AudioFragment>
        </template>
      </Draggable>
    </div>
    <!-- 底部 -->
    <Footer :height="200" :overflow-x="'unset'">
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
      <TTS v-if="state.recorderMode === 'TTS'" :readonly="state.isReadonly" @on-text-output="handleTextOutput"  />
      <ASR v-if="state.recorderMode === 'ASR'" :readonly="state.isReadonly" :shortcut="state.isFocus" @on-audio-output="handleAudioOutput" />
    </Footer>
    <!-- 下拉列表 -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdownState.x"
      :y="dropdownState.y"
      :options="dropdownState.options"
      :show="dropdownState.isShow"
      :on-clickoutside="() => dropdownState.isShow = false"
    />
  </div>
</template>

<style lang="scss" scoped>
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
  .character {
    color: v-bind('themeVars.textColor2');
  }
}
.footer {
  display: flex;
  flex-direction: column;
  background-color:  v-bind('themeVars.bodyColor');
  .toolbar-btn {
    padding: 2px 4px;
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
</style>./hooks/usePromoter