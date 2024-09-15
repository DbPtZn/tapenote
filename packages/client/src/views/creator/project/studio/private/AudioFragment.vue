<script lang="ts" setup>
import utils from '@/utils'
import { Subscription, auditTime, fromEvent } from '@tanbo/stream'
import { useThemeVars } from 'naive-ui'
import { onUnmounted, ref } from 'vue'
import useStore from '@/store'
type FragmentSpeaker = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]['speaker']
const props = defineProps<{
  speaker: FragmentSpeaker
  // 是否多选
  multiple: boolean
  // 时长
  duration: number
  // order
  order: number
  // 是否显示 order
  isShowOrder: boolean
  // 是否折叠
  collapsed: boolean
  // 是否显示名称
  isShowName: boolean
  // 是否被剪切
  isCut: boolean
  // 加载中
  isLoading: boolean
  // 只读
  readonly: boolean
}>()
const emits = defineEmits<{
  onContextmenu: [MouseEvent]
  onExpand: []
  onSelect: [boolean]
}>()
const subs: Subscription[] = []
const themeVars = useThemeVars()
const fragmentRef = ref()
const handleError = (ev: Event) => {
  const target = ev.target as HTMLImageElement
  target.src = './default.png'
}
const isFocus = ref(false)
const handleContextmenu = (ev: MouseEvent) => {
  if ((!isFocus.value && !props.multiple) || ev.ctrlKey) {
    isFocus.value = true
    emits('onSelect', isFocus.value)
  }
  emits('onContextmenu', ev)
  useClickoutside()
}
const handleClick = (ev: MouseEvent) => {
  if (ev.ctrlKey) {
    isFocus.value = !isFocus.value
    emits('onSelect', isFocus.value)
    useClickoutside()
  }
}
function useClickoutside() {
  if (subs.length !== 0) return
  subs.push(
    fromEvent<MouseEvent>(document, 'click', true)
      .pipe(auditTime(5))
      .subscribe(event => {
        if (!event.ctrlKey) {
          isFocus.value = false
          emits('onSelect', isFocus.value)
          subs.forEach(sub => sub.unsubscribe())
          subs.length = 0
        }
      }),
    fromEvent<MouseEvent>(document, 'contextmenu', true).subscribe(event => {
      if (!event.ctrlKey && !props.multiple) {
        isFocus.value = false
        emits('onSelect', isFocus.value)
        subs.forEach(sub => sub.unsubscribe())
        subs.length = 0
      }
    })
  )
}
onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
  subs.length = 0
})
</script>

