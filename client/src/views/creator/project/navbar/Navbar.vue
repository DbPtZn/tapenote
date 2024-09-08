<script lang="ts" setup>
import { LibraryEnum } from '@/enums'
import useStore from '@/store'
import { useThemeVars, useDialog, useMessage, NIcon, useNotification, NButton } from 'naive-ui'
import { computed, h, inject, onUnmounted, reactive, ref } from 'vue'
import { Bridge } from '../bridge'
import { Subscription } from '@tanbo/stream'
import { FolderTreeSelect, UnallowUserTip } from '../../_common'
import { CreatorShell } from '../../shell'
import { useShell } from '@/renderer'
import dayjs from 'dayjs'
import { Subtitles, SubtitlesOff, MoreHoriz, DpzButton } from '@/components'
import { useSubmissionDialog } from './hooks/useSubmissionDialog'
import { AutorenewOutlined, DownloadRound } from '@vicons/material'
import { useDownloadDialog } from './hooks/useDownload'
import TooltipButton from './private/TooltipButton.vue'
import SubmissionCard from './private/SubmissionCard.vue'
import SnapshotCard from './private/SnapshotCard.vue'
import HistoryCourseCard from './private/HistoryCourseCard.vue'
import CollapseButton from './private/CollapseButton.vue'
import { watch } from 'vue'
type Snapshot = NonNullable<ReturnType<typeof useStore>['projectStore']['data'][0]['snapshots']>[0]
type HistoryCourse = NonNullable<ReturnType<typeof useStore>['projectStore']['data'][0]['historyCourses']>[0]
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
const notification = useNotification()
const { folderStore, projectStore, userListStore } = useStore()
const data = computed(() => projectStore.get(props.id))
const submissionHistory = computed(() => data.value?.submissionHistory.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()))
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

watch(() => state.isReadonly, (is) => {
  if(is) state.isDrawShow = false
})

const username = userListStore.get(props.account, props.hostname)!.nickname // 获取用户名信息
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
const { handleCreate, handleDirSelected, handleAutoAnime, handleJumpToFolder } = {
  handleDirSelected(folderId: string) {
    console.log(folderId)
    configure.folderId = folderId
  },
  handleCreate() {
    if (!configure.folderId) return
    dialog.create({
      title: '创建',
      content: `${props.lib === LibraryEnum.NOTE ? '确定创建工程项目？' : '确定创建课程项目？'}`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        dialog.destroyAll() // 先关闭对话框，否则会等创建完成后才关闭
        message.info('正在创建，请稍后...')
        if (!configure.folderId) return
        try {
          const project = await projectStore.createBy({
            folderId: configure.folderId,
            sourceId: props.id,
            lib: props.lib,
            account: props.account,
            hostname: props.hostname
          })
          const toLib = props.lib === LibraryEnum.NOTE ? LibraryEnum.PROCEDURE : LibraryEnum.COURSE
          folderStore.addSubFile(project, configure.folderId, toLib)
          const n = notification.success({
            title: `创建${props.lib === LibraryEnum.NOTE ? '工程项目' : '课程动画'}成功！`,
            duration: 10000,
            meta: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            action: () => h(
              NButton,
              {
                text: true,
                type: 'primary',
                onClick: () => {
                  shell.workbench.setById({ id: project.id, lib: toLib, account: props.account, hostname: props.hostname })
                  n.destroy()
                }
              },
              {
                default: () => '跳转'
              }
            ),
          })
        } catch (error) {
          console.log(error)
          message.error(`创建${props.lib === LibraryEnum.NOTE ? '工程项目' : '课程动画'}失败！`)
        }
      },
      onNegativeClick: () => {
        message.info('已取消')
      }
    })
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
  },
  handleJumpToFolder(folderId: string | undefined) {
    if(folderId) {
      folderStore.fetchAndSet(folderId)
      state.isDrawShow = false
    } else {
      message.error('无法跳转至该目录')
    }
  }
}

const { handleExpandShareDialog  } = useSubmissionDialog() // 投稿对话框
const { handleDownloadDialog } = useDownloadDialog()  // 下载对话框

