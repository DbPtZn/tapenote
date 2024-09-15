<script lang="ts" setup>
import { computed, ComputedRef, PropType } from 'vue'
const props = defineProps({
  /**
   * number => number + 'px';
   * string => string (传入字符串请直接加上单位)
   * 默认值：'auto'
   */
  height: {
    type: [Number, String],
    default: 'auto'
  },
  /**
   * number => number + 'px';
   * string => string (传入字符串请直接加上单位)
   * 默认值：'100%'
   */
  width: {
    type: [Number, String],
    default: '100%'
  },
  flex: {
    type: [Number, String],
    default: 'unset'
  }
})
const heightVal = computed<string>(() => {
  if (typeof props.height === 'number') return props.height + 'px'
  return props.height
})
const widthVal = computed<string>(() => {
  if (typeof props.width === 'number') return props.width + 'px'
  return props.width
})
</script>

<template>
  <div class="footer">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex: v-bind(flex);
  box-sizing: border-box;
  position: relative;
  height: v-bind(heightVal);
  width: v-bind(widthVal);
}
</style>
