<script lang="ts" setup>
import { ref } from 'vue'
import { LibraryEnum } from '@/enums'
import { FolderTreeSelect } from '../../_common'
// const { folderTreeStore, userStore, userListStore } = useStore()
const props = defineProps<{
  lib: LibraryEnum
  onSubmit: (folderId: string) => void
}>()
const folderId = ref('')
function handleSelected(value: string) {
  folderId.value = value
}
function handleSubmit() {
  props.onSubmit(folderId.value)
}

</script>
<template>
  <div class="select-folder">
    <n-space :vertical="true">
      <span>目录</span>
      <FolderTreeSelect :lib="lib" @on-update-value="handleSelected"/>
      <div class="footer">
        <n-button class="confirm" @click="handleSubmit"> 确定 </n-button>
      </div>
    </n-space>
  </div>
</template>

<style lang="scss" scoped>
.select-folder {
  padding: 24px 0px 0px 0px;
}
.footer {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: end;
}
.confirm {
  width: 100%;
  // height: 40px;
  // border: none;
  // font-weight: bold;
  // letter-spacing: 8px;
  // border-radius: 10px;
  margin-top: 12px;
  // margin-right: 12px;
  // cursor: pointer;
}
</style>
