<!-- 创建编辑器页面（用于测试编辑器 :: 因为 vite 热重载会导致 props 数据丢失致使编辑器启动失败） -->
<script lang="ts" setup>
import { LibraryEnum } from '@/enums'
import router from '@/router'
import useStore from '@/store'
import Editor from '@/views/creator/project/editor/Editor.vue'
import Project from '@/views/creator/project/ProjectView.vue'
import { onMounted } from 'vue'
import { computed } from 'vue'
const id = computed(() => router.currentRoute.value.query.id as string)
const lib = computed(() => router.currentRoute.value.query.lib as LibraryEnum)
const { userStore } = useStore()
const account = computed(() => userStore.account)
const hostname = computed(() => userStore.hostname) 
// onMounted(() => {})
</script>

<template>
  <div class="editor-page">
    <!-- <Editor :id="id" :lib="lib" :account="account" :hostname="hostname" :readonly="() => false"  /> -->
    <Project :id="id" :lib="lib" :account="account" :hostname="hostname" />
  </div>
</template>

<style lang="scss" scoped>
.editor-page {
  display: flex;
  height: 100%;
  width: 100%
}
</style>