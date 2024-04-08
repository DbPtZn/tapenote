<script lang="ts" setup>
import utils from '@/utils'
import { Subscription, auditTime, fromEvent } from '@tanbo/stream'
import { useThemeVars } from 'naive-ui'
import { onMounted, ref } from 'vue'
const props = defineProps<{
  // 角色列表
  roleList?: Map<number, { name: string; avatar: string }>
  // 机器人列表
  robotList?: Map<number, { name: string; avatar: string }>
  // 角色
  role: number
  // 是否多选
  multiple: boolean
  // 时长
  duration: number
  // 是否被剪切
  isCut: boolean
  // 只读
  readonly: boolean
}>()
const emits = defineEmits<{
  // (e: '-context-menu', event: MouseEvent, onBlur: () => void): void
  onContextmenu: [ MouseEvent ]
  onSelect: [ boolean ]
}>()
const subs: Subscription[] = []
const themeVars = useThemeVars()
const fragmentRef = ref()
const handleError = (ev: Event) => {
  // console.log(ev)
  const target = ev.target as HTMLImageElement
  target.src = './default.png'
  //https://pic2.zhimg.com/v2-98b37ce27a8ab5badda738b57de9ec25_is.jpg
}
const isFocus = ref(false)
const handleContextmenu = (ev: MouseEvent) => {
  if (!isFocus.value && !props.multiple || ev.ctrlKey) {
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
  if(subs.length !== 0) return
  subs.push(
    fromEvent<MouseEvent>(document, 'click', true).pipe(auditTime(5)).subscribe(event => {
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
// onMounted(() => {
//   // console.log(props.roleList?.get(props.role))
// })
</script>

<template>
  <div
    ref="fragmentRef"
    :class="['fragment', isFocus ? 'focus' : '', readonly ? 'disabled' : '', isCut ? 'cut' : '']"
    draggable="true"
    @click="handleClick"
    @contextmenu="handleContextmenu"
  >
    <!-- ------------------------------------------- Left --------------------------------------------- -->
    <div class="fragment-wrapper left-fragment" v-if="role < 9999">
      <!-- 左侧 -->
      <LeftSide>
        <div class="avator">
          <img :src="robotList?.get(role)?.avatar || './empty.png'" @error="handleError" />
        </div>
      </LeftSide>
      <!-- 中间 -->
      <MiddleSide :flex="1" class="middle">
        <div class="msg msg-left">
          <slot name="txt" />
        </div>
        <div v-if="!isFocus" class="toolbar toolbar-left">
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
        <div v-if="isFocus" class="duration">{{ utils.durationFormat(duration || 0) }}</div> 
      </MiddleSide>
      <!-- 右侧 -->
      <RightSide :width="50">
        <!-- Placeholder -->
      </RightSide>
    </div>
    <!-- ------------------------------------------- Right --------------------------------------------- -->
    <div class="fragment-wrapper right-fragment" v-if="role >= 9999">
      <!-- 左侧 -->
      <LeftSide :width="50">
        <!-- Placeholder -->
      </LeftSide>
      <!-- 中间 -->
      <MiddleSide :flex="1" class="middle">
        <div v-if="isFocus" class="duration">{{ utils.durationFormat(duration || 0) }}</div> 
        <div v-if="!isFocus" class="toolbar toolbar-right">
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
        <div class="msg msg-right">
          <slot name="txt" />
        </div>
      </MiddleSide>
      <!-- 右侧 -->
      <RightSide>
        <div class="avator">
          <img :src="roleList?.get(role)?.avatar || './default.png'" @error="handleError" />
        </div>
      </RightSide>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fragment {
  --toolbar-width: 72px;
  margin: 5px;
  border: 1px dashed #ffffff00;
  box-sizing: border-box;
}
.focus {
  border-color: #aaaaaa30 !important;
}
.disabled {
  opacity: 0.5;
  pointer-events: none;
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
