<script lang="ts" setup>
// import { FractalContainerInjectKey } from '@/renderer';
import { inject, onMounted } from 'vue';

// const node = inject(FractalContainerInjectKey)
const props = defineProps<{
  // container: any
  onClose: () => void
}>()

onMounted(() => {
  // console.log(props.container)
})
</script>

<template>
  <div class="code-404">
    <n-result status="404" title="404 资源不存在" description="">
      <template #footer>
        <n-button @click="onClose">关闭</n-button>
      </template>
    </n-result>
  </div>
</template>

<style lang="scss" scoped>
.code-404 {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
