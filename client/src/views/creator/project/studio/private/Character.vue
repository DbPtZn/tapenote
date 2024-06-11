<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { ref } from 'vue'
defineProps<{
  isMarked: boolean
  serial: string | number | null
}>()
const themeVars = useThemeVars()
const badgeRef = ref<HTMLElement>()
// TODO 考虑根据 serial 调整 badge 的宽度，暂不实现
</script>
<template>
  <span ref="badgeRef" :class="['character', 'animation-layer', isMarked ? 'marked' : '', isMarked ? 'badge' : '']">
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.animation-layer {
  display: inline-block;
  margin: 2px 5px;
}
.character {
  position: relative;
  color: v-bind('themeVars.textColor2') !important;
  user-select: none;
  cursor: pointer;
  &:hover {
    color: v-bind('themeVars.textColor1');
  }
  &:active {
    text-shadow: 1px 0px rgb(131, 131, 131);
  }
}
.badge {
  &:after {
    content: attr(data-serial);
    top: -8px;
    left: 8px;
    position: absolute;
    padding: 0 4px;
    vertical-align: super;
    color: white;
    background-color:#1989fa9c;
    border-radius: 24px;
    display: inline-block;
    min-width: 10px;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
    -webkit-border-radius: 90px;
    border-radius: 45px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    // pointer-events: auto;
    pointer-events: none;
  }
}
</style>
