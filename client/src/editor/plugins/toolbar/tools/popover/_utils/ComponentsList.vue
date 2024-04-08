<script lang="ts" setup>

</script>
<template>
  <div ref="listRef" class="list">
    <div class="list-wrapper">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list {
  // display: flex;
  // flex-direction: row;
  // height: 500px;
  width: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.list-wrapper {

}
</style>
