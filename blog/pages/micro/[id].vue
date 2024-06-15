<script setup lang="ts">
const route = useRoute()
console.log(route.meta)
if (route.params.group === 'admins' && !route.params.id) {
  console.log('警告！确保用户已经通过身份验证！')
}
</script>


<template>
  <div>
    micro + {{ $route.params.id }}
  </div>
</template>

