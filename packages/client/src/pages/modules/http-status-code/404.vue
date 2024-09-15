<script lang="ts" setup>
import { RouteNameEnum } from '@/enums';

//
</script>

<template>
  <div class="code-404">
    <n-result status="404" title="404 资源不存在" description="">
      <template #footer>
        <n-button @click="$router.push({ name: RouteNameEnum.HOME })">返回</n-button>
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
