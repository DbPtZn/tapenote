<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { UIConfig } from '../..'
const props = defineProps<{
  show: () => boolean
  x: () => number
  y: () => number
  options: () => []
  to: HTMLElement
}>()
const state = reactive({
  show:  computed(() => props.show?.()),
  x: computed(() => props.x?.()),
  y: computed(() => props.y?.()),
  options: computed(() => props.options?.())
})
const emits = defineEmits<{
  select: [],
  clickoutside: []
}>()

</script>

<template>
  <UIConfig>
    <n-dropdown
      :show="state.show"
      :placement="'bottom-start'" 
      :options="state.options" 
      to="body" 
      :x="state.x" 
      :y="state.y"
      @clickoutside="emits('clickoutside')"
      @select="emits('select')"
    />
  </UIConfig>
</template>

<style lang="scss" scoped>

</style>
