/** 组件宽度控制器 垂直分隔条 */
<script setup lang="ts">
import { Subscription, fromEvent } from '@tanbo/stream'
import { onMounted, onUnmounted, ref } from 'vue'
import elementResizeDetector from 'element-resize-detector'
const erd = elementResizeDetector()
const emits = defineEmits(['onResizeStart', 'onResize', 'onResizeEnd'])
const controllerRef = ref()
const parentContainer = ref()
const containerWidth = ref()
let subs: Subscription[] = []
onMounted(() => {
  parentContainer.value = controllerRef.value.parentElement.parentElement
  if (parentContainer.value) {
    erd.listenTo(parentContainer.value, () => {
      containerWidth.value = parentContainer.value.offsetWidth
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
/** 鼠标（在根容器中）移动的距离 = 鼠标初始位置 - 鼠标移动后的位置 */
const handleResize = (e: MouseEvent) => {
  maskVisible.value = true
  document.body.style.cursor = 'e-resize'
  emits('onResizeStart')
  const initial_position = e.clientX // 鼠标初始位置
  if(subs.length === 0) {
    subs.push(
      fromEvent<MouseEvent>(document, 'mousemove').subscribe(e => {
        const end_position = e.clientX // 鼠标移动后的位置
        const distance = initial_position - end_position // 鼠标移动的距离
        const distance_pct = (distance / containerWidth.value) * 100
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
  //   const end_position = e.clientX // 鼠标移动后的位置
  //   const distance = initial_position - end_position // 鼠标移动的距离
  //   const distance_pct = (distance / containerWidth.value) * 100
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
  <div ref="controllerRef" class="width-controller" @mousedown="handleResize"></div>
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
.width-controller {
  // 使控制条脱离文档流
  position: absolute;
  height: 100%;
  width: 1px;
  transform: scaleX(5);
  // background-color: rgba(146, 146, 146, 0.842);
  user-select: none;
  z-index: 100;
  cursor: e-resize;
  transition: background 0.8s ease-in-out;
  &:hover {
    background-color: rgba(163, 163, 163, 0.473);
  }
}
</style>
