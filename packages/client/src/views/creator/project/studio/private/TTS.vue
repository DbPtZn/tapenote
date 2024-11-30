<script lang="ts" setup>
import { useMessage, useThemeVars } from 'naive-ui'
import { ref } from 'vue'
import { computed } from 'vue'
defineProps<{
  readonly: boolean
}>()
const emits = defineEmits<{
  output: [ txt: string, cb: (txt: string) => void ]
}>()
const themeVars = useThemeVars()
const inputValue = ref('')
const message = useMessage()
const txtNum = computed(() => inputValue.value.length)
function output() {
  // 清除换行\空字符
  inputValue.value = inputValue.value.replace(/(\r\n|\n|\r|\s)/gm, "")
  if (inputValue.value.length > 150) {
    message.error('语音合成一次不能超过 150 个字')
    return
  }
  // 输出后输入框会置空，如果输出失败可以通过回调函数将用户输入内容恢复到输入框中
  emits('output', inputValue.value, (txt) => {
    setTimeout(() => {
      inputValue.value = txt
    }, 0)
  })
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
      @keyup.enter="output"
    ></textarea>
    <div class="btn-wrapper">
      <button :class="['btn', readonly ? 'disabled' :'']" @click="output" :disabled="readonly">合成</button>
    </div>
    <div class="txt-num" >
      <span>{{ txtNum }} / 150</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.disabled {
  opacity: 0.8;
  cursor: not-allowed!important;
}
.txt-num {
  position: absolute;
  bottom: 24px;
  left: 20px;
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
