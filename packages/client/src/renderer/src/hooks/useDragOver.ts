// import { ref } from 'vue'
// import { FractalContainerConfig, InsertType } from '../_type'

// const innerControlVisible = ref('') // 拖拽控件
// const innerShredderVisible = ref('') // 销毁控件
// const innerMaskController = ref(false)
// const insertType = ref<InsertType>(InsertType.UNSET)
// export function useDrag(callback: () => void) {
//   return {
//     handleDragOver: (ev) => {
//       const target = ev.target as HTMLElement
//       const renderer = target.children[0] as HTMLElement
//       const { x, y } = MouseRelativePosition(ev, target.getBoundingClientRect())
//       if (x < 10) {
//         // console.log('靠近左边界')
//         insertType.value = InsertType.LEFT
//         renderer.className = `mask-renderer mask-renderer-${insertType.value}`
//         return
//       }
//       if (x > 90) {
//         // console.log('靠近右边界')
//         insertType.value = InsertType.RIGHT
//         renderer.className = `mask-renderer mask-renderer-${insertType.value}`
//         return
//       }
//       if (y < 10) {
//         // console.log('靠近上边界')
//         insertType.value = InsertType.TOP
//         renderer.className = `mask-renderer mask-renderer-${insertType.value}`
//         return
//       }
//       if (y > 90) {
//         // console.log('靠近下边界')
//         insertType.value = InsertType.BOTTOM
//         renderer.className = `mask-renderer mask-renderer-${insertType.value}`
//         return
//       }
//       insertType.value = InsertType.MIDDLE
//       renderer.className = `mask-renderer mask-renderer-${insertType.value}`
//       callback()
//     },
//     handleDrop: (args: { event: DragEvent; targetNode: FractalContainerConfig; targetNodeParent: FractalContainerConfig; index: number }) => {
//       innerShredderVisible.value = ''
//       innerMaskController.value = false
//       const { event, targetNode, targetNodeParent, index } = args
//       if (props.allowContainerAutoDrop && sourceNode) {
//         containerTree.moveNode(sourceNode, targetNode, targetNodeParent, index, insertType.value)
//         // sourceNode = null // 因为 onIframeDragEnd 可能不会触发，所以这里对 sourceNode 进行重置
//       }
//       const target = event.target as HTMLElement
//       const renderer = target.children[0] as HTMLElement
//       if (renderer.classList.contains(`mask-renderer-${insertType.value}`)) {
//         renderer.classList.remove(`mask-renderer-${insertType.value}`)
//       }
//       // emits('onDrop', event, targetNode, targetNodeParent, index, insertType.value, props.allowContainerAutoDrop)
//     }
//   }
// }

// function MouseRelativePosition(ev: DragEvent, rect: DOMRect) {
//   const x = Math.round(((ev.clientX - rect.left) / rect.width) * 100)
//   const y = Math.round(((ev.clientY - rect.top) / rect.height) * 100)
//   return { x, y }
// }

// // const handleDrop = (args: { event: DragEvent; targetNode: FractalContainerConfig; targetNodeParent: FractalContainerConfig; index: number }) => {
// //   innerShredderVisible.value = ''
// //   innerMaskController.value = false
// //   const { event, targetNode, targetNodeParent, index } = args
// //   if (props.allowContainerAutoDrop && sourceNode) {
// //     containerTree.moveNode(sourceNode, targetNode, targetNodeParent, index, insertType.value)
// //     // sourceNode = null // 因为 onIframeDragEnd 可能不会触发，所以这里对 sourceNode 进行重置
// //   }
// //   const target = event.target as HTMLElement
// //   const renderer = target.children[0] as HTMLElement
// //   if (renderer.classList.contains(`mask-renderer-${insertType.value}`)) {
// //     renderer.classList.remove(`mask-renderer-${insertType.value}`)
// //   }
// //   emits('onDrop', event, targetNode, targetNodeParent, index, insertType.value, props.allowContainerAutoDrop)
// // }





// // const handleDragOver = (ev: DragEvent) => {
// //   const target = ev.target as HTMLElement
// //   const renderer = target.children[0] as HTMLElement
// //   const { x, y } = MouseRelativePosition(ev, target.getBoundingClientRect())
// //   if (x < 10) {
// //     // console.log('靠近左边界')
// //     insertType.value = InsertType.LEFT
// //     renderer.className = `mask-renderer mask-renderer-${insertType.value}`
// //     return
// //   }
// //   if (x > 90) {
// //     // console.log('靠近右边界')
// //     insertType.value = InsertType.RIGHT
// //     renderer.className = `mask-renderer mask-renderer-${insertType.value}`
// //     return
// //   }
// //   if (y < 10) {
// //     // console.log('靠近上边界')
// //     insertType.value = InsertType.TOP
// //     renderer.className = `mask-renderer mask-renderer-${insertType.value}`
// //     return
// //   }
// //   if (y > 90) {
// //     // console.log('靠近下边界')
// //     insertType.value = InsertType.BOTTOM
// //     renderer.className = `mask-renderer mask-renderer-${insertType.value}`
// //     return
// //   }
// //   insertType.value = InsertType.MIDDLE
// //   renderer.className = `mask-renderer mask-renderer-${insertType.value}`
// //   // 计算鼠标在容器中的相对位置，以百分比数值输出（0 - 100）
// //   function MouseRelativePosition(ev: DragEvent, rect: DOMRect) {
// //     const x = Math.round(((ev.clientX - rect.left) / rect.width) * 100)
// //     const y = Math.round(((ev.clientY - rect.top) / rect.height) * 100)
// //     return { x, y }
// //   }
// //   emits('onDragOver', ev)
// // }
