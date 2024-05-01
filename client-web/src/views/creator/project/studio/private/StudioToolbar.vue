<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { computed, ref } from 'vue'
const themeVars = useThemeVars()
const props = defineProps<{
  height?: string | number
  letfWidth?: string | number
  rightWidth?: string | number
}>()
</script>

<template>
  <div class="toolbar" :style="{ height: height || '38px' }">
    <div class="toolbar-left" :style="{ width: letfWidth }">
      <n-space class="toolbar-space" :item-style="{ display: 'flex', alignItems: 'center', overflow: 'hidden', flexWrap: 'nowrap' }" :size="'small'">
        <slot name="left" />
      </n-space>
    </div>
    <div class="toolbar-right" :style="{ width: rightWidth }">
      <n-space class="toolbar-space" :item-style="{ display: 'flex', alignItems: 'center', overflow: 'hidden', flexWrap: 'nowrap' }" :size="'small'">
        <slot name="right" />
      </n-space>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  width: 100%;
  height: 34px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0px 6px;
  border-top: 1px solid v-bind('themeVars.dividerColor');
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
  .toolbar-left {
    display: flex;
    align-items: center;
    overflow: hidden;
    height: 100%;
  }
  .toolbar-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    overflow: hidden;
    height: 100%;
  }
  .toolbar-space {
    flex-wrap: nowrap!important;;
    overflow: hidden;
  }
  // .toolbar-btn {
  //   height: 100%;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   box-sizing: border-box;
  //   padding: 4px 2px 2px;
  //   border-radius: 3px;
  //   &:hover {
  //     background-color: v-bind('themeVars.buttonColor2Hover');
  //   }
  // }
}
</style>
