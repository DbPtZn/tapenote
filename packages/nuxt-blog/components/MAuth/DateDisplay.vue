<script lang="ts" setup>
import dayjs from 'dayjs'
const props = defineProps<{
  hightlight: boolean
  date: string
}>()
const year = new Date().getFullYear().toString()
</script>

<template>
  <div :class="[hightlight ? '' : 'disabled']">
    {{ date.substring(0, 4) === year ? dayjs(date).format('M月DD日 HH:mm:ss') : dayjs(date).format('YYYY年MM月DD日 HH:mm:ss') }}
  </div>
</template>

<style lang="scss" scoped>
.disabled {
  opacity: 0.5;
}
</style>
