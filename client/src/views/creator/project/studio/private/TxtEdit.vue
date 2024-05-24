/** Txt Edit Dialog */
<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { useThemeVars } from 'naive-ui'
const props = defineProps<{
  transcript: string[]
  onConfirm: (key: string[]) => void
  onCancel: () => void
}>()
const themeVars = useThemeVars()
const inputs = reactive<string[]>([])
props.transcript.forEach(item => {
  inputs.push(item)
})

const focus = ref(-1)
onMounted(() => {})
function handleConfirm() {
  props.onConfirm(inputs)
}
function handleInput(ev: Event, index: number) {
  const target = ev.target as HTMLInputElement
  target.style.width = 24 + target.value.length * 12 + 'px'
  inputs[index] = target.value ? target.value : ' ' // 不能为空
}
function handleBlur() {
  focus.value = -1
}
function handleFocus(index: number) {
  focus.value = index
}
onUnmounted(() => {

})
</script>

<template>
  <div class="txt-edit">
    <n-thing>
      <template #description>
        <!-- 注意事项 -->
      </template>
      <template #footer>
       <div class="content">
        <div class="token" v-for="(item, index) in inputs" :key="index">
          <input v-show="focus === index" class="input" :value="item" @input="handleInput($event, index)" @blur="handleBlur" />
          <div v-show="focus !== index" class="text" @click.stop="handleFocus(index)">{{ inputs[index] }}</div>
        </div>
       </div>
      </template>
      <template #action>
        <div class="footer">
        <n-button class="btn" type="primary" @click="handleConfirm()"> 确定 </n-button>
        <n-button class="btn" type="primary" @click="onCancel"> 取消 </n-button>
      </div>
      </template>
    </n-thing>
  </div>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.token {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1px;
  margin-right: 1px;
}
.input {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 24px;
  height: 23px;
  white-space: nowrap;
  border: none;
  box-sizing: border-box;
  outline: 1px solid v-bind('themeVars.borderColor');
  padding: 0;
  margin: 0;
  box-shadow: none;
  background-color: v-bind('themeVars.inputColor');
  color: v-bind('themeVars.textColor1');
}
.text {
  display: inline-block;
  text-align: center;
  min-width: 24px;
  width: fit-content;
  height: 24px;
  // line-height: 24px;
  background-color: v-bind('themeVars.inputColor');
  cursor: pointer;
}
.text:hover {
  background-color: v-bind('themeVars.buttonColor2Hover');
}
.main {
  display: flex;
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
