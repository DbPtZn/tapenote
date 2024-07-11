<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { computed, reactive } from 'vue'
export interface OutlineItem {
  tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  text: string
  offsetTop: number
}
const props = defineProps<{
  data: () => OutlineItem[]
  openDelayAnimate: boolean
  activeIndex: () => number
  scrollTop: () => number
  scrollerTo: (offsetTop: number) => void
}>()
const themeVars = useThemeVars()
const state = reactive({
  data: computed(() => props.data()),
  activeIndex: computed(() => props.activeIndex()),
  scrollTop: computed(() => props.scrollTop())
})
</script>

<template>
  <div :class="['editor-outline', openDelayAnimate ? 'delay' : '' ]" :style="{ position: 'absolute', top: state.scrollTop + 'px' }">
    <n-space id="editor-outline-container" class="editor-outline-container scrollbar" vertical>
      <div v-for="(item, index) in state.data" :key="index" :class="['outline-heading-item', `outline-heading-${item?.tagName.toLocaleLowerCase() || 'null'}`]">
        <a
          :class="['outline-heading-text', state.activeIndex === index ? 'active' : '']"
          href="javascript:;"
          draggable="false"
          @click="scrollerTo(item?.offsetTop)"
          >{{ item?.text }}</a
        >
      </div>
    </n-space>
  </div>
</template>

<style lang="scss" scoped>
.editor-outline {
  width: 200px;
  overflow-x: hidden;
}
.delay {
  transition: top 0.2s ease-in-out;
}
.editor-outline-container {
  width: 100%;
  max-height: 50%;
  padding: 10px;
  box-sizing: border-box;
}
.outline-heading-text {
  color: v-bind('themeVars.textColor3');
  &:hover {
    color: v-bind('themeVars.textColor2');
  }
}
.active {
  color: v-bind('themeVars.textColor2');
}

.outline-heading-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}

/** 标题大小 */
.outline-heading-h1 {
  line-height: 2;
  padding-left: 0em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h2 {
  line-height: 2;
  padding-left: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h3 {
  line-height: 2;
  padding-left: 2em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h4 {
  line-height: 2;
  padding-left: 3em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h5 {
  line-height: 2;
  padding-left: 4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h6 {
  line-height: 2;
  padding-left: 5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
