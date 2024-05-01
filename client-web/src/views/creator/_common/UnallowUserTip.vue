<template>
  <n-tooltip trigger="hover" v-if="show">
    <template #trigger>
      <div class="state">
        <span :style="{ fontSize: '16px', marginRight: '6px' }">{{ username }}</span>
        <span>|</span>
        <n-icon :component="LockRound" :size="18" :style="{ marginLeft: '6px' }" />
      </div>
    </template>
    <span>非当前用户，不可编辑</span>
  </n-tooltip>
</template>

<script lang="ts" setup>
import { LockRound } from '@/components'
import { useThemeVars } from 'naive-ui'
const themeVars = useThemeVars()
const props = defineProps<{
  show: boolean
  username: string
}>()
</script>

<style lang="scss" scoped>
.state {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
