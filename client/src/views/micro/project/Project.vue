<script lang="ts" setup>
import router from '@/router'
import { computed, onMounted, provide } from 'vue'
import Header from './Header.vue'
import Editor from './editor/Editor.vue'
import { useThemeVars } from 'naive-ui'
import { Bridge } from './bridge'
import { LibraryEnum } from '@/enums'
import useStore from '@/store'
import vconsole from 'vconsole'
const vc = new vconsole()
const bridge = new Bridge()
provide('bridge', bridge)
const id = computed(() => router.currentRoute.value.query.id as string)
const lib = computed(() => router.currentRoute.value.query.lib as LibraryEnum)
const themeVars = useThemeVars()

const { userStore } = useStore()
onMounted(() => {
  console.log(id.value)
})
</script>

<template>
  <Header :id="id" :lib="lib" :account="userStore.account" :hostname="userStore.hostname" />
  <div class="project">
    <Editor :id="id" :lib="lib" :account="userStore.account" :hostname="userStore.hostname"  />
  </div>
</template>

<style lang="scss" scoped>
.project {
  height: 100%;
  width: 100%;
  background-color: v-bind('themeVars.cardColor');
  // display: flex;
  // align-items: center;
  // justify-content: center;
}
</style>
