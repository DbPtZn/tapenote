<script lang="ts" setup>
defineProps<{
  tip: string
  delay?: number
}>()
</script>

<template>
  <n-popover trigger="hover" :delay="delay || 1000" :placement="'left'">
    <template #trigger>
      <slot />
    </template>
    <span>{{ tip }}</span>
  </n-popover>
</template>
