import { FractalContainerConfig } from '@/renderer'
import { reactive } from 'vue'

export function useContextmenu() {
  const state = reactive({
    x: 0,
    y: 0,
    node: null as FractalContainerConfig | null,
    show: false
  })

  function handleContextMenu(ev: MouseEvent, node: FractalContainerConfig) {
    if (ev.altKey) {
      state.x = ev.clientX
      state.y = ev.clientY
      state.node = node
      state.show = true
      ev.preventDefault()
      ev.stopPropagation()
    }
  }

  return {
    state,
    handleContextMenu
  }
}
