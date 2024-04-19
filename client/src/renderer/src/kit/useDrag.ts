import { FractalContainerConfig } from '..'
import { defineEmits } from 'vue'
export function useDrag() {
  const emits = defineEmits<{
    onDrop: [args: { event: DragEvent; targetNode: FractalContainerConfig; targetNodeParent: FractalContainerConfig; index: number }]
    onDragEnter: [event: DragEvent]
    onDragOver: [event: DragEvent]
    onDragLeave: [event: DragEvent]
  }>()

  /** 拖拽进入 */
  const handleDragEnter = (ev: DragEvent) => {
    emits('onDragEnter', ev)
  }
  /** 拖拽经过 */
  const handleDragOver = (ev: DragEvent) => {
    emits('onDragOver', ev)
  }
  /** 拖拽离开 */
  const handleDragLeave = (ev: DragEvent) => {
    emits('onDragLeave', ev)
  }
  /** 拖拽放下 */
  const handleDrop = (args: { event: DragEvent; targetNode: FractalContainerConfig; targetNodeParent: FractalContainerConfig; index: number }) => {
    emits('onDrop', args)
  }

  return {
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop
  }
}
