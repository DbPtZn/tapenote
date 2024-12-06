<script lang="ts" setup>
import { useMessage, useThemeVars } from 'naive-ui'
import TitleInput from './TitleInput.vue'
import { LibraryEnum } from '@/enums'
import { useEditor } from '@/views/creator/project/editor/hooks/_index'
import { computed, inject, onMounted, ref, useTemplateRef } from 'vue'
import { CourseData, Player } from '@/editor'
import { Editor } from '@textbus/editor'
import useStore from '@/store'
import { Subscription } from '@tanbo/stream'
import { onUnmounted } from 'vue'
import { watchOnce } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { Bridge } from '@/views/creator/project/bridge'

const bridge = inject('bridge') as Bridge
const props = defineProps<{
  id: string
  lib: LibraryEnum
  account: string
  hostname: string
}>()

const { projectStore, folderStore, recentStore } = useStore()
const themeVars = useThemeVars()
const message = useMessage()
// const editorWrapperRef = ref()
// const toolbarRef = ref()
// const controllerRef = ref()
// const toolbarWrapperRef = ref()
// const scrollerRef = ref()
// const editorRef = ref()
const editorWrapperEl = useTemplateRef<HTMLElement>('editorWrapperEl')
const toolbarEl = useTemplateRef<HTMLElement>('toolbarEl')
const editorEl = useTemplateRef<HTMLElement>('editorEl')
const controllerEl = useTemplateRef<HTMLElement>('controllerEl')
const toolbarWrapperEl = useTemplateRef<HTMLElement>('toolbarWrapperEl')
const scrollerEl = useTemplateRef<HTMLElement>('scrollerEl')
const coverEl = useTemplateRef<HTMLElement>('coverEl')

onMounted(() => {
  bridge.editorEl = editorEl.value
  bridge.scrollerEl = scrollerEl.value
  bridge.coverEl = coverEl.value
})

const data = computed(() => projectStore.get(props.id))
const subs: Subscription[] = []
let player: Player
let editor: Editor
let lastContent = ''
useEditor({
  id: props.id,
  lib: props.lib,
  account: props.account,
  hostname: props.hostname,
  editorWrapperRef: editorWrapperEl,
  editorRef: editorEl,
  scrollerRef: scrollerEl,
  toolbarRef: toolbarEl,
  controllerRef: controllerEl
}).then(({ editor: edi, content }) => {
  editor = edi
  lastContent = content
  bridge.setup(editor, props.lib)
  editor.readonly = true
  if (props.lib === LibraryEnum.COURSE) {
    player = editor.get(Player)
    subs.push(
      player.onStateUpdate.subscribe(() => {
        isPlaying.value = player.isPlaying
      })
    )
  }
})

const titleEditable = ref(false)

let isClicked = false
const handleTap = event => {
  if (!isClicked) {
    isClicked = true
    const timer = setTimeout(() => {
      isClicked = false
      clearTimeout(timer)
    }, 300)
  } else {
    // console.log('双击事件触发', event)
    if (props.lib === LibraryEnum.PROCEDURE) {
      return message.warning('目前移动 web 端不支持工程模块的编辑更新')
    }
    if (props.lib === LibraryEnum.COURSE) return
    bridge.handleEditable(true)
  }
}

subs.push(
  bridge.onEditable.subscribe(editable => {
    if (props.lib === LibraryEnum.PROCEDURE) {
      return message.warning('目前移动 web 端不支持工程模块的编辑更新')
    }
    if (props.lib === LibraryEnum.COURSE) return
    editor.readonly = !editable
    titleEditable.value = editable
  }),
  bridge.onSave.subscribe(() => {
    saveTitle()
    saveContent()
  })
)

