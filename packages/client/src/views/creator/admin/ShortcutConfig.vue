<script lang="ts" setup>

const shortcuts = new Map<string, { ctrl: boolean; alt: boolean; shift: boolean; key: string }>([
  ['save', { ctrl: true, alt: false, shift: false, key: 's' }],
  ['undo', { ctrl: true, alt: false, shift: false, key: 'z' }],
  ['redo', { ctrl: true, alt: false, shift: false, key: 'y' }],
  ['record', { ctrl: true, alt: false, shift: false, key: 'y' }],
  
])

// 第一个键只需要返回首个 true 的键即可
function getFirst(shortcut: { ctrl: boolean; alt: boolean; shift: boolean; key: string }) {
  for (const key in shortcut) {
    if(shortcut[key]) return key
  }
}

// 第二个键需要过滤第一个键
function getSecond(str: string) {
  //
}

function getThird(str: string) {
  
}



</script>

<template>
  <div class="shortcut">
    <div v-for="(item, index) in shortcuts" :key="index" class="shortcut-item">
      <span class="shortcut-item-action">{{ item[0] }}</span>
      <!-- <span class="shortcut-item-1">{{ item[] }}</span>
      <span class="shortcut-item-2">{{ item.ctrl ? 'Ctrl' : '' }}</span>
      <span class="shortcut-item-3">{{ item.alt ? 'Alt' : '' }}</span> -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
