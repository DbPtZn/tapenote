<template>
  <NuxtLayout> 
    <NuxtPage />
  </NuxtLayout> 
</template>

<script setup lang="ts">
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
  twitterCard: 'summary_large_image',
})
useHead({
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ]
})
</script>
