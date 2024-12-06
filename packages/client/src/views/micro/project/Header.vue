<script lang="ts" setup>
import { LibraryEnum, RoutePathEnum } from '@/enums'
import dayjs from 'dayjs'
import { Icon } from '@iconify/vue'
import { DropdownOption, useThemeVars } from 'naive-ui'
import { computed, h, inject, reactive, ref } from 'vue'
import useStore from '@/store'
import router from '@/router'
import { Subscription } from '@tanbo/stream'
import { Bridge } from '@/views/creator/project/bridge'

const props = defineProps<{
  id: string
  lib: LibraryEnum
  account: string
  hostname: string
}>()
const bridge = inject('bridge') as Bridge
const { folderStore, projectStore } = useStore()
const data = computed(() => projectStore.get(props.id))
const subs: Subscription[] = []
const themeVars = useThemeVars()
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

const isEditable = ref(false)

subs.push(
  bridge.onEditable.subscribe((state) => {
    isEditable.value = state
  })
)
function getLeftBtnIcon() {
  return isEditable.value ? 'fluent:checkmark-12-filled' : 'material-symbols:arrow-back-ios'
}
const handleLeftBtnClick = (ev: MouseEvent) => {
  if(isEditable.value) {
    console.log('save')
    bridge.handleSave()
    bridge.handleEditable(false)
  } else {
    router.back()
  }
}



function renderIcon(icon: string) {
  return h(Icon, { icon: icon, height: 24 })
}
const handleRightBtnClick = (ev: MouseEvent) => {
  isDrawerActive.value = !isDrawerActive.value
  // if(dropdownState.type === 'rightBtn') return dropdownState.type = undefined
  // dropdownState.type = 'rightBtn'
  // const target = ev.target as HTMLElement
  // const rect = target.getBoundingClientRect()
  // dropdownState.target = target
  // nextTick().then(() => {
  //   dropdownState.showDropdownRef = true
  //   dropdownState.xRef = rect.x + 20
  //   dropdownState.yRef = rect.y + 28
  //   dropdownState.showArrowRef = false
  //   dropdownState.placementRef = 'bottom-end'
  // })
}

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

const options = computed<DropdownOption[]>(() => {
  return [
    //
  ]
})

// function handleFloatBtnClick(ev) {
//   if(dropdownState.type === 'floatBtn') return dropdownState.type = undefined
//   dropdownState.type = 'floatBtn'
//   const target = ev.target as HTMLElement
//   const rect = target.getBoundingClientRect()
//   dropdownState.target = target
//   nextTick().then(() => {
//     dropdownState.showDropdownRef = true
//     dropdownState.xRef = rect.x
//     dropdownState.yRef = rect.y + 28
//     dropdownState.showArrowRef = false
//     dropdownState.placementRef = 'left'
//   })
// }

const isDrawerActive = ref(false)

</script>

<template>
  <div class="header">
    <div class="item leftBtn" @click="handleLeftBtnClick">
      <Icon class="icon" :icon="getLeftBtnIcon()" :size="24" />
    </div>
    <div class="item title">
      <span> </span>
    </div>
    <div class="item rightBtn" @click="handleRightBtnClick">
      <!-- <n-icon class="icon" :component="MoreHorizFilled" :size="24" /> -->
      <Icon icon="material-symbols:more-horiz" height="24" />
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
  <!-- <n-float-button class="floatbtn" :right="-6" :bottom="150" shape="square" @click="handleFloatBtnClick">
    <n-icon class="icon" :component="getCurrentLibIcon(folderStore.lib)" size="24px"/>
  </n-float-button> -->

  <n-drawer v-model:show="isDrawerActive" :height="'50%'" :placement="'bottom'">
    <n-drawer-content>
      <n-flex style="width: 100%;">
        <!-- 文章详情 -->
        <n-descriptions style="width: 100%;" label-style="white-space: nowrap;" label-placement="left" label-align="center" :column="1" :bordered="true" title="详情">
          <n-descriptions-item label="作者"> {{data?.detial.penname}} </n-descriptions-item>
          <!-- <n-descriptions-item label="邮箱"> {{data?.detial.email}} </n-descriptions-item>
          <n-descriptions-item label="作者主页"> {{data?.detial.homepage}} </n-descriptions-item> -->
          <n-descriptions-item label="创建时间"> {{dayjs(data?.createAt).format('YYYY-MM-DD HH:mm:ss')}} </n-descriptions-item>
          <n-descriptions-item label="更新时间"> {{dayjs(data?.updateAt).format('YYYY-MM-DD HH:mm:ss')}} </n-descriptions-item>
          <n-descriptions-item label="字数"> {{data?.detial.wordage}} </n-descriptions-item>
        </n-descriptions>
        <n-divider />
        <!-- 文件夹 -->
        <div style="width: 100%;display: flex; align-items: center;justify-content: space-between;">
          <span style="margin-right: 6px;">所在文件夹：<span :style="{ color: themeVars.primaryColor }">{{ data?.folder.name }}</span></span>
          <n-button size="tiny" @click="router.push(`${RoutePathEnum.FOLDER}?id=${data?.folderId}`)">前往</n-button>
        </div>
        <n-divider />
      </n-flex>
    </n-drawer-content>
  </n-drawer>
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
