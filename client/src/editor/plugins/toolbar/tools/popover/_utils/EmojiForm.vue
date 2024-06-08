<script lang="ts" setup>
import { inject, onUnmounted } from 'vue'
const useClose = inject('useClose') as () => void | undefined
const props = defineProps<{
  onConfirm?: (value: string) => void
  onConfirmEnd?: () => void
}>()
const emoji: string[] = []
for (let i = 0x1F600; i <= 0x1F64F; i++) {
  emoji.push(i.toString(16).toUpperCase())
}
function createEmoji(item: string) {
  return `&#x${item};`
}
function handleConfirm(ev) {
  const target = ev.target as HTMLElement
  const value = target.innerHTML || ''
  props.onConfirm && props.onConfirm(value)
  props.onConfirmEnd && props.onConfirmEnd()
  useClose && useClose()
}
</script>

<template>
  <div class="emoji-form">
    <div class="textbus-toolbar-emoji-menu">
      <div v-for="item in emoji" :key="item" class="textbus-toolbar-emoji-menu-item" @click="handleConfirm">
        <span v-html="createEmoji(item)"></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.emoji-form {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 6px;
  box-sizing: border-box;
  overflow: hidden;
}
.textbus-toolbar-emoji-menu {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-width: 300px;
  padding: 10px 5px;
  text-align: left;

  &-item {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    font-size: 20px;
    padding: 2px;
    box-sizing: border-box;
    width: 30px;
    line-height: 1.2;
    user-select: none;
    &:hover {
      background-color: var(--tb-buttonColor2Hover);
      border-radius: 3px;
    }
  }
}
</style>
