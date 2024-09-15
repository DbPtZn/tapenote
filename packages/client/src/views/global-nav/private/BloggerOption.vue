<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useThemeVars } from 'naive-ui'
const props = defineProps<{
  name: string
  site: string
  desc: string
}>()

</script>

<template>
  <div class="option">
    <div class="name">{{ name }}</div>
    <!-- <div class="site">{{ site }}</div> -->
    <!-- <div class="desc">{{ desc }}</div> -->
  </div>
</template>

<style lang="scss" scoped>
.option {
  cursor: pointer;
  min-width: 100px;
  margin: 4px;
  padding: 6px 10px;
  border-radius: 3px;
  &:hover {
    background-color: var(--dpz-buttonColorHover);
  }
}
.name {
  color: var(--dpz-textColor1);
}
.site {
  color: var(--dpz-textColor2);
}
.desc {
  font-size: 12px;
  color: var(--dpz-textColor3);
}
</style>