const titleVal = ref(data.value?.title)
watchOnce(
  () => data.value?.title,
  () => {
    titleVal.value = data.value?.title
  }
)
const regexg = /[<>:"/\\|?*]/g
const regex = /[<>:"/\\|?*]/
function handleTitleInput(ev) {
  if (!titleVal.value) return
  if (regexg.test(titleVal.value)) {
    // 特殊标点符号如 "/" 可能会导致导出时将部分标题解析成目录
    message.warning('标题中不应包含以下任何字符：< > : " / \\ | ? *')
    titleVal.value = titleVal.value.replace(regex, '')
  }
}

async function saveTitle() {
  // console.log(titleVal.value)
  if (!titleVal.value || titleVal.value === data.value?.title) return
  try {
    const resp = await projectStore.updateTitle({ title: titleVal.value, id: props.id }, () => {}, props.account, props.hostname)
    // console.log('保存标题', resp)
    if (resp) {
      folderStore.updateCard(titleVal.value, props.id, 'title', data.value?.folderId)
      recentStore.updateCard(titleVal.value, props.id, 'title')
    } else {
      message.error('标题更新失败！')
    }
  } catch (error) {
    console.error(error)
    message.error('标题更新失败')
  }
}

async function saveContent() {
  const content = editor.getHTML()
  if (lastContent === content) return
  try {
    const resp = await projectStore.updateContent({ content, id: props.id }, () => {}, props.account, props.hostname)
    // console.log('保存内容', resp)
    // data.value!.isContentUpdating = false
    if (resp) {
      folderStore.updateCard(content, props.id, 'content', data.value?.folderId)
      recentStore.updateCard(content, props.id, 'content')
    } else {
      message.error('内容更新失败')
    }
  } catch (error) {
    console.error(error)
    message.error('内容更新失败')
  }
}

const isPlaying = ref(false)
const floatBtnIcon = computed(() => (isPlaying.value ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'))
async function handleFloatBtnClick() {
  // 如果播放器未装载数据源，则先装载数据
  if(!player.isLoaded) {
    const course = data.value
    if(!course) return
    // 音频换源
    const aud = new Audio()
    const result = aud.canPlayType('audio/ogg')
    if (result === '') course.audio = course.audio.replace('.ogg', '.mp3')
    // console.log('audio src:', course.audio)
    const courseData: CourseData = {
      audio: course.audio,
      duration: course.duration || 0,
      promoterSequence: course.promoterSequence,
      keyframeSequence: course.keyframeSequence,
      subtitleSequence: course.subtitleSequence,
      subtitleKeyframeSequence: course.subtitleKeyframeSequence
    }
    try {
      await player.loadData([courseData])
    } catch (error) {
      console.error('加载数据失败:', error)
      message.error('播放器装载数据失败')
    }
  }
  if (!player.isPlaying && !player.isPause) {
    player.start()
    isPlaying.value = true
    return
  }
  if (player.isPlaying && !player.isPause) {
    player.pause()
    isPlaying.value = false
    return
  }
  if (!player.isPlaying && player.isPause) {
    player.resume()
    isPlaying.value = true
    return
  }
}
const controlMethods = {
  handlePlay: () => {
    if (!player.isPlaying && !player.isPause) {
      player.start()
      isPlaying.value = true
      return
    }
    if (player.isPlaying && !player.isPause) {
      player.pause()
      isPlaying.value = false
      return
    }
    if (!player.isPlaying && player.isPause) {
      player.resume()
      isPlaying.value = true
      return
    }
  },
  handleRewind: () => {
    player.rewind()
  },
  handleForward: () => {
    player.forward()
  },
  handleSpeedDown: () => {
    player.speedDown()
  },
  handleSpeedUp: () => {
    player.speedUp()
  },
  handleReplay: () => {
    player.replay()
    isPlaying.value = true
  },
  handleStop: () => {
    player.stop()
    isPlaying.value = false
  },
  handleVolumeDown: () => {
    player.volumeDown()
  },
  handleVolumeUp: () => {
    player.volumeUp()
  }
}

const isMenuVisible = ref(false)
function handleSwipe(event: 'top' | 'bottom' | 'left' | 'right') {
  if (event === 'left') {
    // console.log('用户向左滑动')
    isMenuVisible.value = true
  } else if (event === 'right') {
    // console.log('用户向右滑动')
    isMenuVisible.value = false
  }
}

// const inputRef = ref<HTMLInputElement>()
// onMounted(() => {
//   console.log(inputRef.value)
//   if(inputRef.value) {
//     console.log(inputRef.value)
//     inputRef.value.style.color = 'red'
//   }
// })

onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
})
</script>

<template>
  <div ref="editorWrapperEl" class="root">
    <div ref="scrollerEl" class="scroller">
      <div class="container" v-touch:tap="handleTap" v-touch:swipe="handleSwipe">
        <input
          ref="inputEl"
          class="title-input"
          v-model="titleVal"
          type="text"
          :maxlength="200"
          placeholder="请输入标题"
          :disabled="!titleEditable"
          @input="handleTitleInput"
        />
        <div ref="editorEl" class="editor"></div>
      </div>
    </div>
  </div>
  <!-- 控制器按钮组 -->
  <n-float-button-group
    v-if="data?.lib === LibraryEnum.COURSE"
    :class="['mo-controller-group', isMenuVisible ? 'mo-controller-group-show' : 'mo-controller-group-hidden']"
    shape="circle"
    position="fixed"
  >
    <n-float-button @click="controlMethods.handleSpeedDown()">
      <Icon icon="material-symbols:keyboard-double-arrow-up-rounded" height="20px" />
    </n-float-button>
    <n-float-button @click="controlMethods.handleRewind()">
      <Icon icon="material-symbols:replay-5-rounded" height="20px" />
    </n-float-button>
    <n-float-button @click="controlMethods.handlePlay()">
      <Icon :icon="floatBtnIcon" height="24" />
    </n-float-button>
    <n-float-button @click="controlMethods.handleForward()">
      <Icon icon="material-symbols:forward-5-rounded" height="20px" />
    </n-float-button>
    <n-float-button @click="controlMethods.handleSpeedUp()">
      <Icon icon="material-symbols:keyboard-double-arrow-down-rounded" height="20px" />
    </n-float-button>
  </n-float-button-group>

  <!-- 控制器启动/暂停按钮 -->
  <n-float-button
    v-if="data?.lib === LibraryEnum.COURSE"
    v-show="!isMenuVisible"
    class="mo-controller"
    shape="circle"
    position="fixed"
    right="40px"
    bottom="40px"
    @click="handleFloatBtnClick"
  >
    <Icon :icon="floatBtnIcon" height="24" />
  </n-float-button>
</template>

<style lang="scss" scoped>
.title-input {
  width: 100%;
  border: none;
  font-size: 18px;
  color: v-bind('themeVars.textColor1');
  background-color: v-bind('themeVars.cardColor');
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
  box-sizing: border-box;
  padding: 12px 6px;
  outline: none;
  &:disabled {
    color: v-bind('themeVars.textColor1')!important;
  }
}
// :deep(.title-input) {
//   &:disabled {
//     color: v-bind('themeVars.textColor1')!important;
//   }
// }

.root {
  height: 100%;
  background-color: v-bind('themeVars.cardColor');
  display: flex;
  flex-direction: column;
}
.scroller {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: v-bind('themeVars.cardColor');
}
.container {
  height: 100%;
  width: 100%;
}
.editor {
  height: 100%;
  width: 100%;
  :deep(.textbus-container) {
    height: 100% !important;
    // margin: 0 auto;
    outline: none;
    border: none;
    border-radius: 0px;
    .textbus-ui-middle {
      border: none;
      width: 100%;
      // margin: 0 auto;
      background-color: v-bind('themeVars.cardColor');
    }
  }
}
.container {
  box-sizing: border-box;
  padding: 0 6px;
}

// ---------------------- controller ----------------------

.mo-controller-group {
  z-index: 1;
  opacity: 0.6;
  bottom: 15%;
  &:hover {
    opacity: 0.8;
  }
}
.mo-controller-group-show {
  right: 30px;
  animation: bounceInRight 0.5s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.mo-controller-group-hidden {
  right: -100px;
  // animation: fadeInRight 0.5s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.mo-controller {
  z-index: 1;
  opacity: 0.6;
  &:hover {
    opacity: 0.8;
  }
}
input {
  &:disabled {
    color: v-bind('themeVars.textColor1');
    // font-weight: 600;
    text-shadow:none;
    opacity: 1;
    filter: brightness(100%);
    -webkit-filter: brightness(150%);
    filter: contrast(200%);
  }
}
input[type="text"] {
  &:disabled {
    color: v-bind('themeVars.textColor1');
    opacity: 1;
    filter: none;
  }
}
</style>