function handleTabsUpdate(value: string) {
  if(value === 'snapshot') {
    projectStore.getSnapshots(props.id, props.account, props.hostname)
  }
  if(value === 'create' && props.lib === LibraryEnum.PROCEDURE) {
    projectStore.getHistoryCourses(props.id, props.account, props.hostname)
  }
}

/** 快照 */
const snapshotMethods = {
  /** 应用快照 */
  handleApply: async (snapshot: Snapshot, isAutoSave: boolean) => {
    try {
      if(isAutoSave) await projectStore.createSnapshot(props.id, props.account, props.hostname)
      const content = await projectStore.applySnapshot(props.id, snapshot.id, props.account, props.hostname)
      // 利用重载 Editor 组件实现数据刷新
      bridge.handleEditorReload()
      if(data.value?.id) {
        folderStore.updateCard(data.value.title, data.value.id, 'title', data.value?.folderId)
        folderStore.updateCard(content, data.value.id, 'content', data.value?.folderId)
      }
    } catch (error) {
      console.log(error)
      message.error('应用历史快照时发生错误！')
    } 
  },
  /** 查看快照详情 */
  handleDetail: (snapshot: Snapshot) => {
    projectStore.getSnapshot(snapshot.id, props.account, props.hostname).then(res => {
      console.log(res)
    })
  },
  /** 删除快照 */
  handleDelete: (snapshot: Snapshot) => {
    projectStore.deleteSnapshot(props.id, snapshot.id, props.account, props.hostname)
  },
  /** 课程动画历史快照的点击事件 */
  handleCourseClick: (course: HistoryCourse) => {
    dialog.create({
      title: '创建课程新版本',
      content: () => h('div', null, [
        h('p', null, ['是否在目标课程中创建新版本？']),
        h('span', null, ['(旧版本可在目标课程版本列表中查看/切换)'])
      ]),
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          // 后端创建 course 时会自动创建相应的 snapshot
          await projectStore.coverCourse(course.id, props.id, props.account, props.hostname)
          const n = notification.success({
            title: `创建新版本成功！`,
            duration: 10000,
            meta: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            action: () => h(
              NButton,
              {
                text: true,
                type: 'primary',
                onClick: () => {
                  shell.workbench.setById({ id: course.id, lib: LibraryEnum.COURSE, account: props.account, hostname: props.hostname })
                  n.destroy()
                }
              },
              {
                default: () => '跳转'
              }
            )
          })
        } catch (error) {
          message.error('创建课程新版本时发生错误！')
        }
      },
      onNegativeClick: () => {
        message.create('已取消')
      }
    })
  }
}

onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
}) 
</script>

