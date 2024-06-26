<script lang="ts" setup>
import { LibraryEnum } from '@/enums'
import useStore from '@/store'
import { useThemeVars, useDialog, useMessage, NIcon } from 'naive-ui'
import { computed, inject, onMounted, onUnmounted, reactive, ref } from 'vue'
import { Bridge } from '../bridge'
import { Subscription } from '@tanbo/stream'
import { FolderTreeSelect, UnallowUserTip } from '../../_common'
import { CreatorShell } from '../../shell'
import { useShell } from '@/renderer'
import dayjs from 'dayjs'
import { Flip, Subtitles, SubtitlesOff, Download, MoreHoriz, TextSharp, DpzButton } from '@/components'
import { useSubmissionDialog } from './hooks/useSubmissionDialog'
import { TooltipButton } from './private/_index'
import { AutorenewOutlined, DownloadRound } from '@vicons/material'
import { useDownloadDialog } from './hooks/useDownload'
const bridge = inject('bridge') as Bridge
const shell = useShell<CreatorShell>()
const props = defineProps<{
  id: string
  lib: LibraryEnum
  account: string
  hostname: string
  readonly: () => boolean
}>()
const themeVars = useThemeVars()
const dialog = useDialog()
const message = useMessage()
const { folderStore, projectStore, userListStore } = useStore()
const data = computed(() => projectStore.get(props.id))
const rootRef = ref()
const subs: Subscription[] = []
const state = reactive({
  isReadonly: computed(() => props.readonly()),
  isSaving: false,
  isToolbarShow: false,
  isDrawShow: false,
  // course
  isSubtitleShow: false,
  isNoteShow: false,
})

const username = userListStore.get(props.account, props.hostname).nickname // 获取用户名信息
const { handleToolbarCollapse, handleFlip, handleSidenoteToolbarCollapse, handleSubtitle }  = {
  handleToolbarCollapse() {
    state.isToolbarShow = !state.isToolbarShow
    bridge.handleToolbarCollapse()
  },
  handleFlip() {
    state.isNoteShow = !state.isNoteShow
    bridge.handleSidenoteShow(state.isNoteShow)
  },
  handleSidenoteToolbarCollapse() {
    state.isToolbarShow = !state.isToolbarShow
    bridge.handleSidenoteToolbarCollapse(state.isToolbarShow)
  },
  handleSubtitle() {
    state.isSubtitleShow = !state.isSubtitleShow
  }
}

subs.push(
  bridge.onSaveStart.subscribe(() => {
    state.isSaving = true
  }),
  bridge.onSaveEnd.subscribe(() => {
    state.isSaving = false
  })
)

const configure = reactive({
  folderId: ''
})
const { handleCreate, handleDirSelected, handleDownload, handleAutoAnime } = {
  handleDirSelected(folderId: string) {
    console.log(folderId)
    configure.folderId = folderId
  },
  handleCreate() {
    if (!configure.folderId) return
    dialog.create({
      title: '创建',
      content: `${props.lib === LibraryEnum.NOTE ? '确定创建工程项目并跳转？' : '确定创建课程项目并跳转？'}`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        if (!configure.folderId) return
        projectStore.createBy({
          folderId: configure.folderId,
          sourceId: props.id,
          lib: props.lib,
          account: props.account,
          hostname: props.hostname
        }).then(res => {
          const toLib = props.lib === LibraryEnum.NOTE ? LibraryEnum.PROCEDURE : LibraryEnum.COURSE
          shell.workbench.setById({ id: res.id, lib: toLib, account: props.account, hostname: props.hostname })
          folderStore.addSubFile(res, configure.folderId, toLib)
        })
      },
      onNegativeClick: () => {
        message.create('已取消')
      }
    })
  },
  handleDownload() {
    //
  },
  handleAutoAnime() {
    dialog.create({
      title: '自动分配动画预设',
      content: '该功能会覆盖现有的动画预设，谨慎使用！',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        bridge.handleAutoAnime()
      }
    })
  }
}
const { handleExpandShareDialog  } = useSubmissionDialog()
const { handleDownloadDialog } = useDownloadDialog()
onMounted(() => {
  // rootRef.value.innerHTML = '&#x1F601'
})
onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
}) 
</script>

