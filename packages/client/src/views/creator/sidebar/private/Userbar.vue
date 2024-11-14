<template>
  <div class="sidebar-userbar">
    <n-avatar class="sidebar-userbar-item-avatar" size="medium" :src="avatar" :fallback-src="'./avatar03.png'" />
    <div class="sidebar-userbar-item-label">
      <span>{{ nickName }}</span>
      <Icon icon="mingcute:vip-3-fill" :style="{ marginLeft: '4px', color: '#fbe30a', display: isVip ? 'inline-block' : 'none' }" />
    </div>
    <div class="sidebar-userbar-item-icon">
      <Icon icon="material-symbols:keyboard-arrow-down-rounded" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { Icon } from '@iconify/vue'
const props = defineProps<{
  nickName: string
  avatar: string
  isVip: boolean
}>()
// const themeVars = useThemeVars()
// const imgProps = {
//   src: props.avatar,
//   onError: (ev) => handleError(ev) 
// }
// function handleError(ev: Event) {
//   console.log(ev)
//   const target = ev.target as HTMLImageElement
//   target.src = './default.png'
// }
</script>

<style lang="scss" scoped>
.sidebar-userbar {
  display: flex;
  flex-direction: row;
  align-self: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
}

.sidebar-userbar-item-avatar {
  pointer-events: none;
  &:hover {
    cursor: pointer;
    transition: 0.3s ease-in-out;
    scale: 1.2;
  }
}

.sidebar-userbar-item-label {
  flex: 1;
  display: flex;
  align-items: center;
  user-select: none;
  pointer-events: none;
  width: 150px;
  margin: 0 8px;
  overflow: hidden;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.sidebar-userbar-item-icon {
  pointer-events: none;
  display: flex;
  align-items: center;
  user-select: none;
}
</style>
