<script lang="ts" setup>
import router from '@/router'
import { computed, onMounted } from 'vue'
const id = computed(() => router.currentRoute.value.params.id as string)
onMounted(() => {
  console.log(id.value)
})
</script>

<template>
  <div class="project">
    {{id}}
  </div>
</template>

<style lang="scss" scoped>
.project {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
