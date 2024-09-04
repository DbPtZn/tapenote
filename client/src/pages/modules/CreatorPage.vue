<script lang="ts" setup>
import useStore from '@/store'
import { CreatorView } from '@/views'
const { settingStore } = useStore()
</script>

<template>
  <div class="creator-page">
    <CreatorView v-if="!settingStore.isMobile" />
  </div>
</template>

<style lang="scss" scoped>
.creator-page {
  display: flex;
  height: 100%;
  width: 100%
}
</style>