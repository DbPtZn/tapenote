<script lang="ts" setup>
import { ref, watch } from 'vue'
const props = defineProps<{
  isEdit: boolean
  value: boolean
  hightlight: boolean
  onUpdateValue: (value: boolean, cb: () => void) => void
}>()
const selectedVal = ref(props.value === false ? 0 : 1)
watch(() => props.isEdit, () => {
   // 确保 select 内容和展示内容的一致性
  selectedVal.value = props.value === false ? 0 : 1
})
const status = [
  { label: '启用', value: 0 },
  { label: '禁用', value: 1 }
]
function handleUpdateValue(v: number) {
  selectedVal.value = v
  props.onUpdateValue(selectedVal.value === 0 ? false : true, () => setOff())
}
function setOff() {
  selectedVal.value = 1
}
</script>

<template>
  <div style="min-height: 22px">
    <n-select v-if="isEdit" v-model:value="selectedVal" :options="status" @update:value="handleUpdateValue" />
    <span v-if="!isEdit" :class="[selectedVal === 0 ? '' : 'placeholder', hightlight ? '' : 'disabled']">{{ status[selectedVal].label }}</span>
  </div>
</template>

<style lang="scss" scoped>
.disabled {
  opacity: 0.5;
}
.placeholder {
  opacity: 0.5;
}
.default {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
