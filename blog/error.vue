<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <n-result
    :status="(error?.statusCode + '') || 'error'"
    :title="error?.title"
    :description="error?.message"
  >
    <template #footer>
      <n-button @click="handleError">返回</n-button>
    </template>
  </n-result>
</template>