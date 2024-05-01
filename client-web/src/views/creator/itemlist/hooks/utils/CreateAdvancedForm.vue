<script lang="ts" setup>
import { ref } from 'vue'
import { LibraryEnum } from '@/enums'
import { FolderTreeSelect } from '../../../_common'
const props = defineProps<{
  lib: LibraryEnum
  title: string
  onSubmit: (folderId: string) => void
}>()
const titleVal = ref(props.title)
const folderId = ref('')
function handleSelected(value: string) {
  folderId.value = value
}
function handleSubmit() {
  props.onSubmit(folderId.value)
}

</script>
<template>
  <div class="create">
    <n-space :vertical="true">
      <span>标题</span>
      <n-input v-model:value="titleVal" type="text" placeholder="" disabled />
      <span>目录</span>
      <FolderTreeSelect :lib="lib" @on-update-value="handleSelected"/>
      <div class="footer">
        <n-button class="confirm" @click="handleSubmit"> 创建 </n-button>
      </div>
    </n-space>
  </div>
</template>

<style lang="scss" scoped>
.create {
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
  margin-top: 12px;
}
</style>
