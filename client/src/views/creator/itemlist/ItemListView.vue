<script lang="ts" setup>
import { NButton, useMessage, useThemeVars } from 'naive-ui'
import { LibraryEnum } from '@/enums'
import { onMounted, ref, watch } from 'vue'
import { FileCard, FolderCard } from './private'
import { SortType } from '@/store'
import useStore from '@/store'
import utils from '@/utils'
import { CreatorShell } from '../shell'
import { useShell } from '@/renderer'
import ItemListContainer from './ItemListContainer.vue'
import { useItemListDropDown, useDrag } from './hooks/_index'
import { DropdownOption } from 'naive-ui/es/dropdown/src/interface'
import { ArrowDropDownRound, ChevronLeftFilled, MoreHorizFilled } from '@vicons/material'
import _ from 'lodash'
const { folderStore, folderTreeStore, dragStore, userStore, projectStore } = useStore()
const shell = useShell<CreatorShell>()
const themeVars = useThemeVars()
const message = useMessage()
const { dropdownState, options, handleContextmenu, handleMoreAction, handleSelect, handleClickoutside } = useItemListDropDown()
const value = ref()
const scrollerRef = ref<HTMLElement>()
const listRef = ref<HTMLElement>()
const showFolderName = ref(false)
const sortType = ref<SortType>(SortType.UPDATE_REVERSE)
/** 导航按钮下拉列表 */
const navBtnDropdownOptions = (): DropdownOption[] => [
  {
    label: '显示文件目录',
    show: folderStore.id === 'recently',
    key: 'show-file-folder',
    props: {
      onClick: () => {
        showFolderName.value = !showFolderName.value
      }
    }
  },
  {
    label: '排序',
    show: folderStore.id !== 'recently',
    key: 'file-list-sort',
    children: [
      {
        label: `按更新时间排序${sortType.value === SortType.UPDATE ? ' ↑' : sortType.value === SortType.UPDATE_REVERSE ? ' ↓' : ' '}`,
        key: 'sortByUpdateAt',
        props: {
          onClick: () => {
            sortType.value === SortType.UPDATE ? (sortType.value = SortType.UPDATE_REVERSE) : (sortType.value = SortType.UPDATE)
          }
        }
      },
      {
        label: `按创建时间排序${sortType.value === SortType.CREATE ? ' ↑' : sortType.value === SortType.CREATE_REVERSE ? ' ↓' : ' '}`,
        key: 'sortByCreateAt',
        props: {
          onClick: () => {
            sortType.value === SortType.CREATE ? (sortType.value = SortType.CREATE_REVERSE) : (sortType.value = SortType.CREATE)
          }
        }
      },
      {
        label: `按名称排序${sortType.value === SortType.NAME ? ' ↑' : sortType.value === SortType.NAME_REVERSE ? ' ↓' : ' '}`,
        key: 'sortByName',
        props: {
          onClick: () => {
            sortType.value === SortType.NAME ? (sortType.value = SortType.NAME_REVERSE) : (sortType.value = SortType.NAME)
          }
        }
      }
    ]
  }
]
/** 回退 */
function handleRollback(folderId: string) {
  folderStore.fetchAndSet(folderId)
}
/** folder 方法 */
const folderMethods = {
  handleToFolder(folderId: string) {
    folderStore.fetchAndSet(folderId)
  }
}
/** file 方法 */
const fileMethods = {
  handleDragStart(ev: DragEvent, id: string, lib: LibraryEnum, folderId: string) {
    ev.dataTransfer?.setData('id', id)
    ev.dataTransfer?.setData('lib', lib)
    dragStore.dragging = true
    dragStore.isFile = true
    dragStore.lib = lib
  },
  handleDragEnd(ev: DragEvent) {
    dragStore.dragging = false
    dragStore.isFile = false
    ev.dataTransfer?.clearData()
  },
  handleToFile(itemId: string, lib: LibraryEnum) {
    const project = projectStore.get(itemId)
    if(project && (project.isContentUpdating || project.isTitleUpdating || project.isSidenoteUpdating)) {
      message.loading('项目正在更新，请更新完成后再打开')
      return
    }
    shell.useWorkbench()
    shell.workbench.setById({ id: itemId, lib, account: userStore.account, hostname: userStore.hostname })
  },
  handleToFolder(folderId: string, lib: LibraryEnum) {
    folderStore.fetchAndSet(folderId)
    folderTreeStore.queryAncestorNode(folderId, lib) // 展开所有祖先节点
  }
}
function getFolderName(name: string) {
  switch (name) {
    case 'NOTE ROOT DIR':
      return '笔记'
    case 'COURSE ROOT DIR':
      return '工程'
    case 'PROCEDURE ROOT DIR':
      return '课程'
    default:
      return name
  }
}

/** 拖拽 */
const { handleFolderDragStart, handleFolderDragEnd, handleDragEnter, handleDragLeave, handleDrop } = useDrag()

/** 最近编辑模式下的弹出选择 */
const libOptions: DropdownOption[] = [
  {
    label: '笔记',
    value: LibraryEnum.NOTE
  },
  {
    label: '课程',
    value: LibraryEnum.COURSE
  },
  {
    label: '工程',
    value: LibraryEnum.PROCEDURE
  }
]
function handleRecentlySelected(value: LibraryEnum) {
  scrollerRef.value!.scrollTop = 0
  if (value !== folderStore.lib) {
    folderStore.fetchRecentlyAndSet({
      skip: 0,
      take: 8,
      lib: value
    })
  }
}

