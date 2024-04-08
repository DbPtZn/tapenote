<script lang="ts" setup>
import { useThemeVars } from 'naive-ui';
import { ref } from 'vue'
const props = defineProps<{
  readonly: boolean
}>()
const emits = defineEmits(['onTextOutput'])
const themeVars = useThemeVars()
const inputValue = ref('')
const output = () => {
  emits('onTextOutput', inputValue.value)
  inputValue.value = ''
}
</script>

<template>
  <div :class="['TTS', readonly ? 'disabled' :'']">
    <textarea
      name="TTS"
      v-model="inputValue"
      :class="['text-input', readonly ? 'disabled' :'']"
      rows="1"
      placeholder="输入合成文字"
      :disabled="readonly"
      @keyup.enter="output()"
    ></textarea>
    <div class="btn-wrapper">
      <button :class="['btn', readonly ? 'disabled' :'']" @click="output()" :disabled="readonly">合成</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.disabled {
  opacity: 0.8;
  cursor: not-allowed!important;
}

.TTS {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  // background-color: v-bind('themeVars.cardColor');
  background-color:  v-bind('themeVars.bodyColor');
  .text-input {
    // width: 100%;
    flex-grow: 1;
    color: v-bind('themeVars.textColor1');
    // background-color: v-bind('themeVars.cardColor');
    background-color:  v-bind('themeVars.bodyColor');
    font-size: v-bind('themeVars.fontSizeHuge');
    padding: 12px 6px;
    outline: none;
    resize: none;
    border: none;
    user-select: auto;
  }
  .btn-wrapper {
    display: flex;
    justify-content: flex-end;
    .btn {
      width: 60px;
      padding: 5px;
      margin-right: 30px;
      margin-bottom: 20px;
      border-radius: 5px;
      color: v-bind('themeVars.textColor1');
      background-color: v-bind('themeVars.buttonColor2');
      border: none;
      cursor: pointer;
      &:active {
        color: v-bind('themeVars.textColor2');
        background-color: v-bind('themeVars.buttonColor2Pressed');
      }
      &:hover {
        background-color: v-bind('themeVars.buttonColor2Hover');
      }
    }
  }
}
</style>
