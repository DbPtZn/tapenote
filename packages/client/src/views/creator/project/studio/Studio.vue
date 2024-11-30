<script lang="ts" setup>
import { Character, AudioFragment, TTS, ASR, TipBtn, StudioToolbar, SpeakerSelectList, TxtEdit, FragmentTrash, CreateBlankFragment } from './private'
import useStore from '@/store'
import { VNode, computed, h, inject, nextTick, onMounted, onUnmounted, reactive, ref, useTemplateRef, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { DropdownGroupOption, DropdownOption, MenuOption, MessageReactive, NIcon, NMessageProvider, PopoverInst, SelectOption, useDialog, useMessage, useThemeVars } from 'naive-ui'
import { Bridge } from '../bridge'
import _ from 'lodash'
import utils from '@/utils'
import { useFragment, usePromoter, useRecorder, checkSilenceAudio, useInput, useTrash, useSpeech } from './hooks'
import { Subscription, auditTime } from '@tanbo/stream'
import { LibraryEnum } from '@/enums'
import { Voice, Delete, Interpreter, ArrowDropDown, CommentAdd, FileImport, TextT24Filled } from '@/components'
// import { DeleteOutlined, EditOutlined, HeadsetOutlined, AddReactionSharp, KeyboardOutlined } from '@vicons/material'
import { splitText, collapseText, containsEnglish } from './_utils'
import { VueDraggable } from 'vue-draggable-plus'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { formatTimeToMinutesSecondsMilliseconds } from './_utils/formatTime'
import Delegater from './Delegater.vue'
import Station from './Station.vue'
import Setting from './Setting.vue'
import { StudioService } from '@/editor'

type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]
type Speaker = ReturnType<typeof useStore>['speakerStore']['data'][0]
type Option = { key: string, label: string, active: () => boolean, props: { onClick: (MouseEvent, key: string) => void } } & MenuOption

const bridge = inject('bridge') as Bridge
const props = defineProps<{
  id: string
  lib: LibraryEnum
  account: string
  hostname: string
  focus: boolean
  readonly: boolean
}>()
const { projectStore, clipboardStore } = useStore()
const message = useMessage()
const dialog = useDialog()
const themeVars = useThemeVars()
const { t } = useI18n()
const scrollerEl = useTemplateRef<HTMLElement>('scrollerEl')

const state = reactive({
  isReadonly: computed(() => props.readonly),
  isFocus: computed(() => props.focus),
  isShortcutAllow: true,
  isTotalDurationShow: false
})
const studioEl = useTemplateRef<HTMLElement>('studioEl')

onMounted(() => {
  bridge.studioEl = studioEl.value
  bridge.studioScrollerEl = scrollerEl.value
})

let isScrollToBottom = true
watch(
  () => projectStore.fragment(props.id).getBySort(),
  fragmentsData => {
    if (fragmentsLength.value < fragmentsData.length && isScrollToBottom) {
      nextTick(() => {
        // 新增片段时，将滚动条滚动到底部
        if(scrollerEl.value) scrollerEl.value.scrollTop = scrollerEl.value.scrollHeight
      })
    }
    fragments.value = fragmentsData
  }
)

const {
  recorderMode,
  ttsSpeed,
  speaker,
  isAudioInputting,
  inputtingDuration,
  speedOptions,
  handleTextOutput,
  handleAudioOutput,
  handleInputting,
  handleAddBlank,
  handleModeSwitch,
  handleSpeakerChange
} = useInput(props.id, props.account, props.hostname, bridge)
const { removedFragments, handleTrashManage } = useTrash(props.id, props.account, props.hostname)
const { checkAnimeState, checkPromoter, handleReorder } = usePromoter(props.id, bridge)
const {
  dropdownState,
  selectedFragments,
  playerState,
  playingFragmentId,
  isShowOrder,
  onPlayerStateUpdate,
  handlePreview,
  handleContextmenu,
  handleExpand,
  handleSelect,
  handlePlay,
  handleEdit,
  handleRemove,
  handleMove,
  handleRebuild,
  handleDownload
} = useFragment(props.id, bridge, checkAnimeState, () => isScrollToBottom = false, () => isScrollToBottom = true)