<template>
  <div
    ref="fragmentRef"
    :class="['fragment', isFocus ? 'focus' : '', readonly || isLoading ? 'disabled' : '', isCut ? 'cut' : '']"
    draggable="true"
    @click="handleClick"
    @contextmenu="handleContextmenu"
  >
    <!-- ------------------------------------------- Left --------------------------------------------- -->
    <div class="fragment-wrapper left-fragment" v-if="speaker.role <= 9999">
      <!-- 左侧 -->
      <div class="left-side">
        <div class="avator">
          <img :src="speaker.avatar || './empty.png'" @error="handleError" />
          <div v-if="isShowOrder" class="order">{{ order }}</div>
        </div>
      </div>
      <!-- 中间 -->
      <div class="middle">
        <div class="content">
          <div class="name" v-if="isShowName">
            {{ speaker.name }}
          </div>
          <div :class="['msg', 'msg-left', collapsed && 'collapse']">
            <slot name="txt" />
            <span v-if="collapsed" class="collapse-btn" @click="emits('onExpand')">展开</span>
          </div>
        </div>
        <div v-if="isLoading" class="loading">
          <span>
            <slot name="loading" />
          </span>
        </div>
        <div v-if="!isFocus && !isLoading" class="toolbar toolbar-left">
          <span>
            <slot name="delete" />
          </span>
          <span>
            <slot name="edit" />
          </span>
          <span>
            <slot name="play" />
          </span>
        </div>
        <div v-if="isFocus && !isLoading" class="duration">{{ utils.durationFormat(duration || 0) }}</div>
      </div>
      <!-- 右侧 -->
      <div class="right-side" :style="{ width: `50px` }">
        <!-- Placeholder -->
      </div>
    </div>
    <!-- ------------------------------------------- Right --------------------------------------------- -->
    <div class="fragment-wrapper right-fragment" v-if="speaker.role > 9999">
      <!-- 左侧 -->
      <div class="left-side" :style="{ width: `50px` }">
        <!-- Placeholder -->
      </div>
      <!-- 中间 -->
      <div class="middle">
        <div v-if="isFocus && !isLoading" class="duration">{{ utils.durationFormat(duration || 0) }}</div>
        <div v-if="isLoading" class="loading">
          <span>
            <slot name="loading" />
          </span>
        </div>
        <div v-if="!isFocus && !isLoading" class="toolbar toolbar-right">
          <span>
            <slot name="play" />
          </span>
          <span>
            <slot name="edit" />
          </span>
          <span>
            <slot name="delete" />
          </span>
        </div>
        <div class="content">
          <div class="name name-right" v-if="isShowName">
            {{ speaker.name }}
          </div>
          <div :class="['msg', 'msg-right', collapsed && 'collapse']">
            <slot name="txt" />
            <span v-if="collapsed" class="collapse-btn" @click="emits('onExpand')">展开</span>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right-side">
        <div class="avator">
          <img :src="speaker.avatar || './default.png'" @error="handleError" />
          <div v-if="isShowOrder" class="order">{{ order }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collapse {
  pointer-events: none;
}
.collapse-btn {
  pointer-events: auto;
  cursor: pointer;
  margin-left: 6px;
  opacity: 0.5;
  &:hover {
    opacity: 0.8;
  }
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.left-side {
  display: flex;
  box-sizing: border-box;
  position: relative;
}
.right-side {
  display: flex;
  box-sizing: border-box;
  position: relative;
}
.middle {
  flex: 1;
  display: flex;
  box-sizing: border-box;
  position: relative;
  .content {
    display: flex;
    flex-direction: column;
    .name {
      font-size: 12px;
    }
    .name-right {
      display: flex;
      flex-direction: row-reverse;
    }
  }
}

.fragment {
  --toolbar-width: 72px;
  margin: 5px;
  border: 1px dashed #ffffff00;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  // pointer-events: none; // 之前为什么要加上这个？
}
// .order {
//   writing-mode: vertical-lr;
//   text-orientation: mixed;
//   padding: 0 2px;
//   border-radius: 5px 0px 0px 5px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: v-bind('themeVars.cardColor');
// }
.order {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  opacity: 0.8;
  background-color: v-bind('themeVars.cardColor');
}
.focus {
  border-color: #aaaaaa30 !important;
}
.cut {
  opacity: 0.5;
}

.fragment-wrapper {
  display: flex;
  flex-direction: row;
  // flex-wrap: wrap;
  height: auto;
  width: 100%;
  margin-top: 10px;
  &:hover {
    .toolbar {
      opacity: 1;
    }
  }
}
.left-fragment {
  .middle {
    display: flex;
    justify-content: flex-start;
  }
}
.right-fragment {
  .middle {
    display: flex;
    justify-content: flex-end;
  }
}
.avator {
  margin: 0 18px;
  img {
    flex: auto;
    height: 38px;
    width: 38px;
    border-radius: 5px;
  }
}
.msg {
  pointer-events: auto;
  margin: 6px;
  padding: 9px 18px 9px 18px;
  word-wrap: break-word;
  word-break: break-all;
  background-color: v-bind('themeVars.modalColor');
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
}
.msg-left {
  border-radius: 0px 12px 12px 12px;
}
.msg-right {
  border-radius: 12px 0px 12px 12px;
}

.loading {
  display: flex;
  align-items: center;
  opacity: 1;
}

.toolbar {
  display: flex;
  align-items: center;
  min-width: var(--toolbar-width);
  transition: opacity 0.5s ease;
  opacity: 0;
  cursor: pointer;
  span {
    display: flex;
    align-items: center;
    border-radius: v-bind('themeVars.borderRadius');
    padding: 3px;
    color: v-bind('themeVars.textColor2');
    &:hover {
      // background-color: @--button-hover-bg;
      color: v-bind('themeVars.textColor1');
    }
  }
}
.toolbar-left {
  justify-content: flex-start;
  // margin-left: @--margin-xs;
}
.toolbar-right {
  justify-content: flex-end;
  // margin-right: @--margin-xs;
}
.duration {
  min-width: var(--toolbar-width);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease;
  // margin-left: 12px;
  color: v-bind('themeVars.textColor3');
}
</style>
