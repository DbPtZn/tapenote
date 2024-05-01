<script lang="ts" setup>
import { MoreHoriz } from '@/components'
import { LibraryEnum } from '@/enums'
import { VNodeChild } from 'vue'
interface CollapseOptions {
  label: string
  icon: () => VNodeChild
  name: string
}
defineProps<{
  options: CollapseOptions[]
}>()
const emits = defineEmits<{
  dropdown: [PointerEvent, LibraryEnum]
}>()
function handleClick(ev: PointerEvent, name: LibraryEnum) {
  ev.preventDefault()
  ev.stopPropagation()
  emits('dropdown', ev, name)
}
</script>

<template>
  <n-collapse>
    <n-collapse-item class="item" v-for="(item, index) in options" :key="index" :title="item.label" :name="item.name">
      
      <slot :slotName="item.name" />
      <template #header>
        <component class="header-icon" :is="item.icon" />
        <span>{{ item.label }}</span>
      </template>
      <template #header-extra>
        <n-icon class="icon" :component="MoreHoriz" :size="24" @click="handleClick($event, item.name as LibraryEnum)"/>
      </template>
    </n-collapse-item>
  </n-collapse>
</template>

<style lang="scss" scoped>
.header-icon {
  margin-right: 6px;
}
.item {
  user-select: none;
  .icon {
    transition: opacity 0.1s ease-in-out;
    opacity: 0;
  }
  &:hover {
    .icon {
      opacity: 1;
    }
  }
}
</style>
