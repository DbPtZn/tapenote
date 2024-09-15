<script lang="ts" setup>
import { Userbar, CollapsePanel, NavMenuItem } from './private'
import { NButton, TreeDropInfo, useThemeVars } from 'naive-ui'
import { useDrag, useSidebarDropDown } from './hooks/_index'
import { FolderTree } from './FolderTree'
import { LibraryEnum } from '@/enums'
import useStore, { TreeNode } from '@/store'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Subscription } from '@textbus/core'
import { useShell } from '@/renderer'
import { AccessTimeRound, SearchRound, MoreHorizRound } from '@vicons/material'
import { CreatorShell } from '../shell'
import SidebarContainer from './SidebarContainer.vue'
const themeVars = useThemeVars()
const shell = useShell<CreatorShell>()
const { userListStore, userStore, folderTreeStore, folderStore, dragStore } = useStore()
const { dropdownState, options, onCreateFolder, handleUserDropdown, handleMasterDropdown, handleRecentContextmenu, handleMoreDropdown, handleCollapseDropdown, handleSelect, handleClickoutside } = useSidebarDropDown()
const sidebarRef = ref<HTMLElement>()
const subs: Subscription[] = []
const folderTree = new FolderTree()
onMounted(() => {
  shell.useItemlist() // 加载时，如果 folderStore.id 存在，则会自动应用项目列表
  userListStore.autoFilling()
  subs.push(
    // 成功创建文件夹后主动展开折叠面板
    onCreateFolder.subscribe(lib => {
      folderTreeStore.fetchFirstLevel(userStore.getDirByLib(lib), lib).then(() => {
        if (!folderTreeStore.expandedNames.includes(lib)) {
          folderTreeStore.expandedNames.push(lib)
        }
      })
    }),
    // 成功创建文件夹后主动展开节点（创建子节点时，折叠面板必然是展开状态，所以不需要再主动展开）
    folderTree.onCreateFolder.subscribe(node => {
      if (!folderTreeStore.getExpandedKeys(node.lib!).includes(node.id!)) {
        folderTreeStore.addExpandedKeys(node.id!, node.lib!)
      }
    })
  )
})
onUnmounted(() => {
  subs.forEach(i => i.unsubscribe())
})
watch(
  () => folderStore.id,
  () => {
    if (folderStore.id && folderStore.lib && folderStore.subfolders && folderStore.subfolders.length > 0) {
      // 根目录不在 tree 中，必须排除，否则会导致树的展开项错误
      if (userStore.getDirByLib(folderStore.lib) !== folderStore.id) {
        if (!folderTreeStore.getExpandedKeys(folderStore.lib).includes(folderStore.id)) {
          folderTreeStore.addExpandedKeys(folderStore.id, folderStore.lib)
        }
      }
    }
    shell.useItemlist() // folderStore.id 发生变化时，自动应用项目列表
  }
)
const methods = {
  handleExpand(args: Array<LibraryEnum>) {
    folderTreeStore.expandedNames = args
    args.forEach(lib => {
      folderTreeStore.setFirstLevel(userStore.getDirByLib(lib), lib)
    })
  },
  /** 更新树的展开项 */
  handleExpandedKeysChange(expandedKeys: string[], lib: LibraryEnum) {
    folderTreeStore.setExpandedKeys(expandedKeys, lib)
  },
  /** 加载树节点数据 */
  handleLoad(node: TreeNode) {
    return new Promise<void>((resolve, reject) => {
      folderTreeStore
        .fetchChildren(node.id!)
        .then(data => {
          node.children = data
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /** 打开文件夹 */
  handleClick(keys: string[]) {
    // :selected-keys 设置为空，选项不会设置为选中状态（选中状态的选项被点击时会返回空值,导致不同库间切换时需二次点击才能完成切换）
    if (keys[0]) {
      folderStore.fetchAndSet(keys[0])
      shell.expandItemlist() // 强制展开项目列表
    }
  }
}
const { dragState, handleDragLeave, handleDrop, getNodeProps } = useDrag(sidebarRef)

/** 菜单 */
function hanldeToRecent() {
  if (folderStore.id !== 'recently') {
    folderStore.fetchRecentlyAndSet({
      lib: LibraryEnum.NOTE,
      skip: 0,
      take: 8
    })
  }
}
</script>
<template>
  <SidebarContainer>
    <div class="sidebar" ref="sidebarRef">
      <Header class="header" :height="142">
        <!-- 用户 -->
        <Userbar :nick-name="userStore.nickname || ''" :avatar="userStore.avatar || ''" @click="handleUserDropdown" />
        <!-- 主按钮 -->
        <n-button class="header-master-button" @click.stop="handleMasterDropdown"> ＋ 新建 </n-button>
      </Header>
      <Main class="main" :flex="1">
        <!-- 导航菜单 -->
        <NavMenuItem :label="'最近编辑'" :icon="AccessTimeRound" :active="folderStore.id === 'recently'" @click="hanldeToRecent" @contextmenu.prevent="handleRecentContextmenu" />
        <NavMenuItem :label="'搜索'" :icon="SearchRound" :active="false" disabled />
        <NavMenuItem :label="'更多'" :icon="MoreHorizRound" :active="false" @click="handleMoreDropdown" />
        <!-- 折叠面板 -->
        <CollapsePanel
          class="collapse"
          :options="folderTree.collapseOptions"
          :expanded-names="folderTreeStore.expandedNames"
          @dropdown="handleCollapseDropdown"
          @update:expanded-names="methods.handleExpand"
        >
          <template #default="{ slotName }">
            <n-tree
              block-line
              draggable
              :data="folderTreeStore.getWithSort(slotName as LibraryEnum)"
              :render-label="folderTree.renderLabel"
              :render-suffix="({ option }) => folderTree.renderSuffix({option}, slotName as LibraryEnum)"
              :on-load="methods.handleLoad"
              :expanded-keys="folderTreeStore.getExpandedKeys(slotName as LibraryEnum)"
              :selected-keys="[]"
              @update:expanded-keys="methods.handleExpandedKeysChange($event, slotName as LibraryEnum)"
              @drop="(args: TreeDropInfo) => folderTree.handleDrop(args, slotName as LibraryEnum)"
              @update:selected-keys="methods.handleClick"
              :node-props="getNodeProps"
            />
          </template>
        </CollapsePanel>
      </Main>
    </div>
  </SidebarContainer>
  <!-- 拖拽框 -->
  <div 
    class="drag-box"
    @dragover="ev => ev.preventDefault()"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    :style="{
      display: dragState.show? 'block' : 'none',
      height: dragState.heightRef + 'px',
      width: dragState.widthRef + 'px',
      top: dragState.yRef + 'px',
      left: dragState.xRef + 'px'
    }"
  />
  <!-- 下拉列表 -->
  <n-dropdown
    trigger="manual"
    :width="dropdownState.widthRef"
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
.drag-box {
  position: absolute;
  inset: 0px;
  border-radius: inherit;
  box-shadow: inset 0 0 0 2px v-bind('themeVars.boxShadow1');
  border: 1px solid v-bind('themeVars.dividerColor');
}
.header {
  display: flex;
  flex-direction: column;
  padding: 24px 12px;

  .header-master-button {
    width: 100%;
    height: 36px;
    margin-top: 24px;
    overflow: hidden;
  }
}
.main {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  .menu {
    overflow: unset;
    // margin-bottom: 20px;
  }
  .collapse {
    padding: 24px 12px;
    box-sizing: border-box;
  }
}

.sidebar {
  display: flex;
  flex-direction: column;
  background-color: var(--dpz-bodyColor);
  height: 100%;
  overflow: hidden;
  // border-left: 1px solid v-bind('themeVars.dividerColor');
  // border-right: 1px solid v-bind('themeVars.dividerColor');
  &:hover {
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: v-bind('themeVars.scrollbarColorHover');
    }
  }
}

:deep(.n-tree-node) {
  height: 32px;
  align-items: center;
}

:deep(.n-tree-node-content) {
  .n-tree-node-content__text {
    border-bottom: none;
  }
  .tree-suffix {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  &:hover {
    .tree-suffix {
      opacity: 1;
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