<script lang="ts" setup>
import { LibraryEnum, RoutePathEnum } from '@/enums'
import { CoffeeMaker, Notebook, PlayLesson } from '@/components'
import { 
  ArrowBackIosFilled, 
  AddCircleOutlineFilled, 
  WorkspacesFilled, 
  AutoAwesomeMotionOutlined,
  SearchOutlined,
  PostAddOutlined,
  StickyNote2Outlined,
  KeyboardArrowLeftFilled
} from '@vicons/material'
import { DropdownOption, NIcon, useThemeVars } from 'naive-ui'
import { Component, computed, h, nextTick, onMounted, reactive, ref } from 'vue'
import useStore from '@/store'
import router from '@/router'
const { folderStore, userStore, recentStore, projectStore } = useStore()
const themeVars = useThemeVars()
const currentLib = computed(() => folderStore.lib)

function getCurrentLibName() {
  switch (currentLib.value) {
    case LibraryEnum.NOTE:
      return '笔记'
    case LibraryEnum.COURSE:
      return '课程'
    case LibraryEnum.PROCEDURE:
      return '工程'
    default:
      return '未知'
  }
}

const dropdownState = reactive({
  lib: undefined as LibraryEnum | undefined,
  type: undefined as 'leftBtn' | 'rightBtn' | 'floatBtn' | undefined,
  target: undefined as HTMLElement | undefined,
  xRef: 0,
  yRef: 0,
  showDropdownRef: false,
  showArrowRef: false,
  placementRef: 'bottom-start' as 'bottom' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top' | 'top-end' | 'left-start' | 'left' | 'left-end'
})
function renderIcon(component: Component) {
  return h(NIcon, { component: component, size: 24 })
}
function handleSelectLib(lib: LibraryEnum) {
  // 将当前文件夹 lib 记录到 localstorage
  localStorage.setItem('currentFolderLib', lib)
  // 切换 lib 时，读取 localstorage 中的对应的 {lib}-folder id, 设置为当前目录
  const id = localStorage.getItem(`${lib}-folder`)
  // 如果 id 不存在，则打开根目录
  if(!id) {
    const rootId = userStore.getDirByLib(lib)
    router.push(`${RoutePathEnum.FOLDER}?id=${rootId}`)
    return
  }
  router.push(`${RoutePathEnum.FOLDER}?id=${id}`)
}

// onMounted(() => {
//   const currentLib = localStorage.getItem('currentFolderLib') as LibraryEnum || LibraryEnum.NOTE
//   const id = localStorage.getItem(`${currentLib}-folder`)
//   if(!id) {
//     // 默认打开根目录
//     const rootId = userStore.getDirByLib(currentLib)
//     router.push(`${RoutePathEnum.FOLDER}/${rootId}`)
//   }
// })


const options = computed<DropdownOption[]>(() => {
  return [
    {
      key: 'note',
      icon: () => renderIcon(Notebook),
      label: '笔记',
      show: dropdownState.type === 'floatBtn',
      props: {
        onClick: () => {
          handleSelectLib(LibraryEnum.NOTE)
        }
      }
    },
    {
      key: 'course',
      icon: () => renderIcon(PlayLesson),
      label: '课程',
      show: dropdownState.type === 'floatBtn',
      props: {
        onClick: () => {
          handleSelectLib(LibraryEnum.COURSE)
        }
      }
    },
    {
      key: 'procedure',
      icon: () => renderIcon(CoffeeMaker),
      label: '工程',
      show: dropdownState.type === 'floatBtn',
      props: {
        onClick: () => {
          handleSelectLib(LibraryEnum.PROCEDURE)
        }
      }
    },
    // Right Button
    {
      key: 'create-new-file',
      icon: () => renderIcon(PostAddOutlined),
      label: '新建项目',
      show: dropdownState.type === 'rightBtn',
      disabled: folderStore.lib !== LibraryEnum.NOTE,
      props: {
        onClick: async () => {
          if(folderStore.lib === LibraryEnum.NOTE) {
            const project = await projectStore.create(folderStore.id, LibraryEnum.NOTE, userStore.account, userStore.hostname)
            const { id, title, lib, abbrev, updateAt, createAt, folderId } = project
            if(recentStore.data.length !== 0) {
              // 如果 recent 没有数据，添加一条数据会导致 recent 无法自动加载
              recentStore.add({
                id,
                title,
                lib,
                abbrev,
                updateAt,
                createAt,
                folderId
              })
            }
            folderStore.addSubFile(project, project.folderId, LibraryEnum.NOTE)
          }
        }
      }
    },
    {
      key: 'search',
      icon: () => renderIcon(SearchOutlined),
      label: '查找',
      show: dropdownState.type === 'rightBtn',
      disabled: true,
      props: {
        onClick: () => {}
      }
    }
  ]
})

