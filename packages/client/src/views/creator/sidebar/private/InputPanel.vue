<script lang="ts" setup>
import { LibraryEnum } from '@/enums'
import FolderTreeSelect from '../../_common/FolderTreeSelect.vue'
defineProps<{
  lib: LibraryEnum
}>()
function handleSelect(key: string) {
  console.log(key)
}
</script>

<template>
  <div class="input">
    <FolderTreeSelect
      :lib="lib"
      @select="handleSelect"
    />
    <!-- <n-tabs type="line" animated>
      <n-tab-pane name="oasis" tab="Oasis"> 导入 </n-tab-pane>
      <n-tab-pane name="the beatles" tab="the Beatles"> 选择目录 </n-tab-pane>
    </n-tabs> -->
  </div>
</template>

<style lang="scss" scoped>
.input {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
