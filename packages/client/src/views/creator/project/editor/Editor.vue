<script lang="ts" setup>
import '@textbus/editor/bundles/textbus.min.css'
import { useThemeVars, useMessage } from 'naive-ui'
import { TitleInput } from './private'
import { useToolbarResize } from '../../_hooks'
import { computed, inject, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useEditor, useMemo } from './hooks/_index'
import _ from 'lodash'
import useStore from '@/store'
import Memo from './Memo.vue'
// import { debounceTime, Subscription } from '@tanbo/stream'
import { Editor, Layout } from '@textbus/editor'
import { Bridge } from '../bridge'
import { LibraryEnum } from '@/enums'
import { MemoProvider, MessageService, Player } from '@/editor'
import { Subscription, debounceTime } from '@textbus/core'
const bridge = inject('bridge') as Bridge
const props = defineProps<{
  id: string,
  lib: LibraryEnum
  account: string
  hostname: string
  readonly: () => boolean
}>()
const { projectStore, folderStore, userStore } = useStore()
const themeVars = useThemeVars()
// const loadingBar = useLoadingBar()
const message = useMessage()
const rootRef = ref()
const toolbarRef = ref()
const controllerRef = ref()
const toolbarWrapperRef = ref() 
const scrollerRef = ref()
bridge.scrollerEl = scrollerRef
const editorRef = ref()
const subs: Subscription[] = []
const data = computed(() => projectStore.get(props.id))
const state = reactive({
  isToolbarShow: true,
  isChangeByReadonly1: false,
  isChangeByReadonly2: false,
  isReadonly: computed(() => props.readonly()),
  isDrawShow: false,
  isSaving: false,
  toolbarHeight: 50, // 基于顶部固定工具条的高度调整滚动区的高度
  editorWidth: computed(() => bridge?.habit!.state.platform.width),
  isSubtitleShow: true, //computed(() => bridge.habit.state.subtitle.isShow),
  subtitle: ''
})
const autosave = computed(() => userStore.config.autosave) // 自动保存
const saveInterval = computed(() => userStore.config.saveInterval) // 自动保存的间隔

onBeforeMount(() => {
  // loadingBar.start() // 加载条开始
})
onMounted(() => {
  // loadingBar.finish()
})

