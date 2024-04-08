<script lang="ts" setup>
import { onUnmounted, ref } from 'vue'
import elementResizeDetector from 'element-resize-detector'
const props = defineProps({
  // 容器 id
  containerId: {
    type: String,
    default: ''
  },
  currentId: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  }
})
const emits = defineEmits<{
  /** 容器聚焦 */
  (e: 'onIframeFocus', containerId: string): void
  /** 在 iframe 容器内按住 alt 并按下鼠标时触发 */
  (e: 'onInnerMenuExpand', x: number, y: number, containerId: string): void
}>()
const erd = elementResizeDetector()
onUnmounted(() => {
  // 销毁 erd
  if (containerRef.value) {
    erd.uninstall(containerRef.value)
  }
})
const controlVisible = ref(false) // 控制按钮显示状态
const containerRef = ref<HTMLIFrameElement>()
const iframeRef = ref<HTMLIFrameElement>()
const ifx = ref(0) // iframe 容器的 x
const ify = ref(0) // iframe 容器的 y
/** iframe 载入完成后调用，关于 iframe 的事件需要在这个生命周期下侦听 */
const handleIframeLoad = () => {
  // console.log('iframe on load')
  /** 计算 iframe 容器的位置 */
  erd.listenTo(containerRef.value!, () => {
    const rect = containerRef.value!.getBoundingClientRect()
    ifx.value = rect.x
    ify.value = rect.y
  })
  /** 侦听 iframe 内发生的 click 事件 */
  iframeRef.value?.contentDocument?.addEventListener('click', () => {
    emits('onIframeFocus', props.containerId)
  })
  /** 侦听 iframe 内发生的 鼠标按下 和 Alt 同时发生的事件 */
  iframeRef.value?.contentWindow?.addEventListener('mousedown', (ev) => {
    // 侦听 window 是有些时候 document 上的侦听会被意料之外的因素阻止
    if (ev.altKey) {
      ev.preventDefault()
      ev.stopPropagation()
      // 鼠标位置是 iframe 内的，需要换算成主窗口的相对位置
      emits('onInnerMenuExpand', ev.clientX + ifx.value, ev.clientY + ify.value, props.containerId)
    }
  })
  /** 侦听鼠标在 iframe 上移动时 */
  iframeRef.value?.contentDocument?.addEventListener('mouseover', (ev) => {
    ev.preventDefault()
    ev.stopPropagation()
    controlVisible.value = true
  })
  /** 侦听鼠标离开 iframe 时 */
  iframeRef.value?.contentDocument?.addEventListener('mouseleave', (ev) => {
    ev.preventDefault()
    ev.stopPropagation()
    controlVisible.value = false
  })
  /** 将容器 id 存储到 window.name 中 (可以改为其它) */
  iframeRef.value!.contentWindow!.name = props.containerId
}
/** 鼠标经过容器时显示控件(必要) */
// const handleMousemove = (ev: MouseEvent) => {
//   ev.preventDefault()
//   ev.stopPropagation()
//   controlVisible.value = true
// }
/** 控件上的右击下拉菜单 */
// const handleContextmenu = (ev: MouseEvent) => {
//   ev.preventDefault()
// }
</script>
<!-- eslint-disable prettier/prettier -->
<template>
  <!-- tabindex="0" 使得 div 可以获取焦点， key 事件可以监听 -->
  <div ref="containerRef" class="iframe-container" tabindex="0">
    <!-- <div
      v-if="controlVisible || currentId === containerId"
      :class="['iframe-container-control']"
      @mousemove="handleMousemove"
      @contextmenu="handleContextmenu"
    >
      <span :class="['iframe-container-control-icon', 'justified', currentId === containerId ? 'iframe-container-focus' : '']" />
    </div> -->
    <iframe ref="iframeRef" class="fractal-iframe" :src="url" frameborder="0" @load="handleIframeLoad" />
  </div>
</template>

<style lang="scss" scoped>
$--text-color-primary: #323233;
$--text-color-secondary: #969799;
.iframe-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  user-select: none;
}
.iframe-container-focus {
  color: $--text-color-primary !important;
}
.iframe-container-control {
  z-index: 2;
  position: absolute;
  top: 0px;
  left: 0px;
  .iframe-container-control-icon {
    position: absolute;
    margin: 8px;
    color: $--text-color-secondary;
    cursor: pointer;
    &:hover {
      color: $--text-color-primary;
    }
  }
}

.iframe-container-close {
  z-index: 3;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100px;
  width: 100px;
  color: $--text-color-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  .iframe-container-close-icon {
    pointer-events: none;
    scale: 3;
  }
}
.iframe-container-close-focus {
  background-color: rgba(0, 0, 0, 0.616);
  border: 1px dashed #dcdee0;
  color: #f7f8fa;
}
.fractal-iframe {
  width: 100%;
  height: 100%;
}
.justified {
  color: #000;
  position: absolute;
  margin-left: 2px;
  margin-top: 6px;
  width: 17px;
  height: 5px;
  border-top: solid 1px currentColor;
  border-bottom: solid 1px currentColor;
}

.justified:before {
  content: '';
  position: absolute;
  top: 2px;
  left: 0;
  width: 17px;
  height: 5px;
  border-top: solid 1px currentColor;
  border-bottom: solid 1px currentColor;
}
</style>
