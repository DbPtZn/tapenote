<script lang="ts" setup>
//
</script>

<template>
  <div class="code-400">
    <n-result status="error" title="400 请求错误" description="">
      <template #footer>
        <n-button>返回</n-button>
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
