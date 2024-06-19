<template>
  <div>test</div>
  <div>{{ data }}</div>
  <nuxt-link to="/">index</nuxt-link>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/hello')
// definePageMeta({
//   layout: 'custom'
// })
</script>
