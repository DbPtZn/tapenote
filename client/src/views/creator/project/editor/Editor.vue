<script lang="ts" setup>
import '@textbus/editor/bundles/textbus.min.css'
import { useThemeVars, useMessage, useLoadingBar } from 'naive-ui'
import { TitleInput } from './private'
import { useToolbarResize } from '../../_hooks'
import { computed, inject, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useEditor } from './hooks/_index'
import _ from 'lodash'
import useStore from '@/store'
import { debounceTime, Subscription } from '@tanbo/stream'
import { Editor } from '@textbus/editor'
import { Bridge } from '../bridge'
import { LibraryEnum } from '@/enums'
import { Player } from '@/editor'
import { Input } from '@textbus/platform-browser'
const bridge = inject('bridge') as Bridge
const props = defineProps<{
  id: string,
  lib: LibraryEnum
  account: string
  hostname: string
  readonly: () => boolean
}>()
const { projectStore, folderStore } = useStore()
const themeVars = useThemeVars()
// const loadingBar = useLoadingBar()
const message = useMessage()
const rootRef = ref()
const toolbarRef = ref()
const controllerRef = ref()
const toolbarWrapperRef = ref() 
const scrollerRef = ref()
const editorRef = ref()
const subs: Subscription[] = []
const data = computed(() => projectStore.get(props.id))
const state = reactive({
  isToolbarShow: true,
  isDrawShow: false,
  isSaving: false,
  toolbarHeight: 50, // 基于顶部固定工具条的高度调整滚动区的高度
  editorWidth: computed(() => bridge.habit.state.platform.width),
  isSubtitleShow: true, //computed(() => bridge.habit.state.subtitle.isShow),
  subtitle: ''
})
onBeforeMount(() => {
  // loadingBar.start() // 加载条开始
})
onMounted(() => {
  // loadingBar.finish()
})
let player: Player
let editor: Editor
let lastContent = ''
useEditor({
  id: props.id,
  lib: props.lib,
  account: props.account,
  hostname: props.hostname,
  rootRef: rootRef,
  editorRef: editorRef,
  scrollerRef: scrollerRef,
  toolbarRef: toolbarRef,
  controllerRef: controllerRef,
  bridge: bridge,
}).then(({ editor: edi, content }) => {
  // loadingBar.finish() // 加载条完成
  editor = edi
  lastContent = content
  if(props.lib !== LibraryEnum.COURSE) {
    subs.push(
      editor.onChange.subscribe((ev) => {
        if(props.readonly()) return
        const content = editor.getHTML()
        if(lastContent === content) return
        handleContentInput(content, props.id)
        lastContent = content
      })
    )
  }
  if(props.lib === LibraryEnum.COURSE) {
    player = edi.get(Player)
    subs.push(
      player.onSubtitleUpdate.subscribe(() => {
        state.subtitle = player.subtitle
      })
    )
  }
  bridge.setup(editor, props.lib, editorRef.value, scrollerRef.value)
}).catch(err => {
  console.log(err)
  message.error('项目打开失败！')
})

if (props.lib !== LibraryEnum.COURSE) {
  subs.push(
    /** 工具条缩放 */
    useToolbarResize(toolbarWrapperRef).pipe(debounceTime(500)).subscribe(args => {
      state.toolbarHeight = args.height
    }),
    /** 工具条折叠 */
    bridge.onToolbarCollapse.subscribe(() => {
      state.isToolbarShow = !state.isToolbarShow
    })
  )
}

/** 更新只读模式 */
// watch(() => props.readonly(), (isReadOnly) => {
//   editor.readonly = isReadOnly
// })

const methods = {
  /** 文件更新同步 */
  handleSavingStart() {
    bridge.handleSaveStart()
  },
  handleSavingEnd() {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        bridge.handleSaveEnd()
        resolve(true)
        clearTimeout(timer)
      }, 1000)
    })
  },
  handleTitleInput(value: string, id: string) {
    projectStore.updateTitle({ title: value, id: id }, handleSavingStart, props.account, props.hostname).then(res => {
      if (res) {
        handleSavingEnd()
        folderStore.updateCard(value, id, 'title', data.value?.folderId)
      } else {
        handleSavingEnd()
          .then(() => message.error('更新失败！'))
          .catch()
      }
    }).catch(err => {
      message.error('更新失败:' + err)
    })
  },
  handleContentInput(value: string, id: string) {
    projectStore.updateContent({ content: value, id: id }, handleSavingStart, props.account, props.hostname).then(res => {
      if (res) {
        handleSavingEnd()
        folderStore.updateCard(value, id, 'content', data.value?.folderId)
      } else {
        handleSavingEnd()
          .then(() => message.error('更新失败！'))
          .catch()
      }
    }).catch(err => {
      message.error('更新失败:' + err)
    })
  },
  /** 标题输入时按下 enter 将焦点切换到编辑器 */
  handleTitleEnter() {
    editor.focus()
  }
}