<template>
  <div ref="rootRef" class="navbar">
    <div class="middle-nav">
      <!-- 非当前用户的提示 -->
      <UnallowUserTip :show="state.isReadonly" :username="username" />
    </div>
    <div class="right-nav">
      <!-- 保存状态 -->
      <div class="saving">
        <span class="saving-text">{{ state.isSaving ? '正在保存 ... ' : `${ data?.isContentUpdating || data?.isTitleUpdating ? '未保存' : '' }` }}</span>
        <n-icon v-if="state.isSaving" class="rotate" :component="AutorenewOutlined" :size="22" />
      </div>
      <!-- <DpzButton v-if="lib !== LibraryEnum.COURSE" >
        {{ `${ data?.content !== birdge.content ? '保存' : '已保存' }` }}
      </DpzButton> -->
      <!-- <DpzButton class="top-nav-btn" v-if="lib === LibraryEnum.COURSE && state.isNoteShow" :active="state.isToolbarShow" :disabled="state.isReadonly" @click="handleSidenoteToolbarCollapse">
        <n-icon :component="TextSharp" :size="16" />
      </DpzButton> -->
      <!-- <TooltipButton v-if="lib === LibraryEnum.COURSE" class="top-nav-btn" :icon="Flip" :tip="'笔记'" :active="state.isNoteShow" :disabled="state.isReadonly"  @click="handleFlip" /> -->
      <TooltipButton v-if="lib === LibraryEnum.COURSE" class="top-nav-btn" :icon="state.isSubtitleShow ? Subtitles : SubtitlesOff"  :disabled="state.isReadonly"  :tip="'字幕'" @click="handleSubtitle" />
      <!-- 投稿 -->
      <n-button v-if="lib !== LibraryEnum.PROCEDURE" class="top-nav-btn" size="small" :disabled="state.isReadonly" @click="handleExpandShareDialog(props.id)">
        投稿
      </n-button>
      <!-- 下载 -->
      <n-button v-if="lib !== LibraryEnum.PROCEDURE" class="top-nav-btn" size="small" text :disabled="state.isReadonly" @click="handleDownloadDialog(props.id)">
        <n-icon :component="DownloadRound" :size="22" />
      </n-button>
      <!-- 更多 -->
      <DpzButton class="top-nav-btn"  :disabled="state.isReadonly"  @click="state.isDrawShow = !state.isDrawShow">
        <n-icon :component="MoreHoriz" :size="22" />
      </DpzButton>
    </div>
    <CollapseButton v-if="lib !== LibraryEnum.COURSE" class="collapse-btn" @click="handleToolbarCollapse" :isCollapse="state.isToolbarShow" />
  </div>
  <!-- 抽屉 -->
  <n-drawer v-if="bridge.habit" v-model:show="state.isDrawShow"  :width="320" placement="right"  :to="bridge.projectRef!" :disabled="state.isReadonly">
    <n-drawer-content :style="{ zIndex: '1000' }">
      <n-tabs type="line" animated justify-content="space-evenly" @update:value="handleTabsUpdate">
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
          <n-divider />
          <n-space :justify="'space-between'" :align="'center'">
            <div>
              <span>文件夹：</span>
              <span>{{data?.folder.name}}</span>
            </div>
            <n-button :size="'tiny'" :disabled="state.isReadonly" @click="handleJumpToFolder(data?.folderId)">跳转</n-button>
          </n-space>
          <n-divider />
        </n-tab-pane>
        <!-- 创建工程/课程 -->
        <n-tab-pane v-if="lib !== LibraryEnum.COURSE" class="create-pane" name="create" :tab="lib === LibraryEnum.PROCEDURE ? '创建课程' : '创建工程'">
          <n-space vertical>
            <div class="create-pane-header">请选择项目要保存的文件夹</div>
            <FolderTreeSelect :lib="lib === LibraryEnum.PROCEDURE ? LibraryEnum.COURSE : LibraryEnum.PROCEDURE" @on-update-value="handleDirSelected" />
            <n-button block @click="handleCreate()">创建</n-button>
          </n-space>
          <div v-if="lib === LibraryEnum.PROCEDURE">
            <n-divider />
            <p>检测到此项目创建过相关课程：</p>
            <div>
              <HistoryCourseCard
                v-for="item in data?.historyCourses || []"
                :key="item.id"
                :data="item"
                @click="snapshotMethods.handleCourseClick(item)"
              />
            </div>
          </div>

        </n-tab-pane>
        <n-tab-pane name="snapshot" :tab="lib === LibraryEnum.COURSE ? '版本' : '历史快照'">
          <SnapshotCard
            v-for="item in data?.snapshots || []"
            :key="item.id"
            :lib="lib"
            :data="item"
            :current="data?.snapshotId === item.id"
            @apply="snapshotMethods.handleApply"
            @detail="snapshotMethods.handleDetail"
            @delete="snapshotMethods.handleDelete"
          />
        </n-tab-pane>
        <!-- 投稿历史 -->
        <n-tab-pane v-if="lib !== LibraryEnum.PROCEDURE" name="submitHistory" tab="投稿历史">
          <SubmissionCard
            v-for="item in submissionHistory || []"
            :key="item.key"
            :data="item"
          />
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
  border-top: 1px solid var(--dpz-dividerColor);
  border-bottom: 1px solid var(--dpz-dividerColor);
  box-sizing: border-box;
  // overflow: hidden;
  background-color:  v-bind('themeVars.bodyColor');
  .collapse-btn {
    opacity: 0;
  }
  &:hover {
    .collapse-btn {
      opacity: 1;
    }
  }
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
