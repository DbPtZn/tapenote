<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { AnimeProvider } from '../..'
type AnimeOption = ReturnType<AnimeProvider['getOptions']>[0]
const props = defineProps<{
  options: AnimeOption[]
  onSelect: (name: string, value: string) => void
}>()
const themeVars = useThemeVars()
function handleSelect(option) {
  props.onSelect(option.label, option.value)
}
</script>
<template>
  <div class="effect-options">
    <div class="effect-options-list">
      <div
        v-for="option in options"
        :key="option.value"
        :class="['option']"
        @click="handleSelect(option)"
        @mouseenter.self="option.play(($event.target as HTMLElement).firstChild as HTMLElement)"
      >
        <div class="option-label">
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.effect-options {
  // height: 360px;
  width: 345px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  .effect-options-list {
    padding: 10px;
  }
}
.option {
  display: inline-block;
  margin: 3px;
  padding: 3px;
  border-radius: 3px 3px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8ad;
  cursor: pointer;
  transition: transform 0.1s;
  &:hover {
    transform: scale(1.1);
  }
  .option-label {
    // color: var(--tb-textColor1);
    color: v-bind('themeVars.textColor1');
    // color: #fff;
  }
}
</style>
