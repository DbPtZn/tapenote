import { useDialog, useMessage } from "naive-ui"
import { Icon } from '@iconify/vue'
import { computed, h, ref } from "vue"
import CoverUploader from "../private/CoverUploader.vue"
import useStore from "@/store"
import { fromEvent } from "@tanbo/stream"
export function useCover(id: string, account: string, hostname: string) {

  const dialog = useDialog()
  const message = useMessage()
  const { projectStore } = useStore()

  const isAllowAdjust = ref(false) 
  const cover = computed(() => projectStore.get(id)?.cover)
  const data = computed(() => projectStore.get(id))
  function handleUpdateCover() {
    dialog.create({
      title: `${cover ? '更新' :'添加'}封面`,
      icon: () => h(Icon, { icon: 'ic:outline-add-photo-alternate', height: 24 }),
      content: () => h(CoverUploader, {
        onFinish: (url: string) => {
          projectStore.updateCover(id, url, account, hostname).catch(e => {
            message.error(`${cover ? '更新' :'添加'}封面图片失败！`)
          })
          dialog.destroyAll()
        }
      })
    })
  }

  function handleRemoveCover() {
    projectStore.updateCover(id, '', account, hostname).catch(e => {
      message.error('删除封面图片失败！')
    })
  }

  function handleCoverMousedown() {
    const move = fromEvent<MouseEvent>(document, 'mousemove').subscribe(ev => {
      data.value!.coverPosition -= ev.movementY / 10
      if(data.value!.coverPosition < 0) return data.value!.coverPosition = 0
      if(data.value!.coverPosition > 100) return data.value!.coverPosition = 100
    })
    const up = fromEvent(document, 'mouseup').subscribe(() => {
      move.unsubscribe()
      up.unsubscribe()
    })
  }

  function handleUpdateCoverPosition() {
    isAllowAdjust.value = false
    projectStore.updateCoverPosition(id, data.value!.coverPosition, account, hostname).catch(e => {
      message.error('更新封面位置失败！')
    })
  }

  return {
    isAllowAdjust,
    handleUpdateCover,
    handleRemoveCover,
    handleCoverMousedown,
    handleUpdateCoverPosition
  }
}