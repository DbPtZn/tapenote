<template>
  <n-config-provider :style="{ height: '100%' }" :theme="appConfig.theme.dark ? darkTheme : null">
    <n-dialog-provider>
      <n-message-provider>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { useThemeVars } from 'naive-ui'
definePageMeta({
  layout: 'default'
})
const appConfig = useAppConfig()
useSeoMeta({
  titleTemplate: 'Tapenote Blog',
  description: 'Blog for Tapenote',
  ogImage: 'logo.png',
  ogImageAlt: 'Tapenote Blog',
  twitterImage: 'logo.png',
  twitterSite: '@Tapenote',
  twitterCreator: '@Tapenote',
  twitterCard: 'summary_large_image'
})
useHead({
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
})
</script>
