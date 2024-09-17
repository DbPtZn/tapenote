<template>
  <n-config-provider :theme="theme" :style="{ width: '100%' }">
    <n-message-provider>
      <slot />
    </n-message-provider>
  </n-config-provider>
</template>
<script lang="ts" setup>
import { inject, onUnmounted, ref } from 'vue'
import { GlobalTheme, darkTheme, NConfigProvider, NMessageProvider } from 'naive-ui'
import { Injector } from '@textbus/core'
import { ThemeProvider } from '..'
const injector = inject<Injector>('injector')
const themeProvider = injector?.get(ThemeProvider)
const theme = ref<GlobalTheme | null | undefined>(themeProvider?.theme === 'dark' ? darkTheme : null)
const sub = themeProvider?.onThemeUpdate.subscribe(themeState => {
  switch (themeState) {
    case 'dark':
      theme.value = darkTheme
      break
    case 'light':
      theme.value = null
      break
    default:
      return
  }
})
onUnmounted(() => {
  sub?.unsubscribe()
})
</script>

<style scoped></style>
