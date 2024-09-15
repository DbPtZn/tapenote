import elementResizeDetector from "element-resize-detector"
import { onMounted, onBeforeUnmount, Ref } from "vue"
import _ from 'lodash'
import { Observable, Subject } from "@textbus/core"

export function useToolbarResize(toolbarRef: Ref<HTMLElement>) {
  const resizeEvent: Subject<any> = new Subject()
  const onResize: Observable<{
    width: number,
    height: number
  }> = resizeEvent.asObservable()
  const erd = elementResizeDetector()
  onMounted(() => {
    erd.listenTo(toolbarRef.value, () => {
      resizeEvent.next({ width: toolbarRef.value.offsetWidth, height: toolbarRef.value.offsetHeight })
    })
  })
  onBeforeUnmount(() => {
    try {
      erd.uninstall(toolbarRef.value!)
    } catch (error) {
      console.log(error)
    }
  })
  return onResize
}