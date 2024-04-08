/** Dialog */
<script setup lang="ts">
import { Subscription, Injector, fromEvent } from '@textbus/core'
import { VNode, inject, onMounted, onUnmounted, ref } from 'vue'
import { darkTheme } from 'naive-ui'
import { ThemeProvider } from '@/editor'
const props = defineProps<{
  /** 是否显示 border */
  bordered?: boolean
  /** 类名(对话框) */
  class?: string
  /** 是否显示 close 图标 */
  closable?: boolean
  /** 是否在摁下 Esc 键的时候关闭对话框 */
  closeOnEsc?: boolean
  /** 内容 */
  content?: VNode
  /** 是否可以通过点击 mask 关闭对话框 */
  maskClosable?: boolean
  /** 对话框打开时执行回调 */
  onOpen?: () => void
  /** 对话框关闭时执行回调 */
  onClose?: () => void
}>()
const destory = inject('destory') as () => void
const textbus = inject<Injector>('injector')!
const themeProvider = textbus.get(ThemeProvider)
let sub = new Subscription()
onMounted(() => {
  props.onOpen && props.onOpen()
  sub = fromEvent<KeyboardEvent>(document, 'keydown').subscribe(ev => {
    if (ev.key === 'Escape') {
      sub.unsubscribe()
      destory()
    }
  })
})
onUnmounted(() => {
  props.onClose && props.onClose()
  sub.unsubscribe()
  destory()
})
const themeState = ref(themeProvider.theme)
themeProvider.onThemeUpdate.subscribe((state) => {
  themeState.value = state
})
</script>

<template>
  <n-config-provider :theme="themeState === 'dark' ? darkTheme : null">
    <div class="temp-dialog">
      <div class="temp-dialog-container">
        <component v-if="content" :is="content" />
      </div>
      <div class="temp-dialog-mask" @click="destory()"></div>
    </div>
  </n-config-provider>
</template>

<style lang="scss" scoped>
.temp-dialog {
  // 全屏
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2333;
  display: flex;
  align-items: center;
  justify-content: center;
  .temp-dialog-container {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    z-index: 3333;
  }
  .temp-dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.3s ease-in-out;
    z-index: 2000;
  }
}
</style>
