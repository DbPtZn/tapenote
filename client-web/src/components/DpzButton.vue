<script setup lang="ts">
const props = defineProps<{
  /** 类名图标 */
  active?: boolean
  /** 是否禁用 */
  disabled?: boolean
}>()

</script>
<template>
  <button :class="['dpz-btn', active ? 'active' : '', disabled ? 'disabled' : '']" :disabled="disabled">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.dpz-btn {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  color: var(--dpz-textColor1);
  background-color: unset;
  box-sizing: border-box;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: var(--dpz-buttonColorHover);
  }
}
.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.active {
  background-color: var(--dpz-buttonColorPressed);
}
</style>
