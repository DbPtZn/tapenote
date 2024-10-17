<template>
  <n-config-provider :theme="settingStore.theme" :style="{ width: '100%' }">
    <n-message-provider>
      <n-dialog-provider>
        <slot />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
<script lang="ts" setup>
import { onUnmounted, ref } from 'vue'
import { GlobalTheme, darkTheme, NConfigProvider, NMessageProvider } from 'naive-ui'
import useStore from '@/store'
const { settingStore } = useStore()
</script>

<style scoped></style>