// 最近编辑模式下滚动加载
const debounceFunc = _.debounce(func => func(), 1000) // 防抖
const loading = ref(false)
// const noMore = ref(false) //TODO 没有持久缓存，切换文件夹当前缓存丢失但后 noMore 也没有重置，待优化
function handleScroll(ev) {
  if (folderStore.id !== 'recently') return
  const scrollerRef = ev.target as HTMLElement
  if (scrollerRef.clientHeight + scrollerRef.scrollTop >= scrollerRef.scrollHeight) {
    // if(noMore.value) return
    loading.value = true
    debounceFunc(() => {
      folderStore.fetchRecentlyAndSet({
        skip: folderStore.subfiles!.length,
        take: 8,
        lib: folderStore.lib!
      }).then(end => {
        loading.value = false
        // noMore.value = end
      }).catch(() => {
        loading.value = false
      })
    })
  }
}
// 切换时初始化滚动条位置
watch(() => folderStore.lib, (v) => {
  if (folderStore.id === 'recently') {
    scrollerRef.value!.scrollTop = 0
  }
})

</script>
<template>
  <ItemListContainer>
    <div class="itemlist">
      <Header class="header" :height="142">
        <!-- 顶部导航 -->
        <div class="header-nav">
          <!-- 当前文件夹 -->
          <div class="header-nav-left">
            <!-- 普通文件夹模式下 -->
            <div v-if="folderStore.id !== 'recently'" class="header-nav-left-item">
              <n-button v-if="folderStore.parentId" text size="large" @click="handleRollback(folderStore.parentId)">
                <n-icon :component="ChevronLeftFilled" :size="24" />
              </n-button>
              <n-text :depth="2"> {{ getFolderName(folderStore.name) }} </n-text>
            </div>
            <!-- 最近编辑模式下 -->
            <div v-if="folderStore.id === 'recently'">
              <n-popselect :value="folderStore.lib" :options="libOptions" trigger="click" @update:value="handleRecentlySelected">
                <div class="popselect_trigger">
                  <n-button text>
                    {{ libOptions[libOptions.findIndex(item => item.value === folderStore.lib)].label }}
                  </n-button>
                  <n-icon :component="ArrowDropDownRound" :size="24" />
                </div>
              </n-popselect>
            </div>
          </div>
          <!-- 按钮 -->
          <n-dropdown :options="navBtnDropdownOptions()" :trigger="'click'">
            <n-button text>
              <n-icon :component="MoreHorizFilled" :size="24" />
            </n-button>
          </n-dropdown>
        </div>
        <!-- 搜索栏 -->
        <div class="searchbar">
          <n-tooltip trigger="click">
            <template #trigger>
              <n-input v-model:value="value" type="text" placeholder="搜索" clearable disabled />
            </template>
            搜索功能待开发...
          </n-tooltip>
        </div>
      </Header>
      <div ref="scrollerRef" class="main" :flex="1" @scroll="handleScroll">
        <div ref="listRef" class="list" @contextmenu="handleContextmenu($event, 'list')">
          <FolderCard
            v-for="item in folderStore.subfolders"
            :title="item.name"
            :date="utils.dateFormat(new Date(item.createAt))"
            :key="item.id"
            draggable="true"
            @click="folderMethods.handleToFolder(item.id)"
            @on-more-action="handleMoreAction($event, 'folder', item)"
            @contextmenu="handleContextmenu($event, 'folder', item)"
            @dragover="ev => ev.preventDefault()"
            @dragenter="handleDragEnter"
            @dragleave="handleDragLeave"
            @drop="handleDrop($event, item)"
            @dragstart="handleFolderDragStart($event, item)"
            @dragend="handleFolderDragEnd"
          />
          <FileCard
            v-for="item in folderStore.getSubfiles(sortType)"
            :id="item.id"
            :title="item.title || '未命名文档'"
            :abbrev="item.abbrev"
            :date="utils.dateFormat(new Date(item.updateAt))"
            :key="item.id"
            :folder-id="item.folderId"
            :folder-name="item.folderName"
            :show-folder-name="showFolderName"
            :active="shell.workbench.itemId === item.id"
            draggable="true"
            @dragstart="fileMethods.handleDragStart($event, item.id, item.lib, item.folderId)"
            @dragend="fileMethods.handleDragEnd"
            @click="fileMethods.handleToFile(item.id, item.lib)"
            @on-more-action="handleMoreAction($event, 'file', item)"
            @to-folder="fileMethods.handleToFolder($event, item.lib)"
            @contextmenu="handleContextmenu($event, 'file', item)"
          />
          <div v-if="loading" class="touch-bottom">
            加载中...
          </div>
          <!-- <div v-if="noMore" class="touch-bottom">
            没有更多了 🤪
          </div> -->
        </div>
      </div>
    </div>
  </ItemListContainer>
  <!-- 右击下拉列表 -->
  <n-dropdown
    trigger="manual"
    :placement="dropdownState.placementRef"
    :show-arrow="dropdownState.showArrowRef"
    :x="dropdownState.xRef"
    :y="dropdownState.yRef"
    :options="options"
    :show="dropdownState.showDropdownRef"
    @select="handleSelect"
    @clickoutside="handleClickoutside"
  />
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px 12px;
  .header-nav {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .header-nav-left {
      // display: flex;
      // align-items: center;
      .header-nav-left-item {
        display: flex;
        align-items: center;
      }
      .popselect_trigger {
        display: flex;
        align-items: center;
        margin-left: 6px;
      }
    }
  }

  .searchbar {
    width: 100%;
  }
}
.main {
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0px 12px;
  box-sizing: border-box;
  .list {
    // height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 60px;
    .touch-bottom {
      margin-top: 50px;
      text-align: center;
    }
  }
}

.itemlist {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-right: 1px solid v-bind('themeVars.dividerColor');
  &:hover {
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: v-bind('themeVars.scrollbarColor');
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
