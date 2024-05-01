<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  /** 类名图标 */
  icon?: string
  /** 图标颜色 */
  color?: string
  /** 图标深度 */
  depth?: 1 | 2 | 3 | 4 | 5
  /** 图标大小（当不指定单位时，默认单位: px） */
  size?: number | string
  /** 传入一个数值，设置图标旋转的速度，数值越小旋转越快 */
  rotate?: number
}>()
const rotateVal = computed(() => props.rotate + 's')
/** 当使用谷歌 material 图标时，拦截 icon 类名，获取最图标名称 */
const material = computed(() => {
  if (props.icon?.includes('material')) {
    const arr = props.icon?.split('-')
    if (!arr || arr[0] !== 'material') {
      return ''
    } else {
      if (arr[arr.length - 1] === 'icons') return ''
      return arr[arr.length - 1]
    }
  }
  return ''
})
</script>
<template>
  <n-icon :size="size" :depth="depth" :color="color">
    <span :material="material" :class="[icon, 'icon', rotateVal && 'rotate']"></span>
  </n-icon>
</template>

<style lang="scss" scoped>
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
.rotate {
  display: block;
  animation: 5s rotate infinite linear;
  animation-duration: v-bind(rotateVal);
}
.icon {
  color: inherit;
  font-size: inherit;
  &::before {
    line-height: 1.1;
  }
}
</style>