const fragments = ref<Fragment[]>(projectStore.fragment(props.id).getBySort())
const fragmentsLength = computed(() => fragments.value.length)



/** 编辑器挂载完成后校验启动子和动画标记 */
const subs: Subscription[] = []
const subscription = bridge.onEditorReady.pipe(auditTime(100)).subscribe(editor => {
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
  const studioService = editor.get(StudioService)
  subs.push(
    studioService.onTextToSpeech.subscribe(txt => {
      handleTextOutput(txt)
    })
  )
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

const isStartedRecorder = ref(false)
const stationMethods = {
  handleStart() {
    isStartedRecorder.value = true
  },
  handleEnd() {
    // console.log('handleEnd')
    isStartedRecorder.value = false
    checkPromoter()
  },
  // 产生片段后进行启动子检查
  handleOutput() {
    checkPromoter()
  }
}

const isShowName = ref(false)
const isStationVisible = ref(false)

const activeBtns = reactive<string[]>([])
const options = reactive<Option[]>([
  {
    key: 'speech',
    icon: () => h(Icon, { icon: 'carbon:ibm-watson-text-to-speech' }),
    label: '长录制模式',
    active: () => activeBtns.includes('speech'),
    props: {
      onClick: (ev: MouseEvent, key?: string) => {
        if (playerState.isPlaying) return message.warning('播放中请尽量不要进行其它操作')
        useSwitchBtn(key)
        isStationVisible.value = !isStationVisible.value
      }
    }
  },
  {
    key: 'autofit',
    icon: () => h(Icon, { icon: 'tabler:arrow-autofit-down' }),
    label: '自动切换动画块',
    active: () => activeBtns.includes('autofit'),
    props: {
      onClick: (ev: MouseEvent, key?: string) => {
        if (playerState.isPlaying) message.warning('播放中请尽量不要进行其它操作')
        const isOpen = useSwitchBtn(key)
        bridge.handleAutoMoveAnimePointer(isOpen)
      }
    }
  },
  {
    key: 'tag-hide',
    icon: () => h(Icon, { icon: 'material-symbols:hide-source-outline-rounded' }),
    label: '隐藏动画标记',
    active: () => activeBtns.includes('tag-hide'),
    props: {
      onClick: (ev: MouseEvent, key?: string) => {
        useSwitchBtn(key)
        bridge.animeProvider?.hideAnimeBadge()
      }
    }
  },
  {
    key: 'anime-hide',
    icon: () => h(Icon, { icon: 'fluent:slide-hide-24-filled' }),
    label: '隐藏动画元素',
    active: () => activeBtns.includes('anime-hide'),
    props: {
      onClick: (ev: MouseEvent, key?: string) => {
        useSwitchBtn(key)
        bridge.animeProvider?.hideAnimeElement()
      }
    }
  },
  {
    key: 'preview',
    icon: () => h(Icon, { icon: 'majesticons:presentation-play-line' }), // pajamas:live-preview
    label: '播放预览',
    active: () => activeBtns.includes('preview'),
    props: {
      onClick: (ev: MouseEvent, key?: string) => {
        if (playerState.isPlaying) return message.warning('请先停止当前播放任务')
        if (fragments.value.length === 0) return message.warning('无可播放数据')
        handlePreview()
        if(isStationVisible.value) {
          isStationVisible.value = false
          const sub = onPlayerStateUpdate.subscribe(state => {
            if(!state) {
              isStationVisible.value = true
              sub.unsubscribe()
            }
          })
        }
      }
    }
  },
  {
    key: 'refresh',
    icon: () => h(Icon, { icon: 'material-symbols:refresh' }),
    label: '更新标记',
    active: () => activeBtns.includes('refresh'),
    props: {
      onClick: (ev: MouseEvent, key?: string) => {
        dialog.create({
          title: '更新标记',
          content: '是否检查并更新标记信息？',
          positiveText: '更新',
          negativeText: '取消',
          onPositiveClick: () => {
            checkPromoter()
          },
          onNegativeClick: () => {
            message.info('已取消')
          }
        })
      }
    }
  },
  // {
  //   key: 'bgm',
  //   icon: () => h(Icon, { icon: 'material-symbols:library-music' }),
  //   label: '背景音乐',
  //   active: () => activeBtns.includes('bgm'),
  //   disabled: true,
  //   props: {
  //     onClick: (ev: MouseEvent, key?: string) => {
  //     }
  //   }
  // },
  {
    key: 'showname',
    icon: () => h(Icon, { icon: 'mingcute:user-visible-fill' }),
    label: '显示角色名称',
    active: () => activeBtns.includes('showname'),
    props: {
      onClick: (ev: MouseEvent, key?: string) => {
        useSwitchBtn(key)
        isShowName.value = !isShowName.value
        // console.log('active', activeBtns)
      }
    }
  },
  {
    key: 'showorder',
    icon: () => h(Icon, { icon: 'icon-park-solid:recent-views-sort' }),
    label: '显示片段排序',
    active: () => activeBtns.includes('showorder'),
    props: {
      onClick: (ev: MouseEvent, key?: string) => {
        // console.log(ev)
        useSwitchBtn(key)
        isShowOrder.value = !isShowOrder.value
      }
    }
  },
  // {
  //   key: 'language',
  //   icon: () => h(Icon, { icon: 'material-symbols:translate' }),
  //   label: '语言',
  //   disabled: true,
  //   active: () => activeBtns.includes('language'),
  //   props: {
  //     onClick: (ev: MouseEvent, key?: string) => {
  //     }
  //   }
  // },
  {
    key: 'reorder',
    icon: () => h(Icon, { icon: 'mdi:sort' }),
    label: '标记重排序',
    active: () => activeBtns.includes('reorder'),
    props: {
      onClick: (ev: MouseEvent, key?: string) => {
        if (playerState.isPlaying) return message.warning('播放中请尽量不要进行其它操作')
        dialog.create({
          title: '重排序',
          content: '是否确定对动画块的编号按照自上而下的顺序进行重新排序？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            handleReorder()
          },
          onNegativeClick: () => {
            message.info('已取消')
          }
        })
      }
    }
  },
  // {
  //   key: 'setting',
  //   icon: () => h(Icon, { icon: 'material-symbols-light:settings' }),
  //   label: '设置',
  //   active: () => activeBtns.includes('setting'),
  //   props: {
  //     onClick: (ev: MouseEvent, key?: string) => {
  //       dialog.create({
  //         title: '设置',
  //         icon: () => h(Icon, { icon: 'material-symbols-light:settings' }),
  //         content: () => h(Setting),
  //       })
  //     }
  //   }
  // },
])
const collapseOptions = reactive<DropdownOption[]>([])
function useSwitchBtn(item: string | undefined) {
  if (!item) return false
  if (activeBtns.includes(item)) {
    const index = activeBtns.findIndex(i => i === item)
    if (index !== -1) activeBtns.splice(index, 1)
    return false
  }
  activeBtns.push(item)
  return true
}

const dropdownEl = ref<PopoverInst>()
function renderOption (props: { node: VNode, option: DropdownOption }) {
  const { option } = props
  return h('div', {
    class: { 'dropdown-option': true, 'dropdown-option-disabled': option.disabled },
    style: {
      color: (option as any).active?.() ? '#409eff' : themeVars.value.textColor1,
      cursor: option.disabled ? 'not-allowed' : 'pointer'
    },
    onClick: (ev) => {
      (option as any).props?.onClick?.(ev, option.key)
    }
  }, [
    h('span', {}, [option.icon?.()]),
    h('span', { style: { marginLeft: '8px' } }, { default: () => option.label })
  ])
}

const headerEl = useTemplateRef<HTMLElement>('headerEl')
const boundarySequence = Array.from({ length: options.length }).map((_, i) => (i + 1) * 40)
// console.log(boundarySequence)
const calculateThreshold = options.length * 40 + 40 // 开始计算的阈值 (+40 是留给返回时的计算)
// console.log(calculateThreshold)
const resizeObserver = useResizeObserver(headerEl, entries => {
  const entry = entries[0]
  const { width } = entry.contentRect
  const toolbarWidth = width - 78 - 40
  // console.log(toolbarWidth)
  if (toolbarWidth < calculateThreshold) {
    // const count = Math.floor((toolbarWidth - 40) / 40)
    // console.log(count, options.length)
    if (toolbarWidth < boundarySequence[options.length - 1]) {
      const opt = options.pop() as any
      opt && collapseOptions.unshift(opt)
    }
    for (let i = 0; i < boundarySequence.length; i++) {
      if (toolbarWidth < boundarySequence[i]) {
        if (options[i]) {
          const opt = options.pop()
          opt && collapseOptions.unshift(opt)
        }
      } else {
        if (!options[i]) {
          if (collapseOptions.length > 0) {
            const opt = collapseOptions.shift() as any
            opt && options.splice(i, 0, opt)
            i--
          }
        }
      }
    }
  }
})

onUnmounted(() => {
  resizeObserver.stop()
  subs.forEach(sub => sub.unsubscribe())
  subscription.unsubscribe()
})
</script>
<template>
  <div class="studio" ref="studioEl">
    <!-- 顶部 -->
    <div ref="headerEl" class="header" :style="{ height: `47px` }">
      <div class="timer" @click="state.isTotalDurationShow = !state.isTotalDurationShow">
        <span v-if="!state.isTotalDurationShow && !playerState.isPlaying">录音台</span>
        <TipBtn tip="播放时长" v-if="playerState.isPlaying">
          <div>
            <Icon icon="material-symbols:timer-play-rounded" />
            <span>{{ utils.durationFormat(playerState.currentTime) }}</span>
          </div>
        </TipBtn>
        <TipBtn tip="总时长" v-if="state.isTotalDurationShow && !playerState.isPlaying">
          <div>
            <Icon icon="material-symbols:timer-rounded" />
            <span>{{ utils.durationFormat(totalDuration) }}</span>
          </div>
        </TipBtn>
      </div>
      <div class="btn-group">
        <div
          :class="{ btn: true, active: option.active(), disabled: option.disabled }"
          v-for="option in options"
          @click="option.props.onClick($event, option.key)"
        >
          <TipBtn :tip="option.label" :delay="500">
            <component :is="option.icon" />
          </TipBtn>
        </div>
        <n-dropdown
          ref="dropdownEl"
          trigger="hover"
          :to="headerEl || 'body'"
          :options="collapseOptions"
          :disabled="state.isReadonly"
          :render-option="renderOption"
        >
          <div class="btn" v-show="collapseOptions.length > 0">
            <Icon icon="material-symbols:more-horiz" />
          </div>
        </n-dropdown>
      </div>

      <!-- <div style="width: 24px;" /> -->
      <!-- <strong :class="[state.isReadonly ? 'disabled' : '']" style="white-space: nowrap; user-select: none;" @click="isTotalDurationShow = !isTotalDurationShow">
        <span v-if="!isTotalDurationShow && !playerState.isPlaying" style="display: inline-block; min-width: 72px;">录音台</span>
        <span v-if="isTotalDurationShow && !playerState.isPlaying" style="display: inline-block; min-width: 72px;">{{ utils.durationFormat(totalDuration) }}</span>
        <span v-if="playerState.isPlaying" style="display: inline-block; min-width: 72px;">{{ utils.durationFormat(playerState.currentTime) }}</span>
      </strong> -->
      <!-- <n-dropdown trigger="click" :options="studioOptions" :disabled="state.isReadonly">
        <n-button class="arrow" text size="small" :disabled="state.isReadonly">
          <template #icon>
            <n-icon :component="ArrowDropDown" :size="24"/>
          </template>
        </n-button>
      </n-dropdown> -->
    </div>
    <!-- 主展示区 -->
    <div ref="scrollerEl" class="main" @contextmenu="handleContextmenu">
      <Delegater :id="id" :allow-select-anime="!isStartedRecorder">
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
            :is-loading="!!element.processing"
            :is-playing="element.id === playingFragmentId"
            :is-show-name="isShowName"
            :is-cut="clipboardStore.fragment.length > 0 && clipboardStore.fragment[0].fragmentId === element.id && clipboardStore.fragment[0].type === 'cut'"
            :rebuild="!!element.key && !element.audio && !!element.error"
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
              <n-spin v-if="!!element.key  && !element.audio" size="small" />
            </template>
            <template #rebuild>
              <Icon v-if="!!element.key && !element.audio && !!element.error" icon="material-symbols:sync-rounded" height="20" @click="handleRebuild(element)" />
            </template>
            <!-- 播放音频 -->
            <template #play>
              <Icon v-if="(!element.key || !!element.error) && !playerState.isPlaying" :icon="element.id === playingFragmentId ? 'iconamoon:player-stop-fill' : 'ic:baseline-headset'" height="18" @click="handlePlay(element)" />
            </template>
            <!-- 编辑文字 -->
            <template #edit>
              <Icon v-if="(!element.key || !!element.error) && !playerState.isPlaying" icon="material-symbols:edit-rounded" height="18" @click="handleEdit(element)" />
            </template>
            <!-- 移除片段 （可以优化，不用每个片段都创建一个实例） -->
            <template #delete>
              <n-popconfirm v-if="(!element.key || !!element.error) && !playerState.isPlaying" :positive-text="t('confirm')" :negative-text="t('cancel')" @positive-click="handleRemove(element)">
                <template #trigger>
                  <Icon icon="material-symbols:delete-rounded" height="18" />
                </template>
                {{ t('studio.msg.whether_remove_fragment') }}
              </n-popconfirm>
            </template>
            <template #download>
              <Icon v-if="!!element.key && !element.audio && !!element.error" icon="material-symbols:download-rounded" height="18" @click="handleDownload(element)" />
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
          <n-popover
            trigger="hover"
            content-style="width: 60px;height: 80px;padding: 6px 0px 0px;display: flex;align-items: center;justify-content: center;"
            :disabled="state.isReadonly"
          >
            <template #trigger>
              <n-button class="toolbar-btn" quaternary size="small" :disabled="state.isReadonly">
                <template #icon>
                  <div class="speaker-avatar">
                    <img :src="speaker?.avatar" :alt="speaker?.name" @click="handleSpeakerChange(recorderMode === 'ASR' ? 'human' : 'machine')" />
                  </div>
                </template>
              </n-button>
            </template>
            <div class="role" :style="{ width: '60px', height: '70px', cursor: 'pointer' }">
              <img
                class="role-avatar"
                :src="speaker?.avatar"
                :alt="speaker?.name"
                :style="{ width: '50px', height: '50px', objectFit: 'contain' }"
                @error="e => ((e.target! as HTMLImageElement).src = './avatar03.png')"
                @click="handleSpeakerChange(recorderMode === 'ASR' ? 'human' : 'machine')"
              />
              <span class="role-name">{{ speaker?.name || '' }}</span>
            </div>
          </n-popover>
        </template>
        <template #right>
          <!-- 语速选择 -->
          <n-popselect v-if="recorderMode === 'TTS'" v-model:value="ttsSpeed" :options="speedOptions" placement="top" trigger="click">
            <n-button class="toolbar-btn" ghost size="small" :style="{ width: '50px' }" :disabled="state.isReadonly">
              {{ `${ttsSpeed === 1 ? '语速' : `${ttsSpeed}x`}` }}
            </n-button>
          </n-popselect>
          <!-- 导入音频文件 -->
          <n-button class="toolbar-btn" quaternary size="small" :disabled="true">
            <template #icon>
              <n-icon :component="FileImport" :size="24" />
            </template>
          </n-button>
          <!-- 创建空白片段 -->
          <n-button class="toolbar-btn" quaternary size="small" :disabled="state.isReadonly" @click="handleAddBlank">
            <template #icon>
              <n-icon :component="CommentAdd" :size="24" />
            </template>
          </n-button>
          <!-- 模式切换 -->
          <n-button class="toolbar-btn" quaternary size="small" :disabled="state.isReadonly" @keydown.prevent="" @click="handleModeSwitch">
            <template #icon>
              <n-icon :component="recorderMode === 'TTS' ? Voice : TextT24Filled" :size="24" />
            </template>
          </n-button>
          <!-- 回收站 -->
          <n-button class="toolbar-btn" quaternary size="small" :disabled="state.isReadonly" @click="handleTrashManage">
            <template #icon>
              <n-icon :component="Delete" :size="24" />
            </template>
          </n-button>
        </template>
      </StudioToolbar>
      <!-- 输入区 -->
      <div class="input-area" v-show="recorderMode === 'TTS' && !isStartedRecorder">
        <TTS :readonly="state.isReadonly" @output="handleTextOutput" />
      </div>
      <div class="input-area" v-show="recorderMode === 'ASR' && !isStartedRecorder">
        <ASR
          :readonly="state.isReadonly"
          :shortcut="state.isShortcutAllow && state.isFocus"
          @output="handleAudioOutput"
          @inputting="handleInputting"
        />
      </div>
      <div v-show="state.isFocus" class="shortcut">
        <n-popover trigger="hover" placement="bottom">
          <template #trigger>
            <Icon
              @click="state.isShortcutAllow = !state.isShortcutAllow"
              :icon="state.isShortcutAllow ? 'material-symbols:keyboard-outline-rounded' : 'material-symbols:keyboard-off-outline-rounded'"
              :height="24"
            />
          </template>
          <span>{{ state.isShortcutAllow ? 'Ctrl + Number0' : '快捷键已禁用' }}</span>
        </n-popover>
      </div>
      <div v-if="isAudioInputting" class="recording">
        <div class="recording-content">
          <Icon class="icon" icon="ic:sharp-settings-voice" height="64px" />
          <span class="text">正在录音</span>
          <span class="text">（不超过60秒）</span>
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
      :options="dropdownState.options"
      :show="dropdownState.isShow"
      :on-clickoutside="() => (dropdownState.isShow = false)"
    />
    <Station
      v-if="isStationVisible"
      :id="id"
      :account="account"
      :hostname="hostname"
      @start="stationMethods.handleStart"
      @end="stationMethods.handleEnd"
      @output="stationMethods.handleOutput"
    />
  </div>

</template>

<style lang="scss" scoped>

:deep(.dropdown-option) {
  user-select: none;
  display: flex;
  align-items: center;
  padding: 8px 8px;
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
  }
  span {
    display: flex;
    align-items: center;
  }
}
:deep(.dropdown-option-disabled) {
  opacity: 0.5;
}
.speaker-avatar {
  width: 24px;
  height: 24px;
  img {
    width: 24px;
    height: 24px;
    border-radius: 3px;
    object-fit: fill;
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
  // border-left: 1px solid v-bind('themeVars.dividerColor');
  background-color: v-bind('themeVars.bodyColor');
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
  justify-content: space-between;
  align-items: center;
  // font-size: 24px;
  overflow: hidden;
  box-sizing: border-box;
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
  .arrow {
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
    cursor: pointer;
  }
  &:hover {
    .arrow {
      opacity: 1;
    }
  }
  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .active {
    background-color: v-bind('themeVars.buttonColor2');
  }
  .timer {
    user-select: none;
    width: fit-content;
    display: flex;
    justify-content: center;
    margin-left: 8px;
    font-size: 16px;
    // background-color: v-bind('themeVars.buttonColor2');
    padding: 4px;
    border-radius: 3px;
    div {
      display: flex;
      align-items: center;
      span {
        margin-left: 4px;
      }
    }
  }
  .btn-group {
    // flex: 1;
    display: flex;
    flex-direction: row;
    .btn {
      cursor: pointer;
      font-size: 24px;
      user-select: none;
      display: flex;
      align-items: center;
      padding: 4px;
      margin: 4px;
      border-radius: 3px;
      // background-color: v-bind('themeVars.buttonColor2');
      &:hover {
        background-color: v-bind('themeVars.buttonColor2Hover');
      }
      &:active {
        background-color: v-bind('themeVars.buttonColor2Pressed');
      }
      &:last-child {
        margin-right: 8px;
      }
      svg {
        outline: none;
      }
    }
  }
}
.main {
  position: relative;
  width: 100%;
  display: flex;
  flex: 1;
  box-sizing: border-box;
  // background-color: v-bind('themeVars.cardColor');
  background-color: v-bind('themeVars.bodyColor');
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
  background-color: v-bind('themeVars.bodyColor');
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