const dropdownMethods = {
  handleClickOutside(ev: Event) {
    // 阻止冒泡：实现再点击一次关闭下拉列表
    ev.preventDefault()
    ev.stopPropagation()
    dropdownState.showDropdownRef = false
    dropdownState.type = undefined
  },
  handleSelect() {
    dropdownState.showDropdownRef = false
    dropdownState.type = undefined
  }
}

const handleLeftBtnClick = (ev: MouseEvent) => {
  router.push(`${RoutePathEnum.FOLDER}?id=${folderStore.parentId}`)
  // if(dropdownState.type === 'leftBtn') return dropdownState.type = undefined
  // dropdownState.type = 'leftBtn'
  // const target = ev.target as HTMLElement
  // const rect = target.getBoundingClientRect()
  // dropdownState.target = target
  // nextTick().then(() => {
  //   dropdownState.showDropdownRef = true
  //   dropdownState.xRef = rect.x
  //   dropdownState.yRef = rect.y + 28
  //   dropdownState.showArrowRef = false
  //   dropdownState.placementRef = 'bottom-start'
  // })
}
const handleRightBtnClick = (ev: MouseEvent) => {
  if(dropdownState.type === 'rightBtn') return dropdownState.type = undefined
  dropdownState.type = 'rightBtn'
  const target = ev.target as HTMLElement
  const rect = target.getBoundingClientRect()
  dropdownState.target = target
  nextTick().then(() => {
    dropdownState.showDropdownRef = true
    dropdownState.xRef = rect.x + 20
    dropdownState.yRef = rect.y + 28
    dropdownState.showArrowRef = false
    dropdownState.placementRef = 'bottom-end'
  })
}

function getCurrentLibIcon(lib: LibraryEnum | undefined) {
  switch (lib) {
    case LibraryEnum.NOTE:
      return Notebook
    case LibraryEnum.COURSE:
      return PlayLesson
    case LibraryEnum.PROCEDURE:
      return CoffeeMaker
    default:
      return StickyNote2Outlined 
  }
}

function handleFloatBtnClick(ev) {
  if(dropdownState.type === 'floatBtn') return dropdownState.type = undefined
  dropdownState.type = 'floatBtn'
  const target = ev.target as HTMLElement
  const rect = target.getBoundingClientRect()
  dropdownState.target = target
  nextTick().then(() => {
    dropdownState.showDropdownRef = true
    dropdownState.xRef = rect.x
    dropdownState.yRef = rect.y + 28
    dropdownState.showArrowRef = false
    dropdownState.placementRef = 'left'
  })
}

function getFolderName(name: string) {
  switch (name) {
    case 'NOTE ROOT DIR':
      return '笔记根目录'
    case 'COURSE ROOT DIR':
      return '工程根目录'
    case 'PROCEDURE ROOT DIR':
      return '课程根目录'
    default:
      return name
  }
}
</script>

<template>
  <div class="header">
    <div class="item leftBtn" @click="handleLeftBtnClick">
      <n-icon v-if="folderStore.parentId" class="icon" :component="KeyboardArrowLeftFilled" :size="24" />
    </div>
    <div class="item title">
      <span>{{ getFolderName(folderStore.name) }}</span>
    </div>
    <div class="item rightBtn" @click="handleRightBtnClick">
      <n-icon class="icon" :component="AddCircleOutlineFilled" :size="24" />
    </div>
  </div>
  <!-- 右击下拉列表 -->
  <n-dropdown
    trigger="manual"
    :placement="dropdownState.placementRef"
    :show-arrow="dropdownState.showArrowRef"
    :x="dropdownState.xRef"
    :y="dropdownState.yRef"
    :options="options"
    :show="dropdownState.showDropdownRef"
    @select="dropdownMethods.handleSelect"
    @clickoutside="dropdownMethods.handleClickOutside"
  />
  <n-float-button class="floatbtn" :right="-6" :bottom="150" shape="square" @click="handleFloatBtnClick">
    <n-icon class="icon" :component="getCurrentLibIcon(folderStore.lib)" size="24px"/>
  </n-float-button>
</template>

<style lang="scss" scoped>
.header {
  height: 55px;
  min-height: 55px;
  background-color: v-bind('themeVars.cardColor');
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  .item {
    display: flex;
    align-items: center;
    font-size: 16px;
  }
  .leftBtn {
    width: 48px;
  }
  .rightBtn {
    width: 24px;
  }
}
.icon {
  pointer-events: none;
}
</style>