// 当 readonly 状态改变时，editor onChange 也会监听到，设置 isChangeByReadonly1/2 为 true, 阻止两个 editor onChange 的事务
watch(() => state.isReadonly, (is) => {
  state.isChangeByReadonly1 = true
  state.isChangeByReadonly2 = true
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
  const memoProvider = editor.get(MemoProvider)
  memoProvider.setup(editor, data.value!.memos)
  const messageService = editor.get(MessageService)
  lastContent = content
  if(props.lib !== LibraryEnum.COURSE) {
    subs.push(
      editor.onChange.subscribe(() => {
        if(state.isChangeByReadonly1) return state.isChangeByReadonly1 = false
        // console.log('content change')
        data.value!.isContentUpdating = true
      }),
      editor.onSave.subscribe(() => {
        data.value!.isContentUpdating = true
        if(props.readonly()) return
        const content = editor.getHTML()
        console.log(content)
        if(lastContent === content) {
          data.value!.isContentUpdating = false
          return
        }
        // console.log('更新 onSave')
        handleContentSave(content, props.id, props.account, props.hostname).then(() => {
          message.success('保存成功')
        })
        lastContent = content // 因为 onSave 会立即更新 lastContent，这样 onChange 中再判断 lastContent === content 就不会再次触发保存了
        // 标题就不管 onSave 了，因为标题没有保存影响也比较小
      })
    )
    autosave.value && subs.push(
      editor.onChange.pipe(debounceTime(saveInterval.value)).subscribe(() => {
        if(state.isReadonly) return
        if(state.isChangeByReadonly2) return state.isChangeByReadonly2 = false
        const content = editor.getHTML()
        if(lastContent === content) {
          // console.log('内容未改变，无需保存')
          data.value!.isContentUpdating = false
          return
        }
        // console.log('更新 onSave')
        handleContentSave(content, props.id, props.account, props.hostname)
        lastContent = content // 因为 onSave 会立即更新 lastContent，这样 onChange 中再判断 lastContent === content 就不会再次触发保存了
        // 标题就不管 onSave 了，因为标题没有保存影响也比较小
      })
    )
    subs.push(
      messageService.onMessage.subscribe(msg => {
        const { txt, type } = msg
        message[type]?.(txt)
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
  bridge?.setup(editor, props.lib, editorRef.value, scrollerRef.value)
}).catch(err => {
  console.error(err)
  message.error('项目打开失败！')
})

if (props.lib !== LibraryEnum.COURSE) {
  subs.push(
    /** 工具条缩放 */
    useToolbarResize(toolbarWrapperRef).pipe(debounceTime(500)).subscribe(args => {
      state.toolbarHeight = args.height
    }),
    /** 工具条折叠 */
    bridge?.onToolbarCollapse.subscribe(() => {
      state.isToolbarShow = !state.isToolbarShow
    })
  )
}

/** 更新只读模式 */
if(props.lib !== LibraryEnum.COURSE){
  watch(() => props.readonly(), isReadOnly => {
    editor.readonly = isReadOnly
  })
}

const debounceA = _.debounce(func => func(), 2000)
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
  handleTitleInput(value: string) {
    // 标题输入，加入防抖保存
    data.value!.isTitleUpdating = true
    debounceA(() => handleTitleSave(value, props.id, props.account, props.hostname))
  },
  handleTitleSave(value: string, id: string, account: string, hostname: string) {
    // console.log('保存标题')
    return projectStore.updateTitle({ title: value, id: id }, handleSavingStart, account, hostname).then(res => {
      data.value!.isTitleUpdating = false
      if (res) {
        handleSavingEnd()
        folderStore.updateCard(value, id, 'title', data.value?.folderId)
      } else {
        handleSavingEnd()
          .then(() => message.error('更新失败！'))
          .catch()
      }
    }).catch(err => {
      data.value!.isTitleUpdating = false
      message.error('更新失败:' + err)
    })
  },
  handleContentSave(value: string, id: string, account: string, hostname: string) {
    // console.log('保存内容')
    return projectStore.updateContent({ content: value, id: id }, handleSavingStart, account, hostname).then(res => {
      data.value!.isContentUpdating = false
      if (res) {
        handleSavingEnd()
        folderStore.updateCard(value, id, 'content', data.value?.folderId)
      } else {
        handleSavingEnd()
          .then(() => message.error('更新失败！'))
          .catch()
      }
    }).catch(err => {
      data.value!.isContentUpdating = false
      message.error('更新失败:' + err)
    })
  },
  /** 标题输入时按下 enter 将焦点切换到编辑器 */
  handleTitleEnter() {
    editor.focus()
  }
}

const { handleContentSave, handleSavingEnd, handleTitleSave, handleSavingStart, handleTitleEnter, handleTitleInput } = methods

useMemo(props.id, props.account, props.hostname, scrollerRef, bridge)

/** 离开页面前 */
const debounceB = _.debounce(func => func(), 2000)
onBeforeUnmount(() => {
  if(props.lib !== LibraryEnum.COURSE) {
    // 离开页面前立即保存, 设置一定延迟，否则卡片会立即更新，影响体验
    if (!editor) return
    if (!data.value) return // 如果是通过缓存窗口关闭项目，这里 data 将为 undefined
    const content = editor.getHTML()
    if (lastContent === content) data.value.isContentUpdating = false
    const id = props.id
    const account = props.account
    const hostname = props.hostname
    debounceB(() => {
      if(props.readonly()) return
      if(lastContent === content) return
      // console.log('离开前更新')
      handleContentSave(content, id, account, hostname)
      lastContent = content
    })
    //TODO 有个疑问？通过防抖延迟了保存事务，为什么事务中不会拿到切换后的数据状态？可能因为 const props 是一个具名常量，并不会在切换项目后改变
  }
})

/** 离开页面 */
onUnmounted(() => {
  try {
    subs.forEach(sub => sub.unsubscribe())
    subs.length = 0
    editor?.destroy()
    console.log('编辑器是否已经销毁：' + editor.destroyed)
  } catch (error) {
    console.error(error)
    message.error('编辑器销毁失败！')
  }
})

</script>

<template>
  <div ref="rootRef" :class="['editor-wrapper', bridge?.habit?.state.platform.isScrollbarShow && 'scrollbar-visible', lib === LibraryEnum.COURSE && 'player-wrapper']">
    <div class="main" :style="{ height: '100%', flexDirection: lib === LibraryEnum.COURSE ? 'row' : 'column' }">
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
      <div ref="scrollerRef" class="scroller" :style="{ height: `calc(100% - ${state.toolbarHeight}px)` }">
        <!-- v-if="data" 保证在数据获取之前不会渲染标题栏 -->
        <TitleInput v-if="data" class="title-input" @input="handleTitleInput($event)" @enter="handleTitleEnter" :value="data?.title" :max-width="state.editorWidth" :readonly="props.readonly()" />
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
  background-color: var(--dpz-editor-bgColor);
  // border-right: 1px solid v-bind('themeVars.dividerColor');
  // border-bottom: 1px solid v-bind('themeVars.dividerColor');
  // &:hover {
  //   /*定义滑块 内阴影+圆角*/
  //   ::-webkit-scrollbar-thumb {
  //     border-radius: 10px;
  //     background-color: v-bind('themeVars.scrollbarColor');
  //   }
  // }
}
.scrollbar-visible {
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
    // background-color: var(--dpz-editor-pgColor);
  }
  .scroller {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    // background-color: v-bind('themeVars.cardColor');
    background-color:  v-bind('themeVars.bodyColor');
    // background-color: var(--dpz-editor-bgColor);
    // background-color: var(--dpz-editor-pgColor);
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
        padding: 0 12px;
        box-sizing: border-box;
        // background-color: var(--dpz-editor-pgColor);
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
