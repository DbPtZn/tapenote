<script lang="ts" setup>
import Tip from '../../_common/Tip.vue'
defineProps<{
  
}>()
</script>

<template>
  <div class="setting">
    <n-flex class="wrapper">
      <div class="item">
        <span>
          是否自动剪除录制语音首尾的静音段？
          <Tip class="tip">
            - 仅对单段的短录制有效。
            <br>
            - 剪除成功与否可能受环境音影响。
          </Tip>
        </span>
        <n-switch />
      </div>
      <div>
        
      </div>
    </n-flex>
  </div>
</template>

<style lang="scss" scoped>
.setting {
  margin-top: 24px;
  height: 100%;
  width: 100%;
  display: flex;
  .wrapper {
    width: 100%;
  }
}
.item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .tip {
    display: inline;
  }
}
</style>
