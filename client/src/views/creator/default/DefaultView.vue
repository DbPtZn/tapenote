<script lang="ts" setup>
import { useThemeVars } from 'naive-ui';

// import useStore from '@/store'
// const {  } = useStore()
const themeVars = useThemeVars()
</script>

<template>
  <div class="default">
    <n-result status="success" title="" description="">
      <template #icon>
        <div style="width: 300px">
          <!-- 123 -->
        </div>
      </template>
      <template #footer>
        <!-- <n-button>新建</n-button> -->
      </template>
    </n-result>
  </div>
</template>

<style lang="scss" scoped>
.default {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
  border-right: 1px solid v-bind('themeVars.dividerColor');
}
</style>
