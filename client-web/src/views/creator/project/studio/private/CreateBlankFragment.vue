/** Txt Edit Dialog */
<script setup lang="ts">
import { ref } from 'vue'
import { Header, Main, Footer } from '@/components'
import { useMessage } from 'naive-ui';
const props = defineProps<{
  onConfirm: (args: { duration: number; txtLength: number }) => void
  onCancel: () => void
}>()
const duration = ref(1)
const txtLength = ref(1)
const message = useMessage()
function handleConfirm() {
  props.onConfirm({
    duration: duration.value,
    txtLength: txtLength.value
  })
}
function handleDurationUpdate(val: number | null) {
  if (val && val === 12) {
    message.warning('最长设置 12 秒')
  }
  if (val && val === 1) {
    message.warning('最短设置 1 秒')
  }
}
function handleTxtLengthUpdate(val: number | null) {
  if (val && val === 36) {
    message.warning('最长设置 36 个')
  }
  if (val && val === 1) {
    message.warning('最少设置 1 个')
  }
}
</script>

<template>
  <div class="blank-fragment">
    <n-flex vertical>
      <n-flex vertical>
        <span>音频时长：</span>
        <n-input-number v-model:value="duration" :button-placement="'both'" :min="1" :max="12" :clearable="false" @update:value="handleDurationUpdate" />
      </n-flex>
      <n-flex vertical>
        <span>占位字符数量：</span>
        <n-input-number v-model:value="txtLength" :precision="0" :button-placement="'both'" :min="1" :max="36" :clearable="false" @update:value="handleTxtLengthUpdate" />
      </n-flex>
    </n-flex>
    <div class="footer">
      <n-button class="btn" type="primary" @click="handleConfirm()"> 确定 </n-button>
      <n-button class="btn" tertiary @click="onCancel"> 取消 </n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blank-fragment {
  margin: 12px;
}
.main {
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 24px;
  .btn {
    margin-left: 12px;
  }
}
</style>