const { handleContentInput, handleSavingEnd, handleTitleInput, handleSavingStart, handleTitleEnter } = methods

/** 离开页面前 */
onBeforeUnmount(() => {
  //
})

/** 离开页面 */
onUnmounted(() => {
  try {
    editor?.destroy()
    subs.forEach(sub => sub.unsubscribe())
  } catch (error) {
    message.error('编辑器创建失败！')
  }
})

</script>

<template>
  <div ref="rootRef" :class="['editor-wrapper', lib === LibraryEnum.COURSE && 'player-wrapper']">
    <div class="main" :style="{ flexDirection: lib === LibraryEnum.COURSE ? 'row' : 'column' }">
      <!-- 工具条 -->
      <div v-if="lib !== LibraryEnum.COURSE" ref="toolbarWrapperRef">
        <div
          ref="toolbarRef"
          class="toolbar"
          :style="{
            transform: state.isToolbarShow ? 'translateY(0)' : 'translateY(-1)',
            opacity: state.isToolbarShow ? '1' : '0',
            maxHeight: state.isToolbarShow ? '1000px' : '0',
            zIndex: state.isToolbarShow ? 1 : -10,
            borderBottomWidth: state.isToolbarShow ? '1px' : '0px',
          }"
        />
      </div>
      <!-- 滚动区 -->
      <div ref="scrollerRef" class="scroller" :style="{ height: `calc(100vh - ${state.toolbarHeight}px)` }">
        <TitleInput @input="handleTitleInput($event, id)" @enter="handleTitleEnter" :value="data?.title" :max-width="state.editorWidth" :readonly="props.readonly()" />
        <div ref="editorRef" :class="['editor', props.readonly() ? 'editor-disabled' : '']" />
      </div>
    </div>
    <div
      v-show="lib !== LibraryEnum.NOTE"
      ref="controllerRef" 
      :class="[
        `${lib === LibraryEnum.COURSE ? 'course-controller': ''}`, 
        `${lib === LibraryEnum.PROCEDURE ? 'procedure-controller': ''}`, 
        props.readonly() ? 'controller-disabled' : ''
      ]" 
      />
    <div v-if="lib === LibraryEnum.COURSE && state.isSubtitleShow" class="subtitle">
      {{ state.subtitle }}
    </div>
  </div>
  
</template>

<style lang="scss" scoped>
.procedure-controller {
  width: 100%;
}
.course-controller {
  position: absolute;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  z-index: 1;
  word-wrap: break-word;
}
.editor-disabled {
  pointer-events: none;
}
.player-wrapper {
  scale: 1;
}
.editor-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  // border-right: 1px solid v-bind('themeVars.dividerColor');
  // border-bottom: 1px solid v-bind('themeVars.dividerColor');
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
  align-items: center;
  width: 100%;
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
  background-color:  v-bind('themeVars.bodyColor');
  min-height: 42px;

  .top-nav {
    height: 100%;
    width: 100%;
    .saving {
      display: flex;
      align-items: center;
    }
    .top-nav-btn {
      display: flex;
      align-items: center;
    }
    &:last-child {
      margin-right: 12px;
    }
  }
}
.main {
  flex: 1;
  width: 100%;
  // 这里如果隐藏，会导致工具条下拉菜单被遮挡
  // overflow-y: hidden;
  // overflow-x: hidden;
  .toolbar {
    position: relative;
    width: 100%;
    max-height: 47px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition: all 0.2s ease-in-out;
    z-index: 1;
    word-wrap: break-word;
    border-bottom: 1px solid v-bind('themeVars.dividerColor');
  }
  .scroller {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-y: auto;
    // background-color: v-bind('themeVars.cardColor');
    background-color:  v-bind('themeVars.bodyColor');
  }
  .editor {
    height: 100%;
    :deep(.textbus-container) {
      height: 100% !important;
      margin: 0 auto;
      outline: none;
      border: none;
      border-radius: 0px;
      .textbus-ui-middle {
        border: none;
        max-width: v-bind('state.editorWidth');
        width: 100%;
        margin: 0 auto;
        // background-color: v-bind('themeVars.cardColor');
        background-color:  v-bind('themeVars.bodyColor');
      }
    }
  }
}

.subtitle {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);

  color: v-bind('themeVars.textColor1');
  font-size: 24px;
}

/** 定制滚动条 */
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  // background-color: unset;
  background-color:  v-bind('themeVars.bodyColor');
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: unset;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: unset;
  background-color: unset;
}
</style>
