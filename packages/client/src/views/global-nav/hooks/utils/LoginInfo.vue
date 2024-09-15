<script lang="ts" setup>
const props = defineProps<{
  account: string
  hostname: string
}>()
</script>

<template>
  <n-flex vertical>
    <n-flex>
      <span>服务器地址</span>
      <n-input :value="hostname" disabled />
    </n-flex>
    <n-flex>
      <span>账户</span>
      <n-input :value="account" disabled />
    </n-flex>
  </n-flex>
</template>

<style lang="scss" scoped></style>
