<script lang="ts" setup>
//
</script>

<template>
  <div class="code-403">
    <n-result status="403" title="403 禁止访问" description="">
      <template #footer>
        <n-button>返回</n-button>
      </template>
    </n-result>
  </div>
</template>

<style lang="scss" scoped>
.code-403 {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
