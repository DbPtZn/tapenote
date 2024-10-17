<script setup lang="ts">
import useStore from '@/store'
import { Icon } from '@iconify/vue'
const { settingStore } = useStore()
</script>
<template>
  <div class="tip">
    <n-popover trigger="hover" :delay="50">
      <template #trigger>
        <Icon v-show="settingStore.isTipsShow" icon="solar:question-circle-line-duotone" height="18"/>
      </template>
      <div>
        <slot />
      </div>
    </n-popover>
  </div>
</template>

<style lang="scss" scoped>
.tip {
  position: absolute;
  opacity: 0.7;
}
</style>
