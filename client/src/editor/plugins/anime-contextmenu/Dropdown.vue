<script lang="ts" setup>
import { Keymap } from '@textbus/core'
import { useThemeVars } from 'naive-ui'
import { computed, reactive } from 'vue'
import { UIConfig } from '@/editor'
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
      :to="to" 
      :x="state.x" 
      :y="state.y"
      @clickoutside="emits('clickoutside')"
      @select="emits('select')"
    />
  </UIConfig>
</template>

<style lang="scss" scoped>

</style>
