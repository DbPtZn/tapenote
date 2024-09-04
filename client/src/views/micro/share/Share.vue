<script lang="ts" setup>
defineProps<{
  onClose: () => void
}>()
</script>

<template>
  <div class="code-400">
    <n-result status="info" title="开发中" description="" />
  </div>
</template>

<style lang="scss" scoped>
.code-400 {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
