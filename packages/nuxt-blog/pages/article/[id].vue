<script setup lang="ts">
definePageMeta({
  layout: 'article'
})
const route = useRoute()
if (!route.params.id) {
  console.log('警告！确保用户已经通过身份验证！')
  navigateTo('/')
}
</script>


<template>
  <div>
    <Article :id="(route.params.id as string)" />
  </div>
</template>

