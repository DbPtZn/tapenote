<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useSidenoteEditor } from './hooks/_index'
import useStore from '@/store'
import { useMessage, useThemeVars } from 'naive-ui'
import { Editor } from '@textbus/editor'
import { Subscription, debounceTime } from '@tanbo/stream'
import { Bridge } from '../bridge'
import { LibraryEnum } from '@/enums'
import _ from 'lodash'
const props = defineProps<{
  id: string
  lib: LibraryEnum
  account: string
  hostname: string
  readonly: () => boolean
}>()
const bridge = inject('bridge') as Bridge
const { projectStore } = useStore()
const themeVars = useThemeVars()
const message = useMessage()
const editorRef = ref()
const scrollerRef = ref()
const toolbarRef = ref()
const subs: Subscription[] = []
const data = computed(() => projectStore.get(props.id))
const state = reactive({
  // folderId: computed(() => projectStore.get(state.courseId)?.folderId),
  isToolbarShow: ref(false),
  isDrawShow: ref(false),
  isSaving: ref(false),
  toolbarHeight: ref<number>(50), // 基于顶部固定工具条的高度调整滚动区的高度
  editorWidth: computed(() => bridge.habit.state.platform.width),
  isReadonly: computed(() => props.readonly())
})
let editor: Editor
let lastContent = ''
useSidenoteEditor({
  id: props.id,
  account: props.account,
  hostname: props.hostname,
  editorRef,
  scrollerRef,
  toolbarRef,
  bridge
}).then(({ editor: edi, content }) => {
  editor = edi
  lastContent = content
  subs.push(
    editor.onChange.subscribe(() => {
      data.value!.isSidenoteUpdating = true
    }),
    editor.onChange.pipe(debounceTime(2000)).subscribe(ev => {
      if (props.readonly()) return
      const content = editor.getHTML()
      if(lastContent === content) {
        data.value!.isSidenoteUpdating = false
        return
      }

      handleContentSave(content, props.id)
      lastContent = content
    }),
    editor.onSave.subscribe(() => {
      if(props.readonly()) return
      const content = editor.getHTML()
      if(lastContent === content) return
      // console.log('更新 onSave')
      handleContentSave(content, props.id)
      lastContent = content
    }),
    bridge.onToolbarCollapse.subscribe(value => {
      state.isToolbarShow = value
    }),
  )
})

/** 文件更新同步 */
function handleSavingStart() {
  // 不能直接 bridge.handleSaveStart 因为在回调的调用中修改了 this 的指向
  bridge.handleSaveStart()
}
function handleSavingEnd() {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      bridge.handleSaveEnd()
      resolve(true)
      clearTimeout(timer)
    }, 1000)
  })
}
function handleContentSave(value: string, id: string) {
  projectStore.updateSidenoteContent({ content: value, id: id }, handleSavingStart, props.account, props.hostname).then(res => {
    data.value!.isSidenoteUpdating = false
    if (res) {
      handleSavingEnd()
    } else {
      handleSavingEnd()
        .then(() => message.error('更新失败！'))
        .catch()
    }
  }).catch(err => {
    data.value!.isSidenoteUpdating = false
    message.error('更新失败:' + err)
  })
}
/** 更新只读模式 */
watch(
  () => props.readonly(),
  isReadOnly => {
    editor.readonly = isReadOnly
  }
)

/** 离开页面前 */
const debounceB = _.debounce(func => func(), 2000)
onBeforeUnmount(() => {
  if(props.lib === LibraryEnum.COURSE) {
    // 离开页面前立即保存, 设置一定延迟，否则卡片会立即更新，影响体验
    if (!editor) return
    const content = editor.getHTML()
    if (lastContent === content) data.value!.isSidenoteUpdating = false
    const id = props.id
    debounceB(() => {
      if(props.readonly()) return
      if(lastContent === content) return
      // console.log('离开前更新')
      handleContentSave(content, id)
      lastContent = content
    })
    // 有个疑问？通过防抖延迟了保存事务，为什么事务中不会拿到切换后的数据状态？可能因为 const props 是一个具名常量，并不会在切换项目后改变
  }
})
</script>

<template>
  <div class="sidenote">
    <!-- 工具条 -->
    <div ref="toolbarWrapperRef">
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
      <div ref="editorRef" class="editor" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidenote {
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
.toolbar {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  z-index: 1;
  word-wrap: break-word;
}
.scroller {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
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
      background-color: v-bind('themeVars.cardColor');
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
