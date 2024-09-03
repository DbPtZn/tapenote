<script lang="ts" setup>
import useStore from '@/store'
import { CreatorView, MicroView } from '@/views'
const { settingStore } = useStore()
</script>

<template>
  <div class="creator-page">
    <CreatorView v-if="!settingStore.isMobile" />
    <MicroView v-else />
  </div>
</template>

<style lang="scss" scoped>
.creator-page {
  display: flex;
  height: 100%;
  width: 100%
}
</style>