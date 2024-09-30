<script lang="ts" setup>
import { useMessage, useThemeVars } from 'naive-ui'
import { ref } from 'vue'
const props = defineProps<{
  readonly: boolean
}>()
const emits = defineEmits(['onTextOutput'])
const themeVars = useThemeVars()
const inputValue = ref('')
const message = useMessage()
const output = (ev) => {
  if (containsEnglish(inputValue.value)) {
    message.warning('目前语音合成模型暂不支持英文！')
    return
  }
  if (ev.key === 'Enter') {
    // 清除换行的符号
    inputValue.value = inputValue.value.replace(/(\r\n|\n|\r)/gm, "")
  }
  emits('onTextOutput', inputValue.value)
  inputValue.value = ''
}
/** 检测字符串是否包含英文 */
function containsEnglish(text: string) {
  // 使用正则表达式匹配英文字符
  const englishRegex = /[a-zA-Z]/;
  // 检查字符串中是否包含英文字符
  return englishRegex.test(text);
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
      @keyup.enter="output"
    ></textarea>
    <div class="btn-wrapper">
      <button :class="['btn', readonly ? 'disabled' :'']" @click="output" :disabled="readonly">合成</button>
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
  // flex: 1;
  width: 100%;
  height: 100%;
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
/** 定制滚动条 */
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  background-color: unset;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: unset;
}

// /*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: unset;
  background-color: unset;
}
</style>
