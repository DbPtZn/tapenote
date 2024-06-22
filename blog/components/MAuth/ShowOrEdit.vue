
<script lang="ts" setup>
import { NInput } from 'naive-ui'
import { watch } from 'vue';
const props = defineProps<{
  hightlight: boolean
  isEdit: boolean
  value: string
  onUpdateValue: (value: string) => void
  type?: string 
}>()

const inputRef = ref<ComponentInstance<typeof NInput>>()
const inputValue = ref(props.value)
watch(() => props.isEdit, () => {
  // 确保 input 内容和展示内容的一致性
  inputValue.value = props.value
})
function handleChange() {
  props.onUpdateValue!(inputValue.value)
}

</script>

<template>
  <div style="min-height: 22px" >
    <n-input 
      v-if="isEdit"
      :placeholder="type"
      ref="inputRef"
      v-model:value="inputValue"
      @update:value="v => inputValue = v"
      @blur="handleChange"
      @change="handleChange"
    />
    <span v-if="!isEdit" :class="[value ? '' : 'placeholder', hightlight ? '' : 'disabled']">{{ value || type==='描述' ? value : '未设置' }}</span>
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
