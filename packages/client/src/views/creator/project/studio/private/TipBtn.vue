<script lang="ts" setup>
defineProps<{
  tip: string
}>()
</script>

<template>
  <n-popover trigger="hover">
    <template #trigger>
      <slot />
    </template>
    <span>{{ tip }}</span>
  </n-popover>
</template>
