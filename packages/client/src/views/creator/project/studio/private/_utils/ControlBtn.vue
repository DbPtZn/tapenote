<script lang="ts" setup>
defineProps<{
  tip: string,
  disabled?: boolean
}>()
</script>

<template>
  <n-popover trigger="hover">
    <template #trigger>
      <div :class="{ btn: true, disabled: disabled }">
        <slot />
      </div>
    </template>
    <span>{{ tip }}</span>
  </n-popover>
</template>

<style lang="scss" scoped>
.btn {
  display: flex;
  align-items: center;
  // padding: 6px;
  // border: 1px solid #3a3a3a;
  // cursor: pointer;
  // &:hover {
  //   background-color: #3a3a3a;
  // }
  // &:active {
  //   background-color: #1d1d1d;
  // }
}
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
