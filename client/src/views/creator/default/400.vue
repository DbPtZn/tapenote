<script lang="ts" setup>
defineProps<{
  onClose: () => void
}>()
</script>

<template>
  <div class="code-400">
    <n-result status="error" title="400 请求错误" description="">
      <template #footer>
        <n-button @click="onClose">关闭</n-button>
      </template>
    </n-result>
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
