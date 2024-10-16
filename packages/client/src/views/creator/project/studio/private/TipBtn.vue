<script lang="ts" setup>
defineProps<{
  tip: string
  delay?: number
}>()
</script>

<template>
  <n-popover trigger="hover" :delay="delay || 100">
    <template #trigger>
      <slot />
    </template>
    <span>{{ tip }}</span>
  </n-popover>
</template>