<template>
  <div ref="rootRef" class="navbar">
    <div class="middle-nav">
      <UnallowUserTip :show="state.isReadonly" :username="username" />
    </div>
    <div class="right-nav">
      <div class="saving">
        <span class="saving-text">{{ state.isSaving ? '正在保存 ... ' : '' }}</span>
        <n-icon v-if="state.isSaving" class="rotate" :component="AutorenewOutlined" :size="22" />
      </div>
      <!-- <DpzButton v-if="lib !== LibraryEnum.COURSE" >
        {{ `${ data?.content !== birdge.content ? '保存' : '已保存' }` }}
      </DpzButton> -->
      <DpzButton v-if="lib !== LibraryEnum.COURSE" :active="state.isToolbarShow" :disabled="state.isReadonly" @click="handleToolbarCollapse" >
        <n-icon :component="TextSharp" :size="16" />
      </DpzButton>
      <DpzButton class="top-nav-btn" v-if="lib === LibraryEnum.COURSE && state.isNoteShow" :active="state.isToolbarShow" :disabled="state.isReadonly" @click="handleSidenoteToolbarCollapse">
        <n-icon :component="TextSharp" :size="16" />
      </DpzButton>
      <TooltipButton v-if="lib === LibraryEnum.COURSE" class="top-nav-btn" :icon="Flip" :tip="'笔记'" :active="state.isNoteShow" :disabled="state.isReadonly"  @click="handleFlip" />
      <TooltipButton v-if="lib === LibraryEnum.COURSE" class="top-nav-btn" :icon="state.isSubtitleShow ? Subtitles : SubtitlesOff"  :disabled="state.isReadonly"  :tip="'字幕'" @click="handleSubtitle" />
      <n-button v-if="lib !== LibraryEnum.PROCEDURE" class="top-nav-btn" size="small" :disabled="state.isReadonly" @click="handleExpandShareDialog(props.id)">
        投稿
      </n-button>
      <n-button v-if="lib !== LibraryEnum.PROCEDURE" class="top-nav-btn" size="small" text :disabled="state.isReadonly" @click="handleDownloadDialog(props.id)">
        <n-icon :component="DownloadRound" :size="22" />
      </n-button>
      <DpzButton class="top-nav-btn"  :disabled="state.isReadonly"  @click="state.isDrawShow = !state.isDrawShow">
        <n-icon :component="MoreHoriz" :size="22" />
      </DpzButton>
    </div>
  </div>
  <!-- 设置 -->
  <n-drawer v-if="bridge.habit" v-model:show="state.isDrawShow" :width="320" placement="right"  :to="bridge.projectRef!" :disabled="state.isReadonly">
    <n-drawer-content :style="{ zIndex: '1000' }">
      <n-tabs type="line" animated justify-content="space-evenly">
        <n-tab-pane name="setting" tab="页面设置">
          <n-space vertical size="large">
            <n-space :justify="'space-between'" :align="'center'">
              <span>页面宽度</span>
              <n-select
                v-model:value="bridge.habit.state.platform.width"
                :options="bridge.habit.platformWidthOptions"
                size="small"
                :consistent-menu-width="false"
              />
            </n-space>
            <n-space v-if="lib === LibraryEnum.COURSE" :justify="'space-between'" :align="'center'">
              <span>字幕</span>
              <n-switch v-model:value="bridge.habit.state.subtitle.show" />
            </n-space>
            <n-space :justify="'space-between'" :align="'center'">
              <span>大纲视图</span>
              <n-switch v-model:value="bridge.habit.state.platform.isOutlineShow" @update:value="bridge.handleOutlineShow()" />
            </n-space>
            <n-space :justify="'space-between'" :align="'center'">
              <span>滚动条</span>
              <n-switch v-model:value="bridge.habit.state.platform.isScrollbarShow" />
            </n-space>
            <n-divider />
            <n-space :justify="'center'" :align="'center'">
              <n-button @click="handleAutoAnime">自动分配动画</n-button>
            </n-space>
            <!-- <n-space :justify="'space-between'" :align="'center'">
              <span>页面主题</span>
              <n-select v-model:value="eidtorState.editorThemeRef" :options="getEditorThemeOptions()" size="small" :consistent-menu-width="false" />
            </n-space> -->
            <!-- <n-space :justify="'space-between'" :align="'center'">
              <span>大纲视图</span>
              <n-switch v-model:value="eidtorState.isShowOutline" />
            </n-space> -->
          </n-space>
          <n-divider />
          <!-- 文章详情 -->
          <n-descriptions label-style="white-space: nowrap;" label-placement="left" label-align="center" :column="1" :bordered="true" title="详情">
            <n-descriptions-item label="作者"> {{data?.detial.penname}} </n-descriptions-item>
            <n-descriptions-item label="邮箱"> {{data?.detial.email}} </n-descriptions-item>
            <n-descriptions-item label="作者主页"> {{data?.detial.homepage}} </n-descriptions-item>
            <n-descriptions-item label="创建时间"> {{dayjs(data?.createAt).format('YYYY-MM-DD HH:mm:ss')}} </n-descriptions-item>
            <n-descriptions-item label="更新时间"> {{dayjs(data?.updateAt).format('YYYY-MM-DD HH:mm:ss')}} </n-descriptions-item>
            <n-descriptions-item label="字数"> {{data?.detial.wordage}} </n-descriptions-item>
          </n-descriptions>
        </n-tab-pane>
        <!-- 创建工程/课程 -->
        <n-tab-pane v-if="lib !== LibraryEnum.COURSE" class="create-pane" name="create" :tab="lib === LibraryEnum.PROCEDURE ? '创建课程' : '创建工程'">
          <n-space vertical>
            <div class="create-pane-header">请选择项目要保存的文件夹</div>
            <FolderTreeSelect :lib="lib === LibraryEnum.PROCEDURE ? LibraryEnum.COURSE : LibraryEnum.PROCEDURE" @on-update-value="handleDirSelected" />
            <n-button block @click="handleCreate()">创建</n-button>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped>

.navbar {
  position: relative;
  display: inline;
  height: 100%;
  width: 100%;
  // min-height: 42px;
  border-top: 1px solid var(--dpz-dividerColor);
  border-bottom: 1px solid var(--dpz-dividerColor);
  box-sizing: border-box;
  overflow: hidden;
  background-color:  v-bind('themeVars.bodyColor');
}

.middle-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 100%;
}
.right-nav {
  float: right;
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  overflow: hidden;
  .top-nav-btn {
    margin: 0 6px;
  }
  .saving {
    display: flex;
    align-items: center;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
.rotate {
  :deep(svg) {
    display: block;
    animation: 5s rotate infinite linear;
    animation-duration: 2;
  }
}

</style>
