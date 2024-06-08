<script lang="ts" setup>
import { inject } from 'vue'
const useClose = inject('useClose') as () => void
defineProps<{
  content: string | HTMLElement
  name: string
}>()
</script>
<template>
  <div ref="cardRef" class="card" @click="useClose">
    <div class="content" v-html="content"></div>
    <div class="name" @click.stop="ev => ev.preventDefault()">{{ name || '' }}</div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  display: inline-block;
  margin: 5px 10px;
}
.content {
  cursor: pointer;
  transition: scale 0.1s ease-in-out;
  &:hover {
    scale: 1.2;
  }
}
.name {
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
</style>
