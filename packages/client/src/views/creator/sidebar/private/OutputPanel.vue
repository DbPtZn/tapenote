<script lang="ts" setup>
defineProps<{}>()
</script>

<template>
  <div class="output">
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" tab="Oasis"> 导出全部 </n-tab-pane>
      <n-tab-pane name="the beatles" tab="the Beatles"> 选择导出 </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style lang="scss" scoped>
.output {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
