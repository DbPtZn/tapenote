/** 组件高度控制器 水平分隔条 */
<script setup lang="ts">
import { Subscription, fromEvent } from '@tanbo/stream'
import elementResizeDetector from 'element-resize-detector'
import { onMounted, onUnmounted, ref } from 'vue'
const erd = elementResizeDetector()
const emits = defineEmits(['onResizeStart', 'onResize', 'onResizeEnd'])
const controllerRef = ref()
const parentContainer = ref()
const containerHeight = ref()
let subs: Subscription[] = []
onMounted(() => {
  parentContainer.value = controllerRef.value.parentElement.parentElement
  if (parentContainer.value) {
    erd.listenTo(parentContainer.value, () => {
      containerHeight.value = parentContainer.value.offsetHeight
    })
  }
})
onUnmounted(() => {
  if (parentContainer.value) {
    try {
      erd.uninstall(parentContainer.value)
    } catch (e) {
      console.log(e)
    }
  }
  subs.forEach(i => i.unsubscribe())
})
/** 遮罩层 */
const maskVisible = ref(false)
/** 窗口大小发生变化时，需要重新获取窗口高度 */
// window.onresize = () => {
//   htmlHeight = document.body.clientHeight
// }
const handleResize = (e: MouseEvent) => {
  maskVisible.value = true
  document.body.style.cursor = 's-resize'
  emits('onResizeStart')
  const initial_position = e.clientY // 鼠标初始位置
  if (subs.length === 0) {
    subs.push(
      fromEvent<MouseEvent>(document, 'mousemove').subscribe(e => {
        const end_position = e.clientY // 鼠标移动后的位置
        const distance = initial_position - end_position // 鼠标移动的距离
        const distance_pct = (distance / containerHeight.value) * 100
        emits('onResize', Math.round(distance_pct))
      }),
      fromEvent(document, 'mouseup').subscribe(() => {
        maskVisible.value = false
        subs.forEach(i => i.unsubscribe())
        subs = []
        document.body.style.cursor = 'default'
        emits('onResizeEnd')
      })
    )
  }
  // const onMouseMove = fromEvent<MouseEvent>(document, 'mousemove').subscribe(e => {
  //   const end_position = e.clientY // 鼠标移动后的位置
  //   const distance = initial_position - end_position // 鼠标移动的距离
  //   const distance_pct = (distance / containerHeight.value) * 100
  //   emits('onResize', Math.round(distance_pct))
  // })
  // const onMouseUp = fromEvent(document, 'mouseup').subscribe(() => {
  //   maskVisible.value = false
  //   onMouseMove.unsubscribe()
  //   onMouseUp.unsubscribe()
  //   document.body.style.cursor = 'default'
  //   emits('onResizeEnd')
  // })
}
</script>

<template>
  <div class="mask" v-if="maskVisible"></div>
  <div ref="controllerRef" class="height-controller" @mousedown.prevent="handleResize" draggable="false" @dragstart.prevent.stop="''"></div>
</template>

<style lang="scss" scoped>
.mask {
  z-index: 10;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(128, 128, 128, 0.062);
}
.height-controller {
  position: absolute;
  height: 1px;
  width: 100%;
  // transform: scaleY(5);
  // background-color: rgba(61, 61, 61, 0.842);
  user-select: none;
  z-index: 1000;
  cursor: s-resize;
  transition: background 0.8s ease-in-out;
  &:hover {
    background-color: rgba(163, 163, 163, 0.473);
  }
}
</style>
