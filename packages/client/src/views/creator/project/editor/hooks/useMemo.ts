import useStore from '@/store'
import { DropdownOption, useMessage } from 'naive-ui'
import { Ref, ShallowRef, h, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Bridge } from '../../bridge'
import { MemoService } from '@/editor'
import { Subscription } from '@tanbo/stream'

type Memo = ReturnType<typeof useStore>['projectStore']['data'][0]['memos'][0]
export function useMemo(projectId: string, account: string, hostname: string, container: Readonly<ShallowRef<HTMLElement | null>>, bridge: Bridge) {
  const { projectStore } = useStore()
  const message = useMessage()
  const add = async (x: number, y: number) => {
    try {
      await projectStore.addMemo({ projectId, x, y }, account, hostname)
    } catch (error) {
      message.error('添加便笺失败!')
    }
  }

  let subs1: Subscription[] = []
  let subs2: Subscription[] = []
  subs1.push(
    bridge.onEditorReady.subscribe(editor => {
      const memoService = editor.get(MemoService)
      
      subs2.push(
        memoService.onCreateMeno.subscribe(memo => {
          const x = memo.x
          const y = memo.y + container.value!.scrollTop
          add(x, y)
        }),
        memoService.onResize.subscribe(memo => {
          const { id, height, width } = memo
          handleResizeMemo(id, height, width)
        }),
        memoService.onMove.subscribe(memo => {
          const { id, x, y } = memo
          handleMoveMemo(id, x, y)
        }),
        memoService.onDelete.subscribe(memo => {
          const { id } = memo
          handleDeleteMemo(id)
        }),
        memoService.onExpand.subscribe(memo => {
          const { id, isExpanded } = memo
          handleExpandMemo(id, isExpanded)
        }),
        memoService.onSave.subscribe(memo => {
          const { id, content } = memo
          handleSaveMemo(id, content)
        }),
        memoService.onUpdateBgColor.subscribe(memo => {
          const { id, bgColor } = memo
          handleUpdateMemoBgColor(id, bgColor)
        })
      )
    })
  )

  onUnmounted(() => {
    subs1.forEach(s => s.unsubscribe())
    subs2.forEach(s => s.unsubscribe())
    subs1.length = 0
    subs2.length = 0
  })

  const handleResizeMemo = async (id: string, height: number, width: number) => {
    try {
      await projectStore.updateMemoState(
        {
          projectId,
          memoId: id,
          height,
          width
        },
        account,
        hostname
      )
    } catch (error) {
      message.error('更新便笺大小失败!')
    }
  }

  const handleMoveMemo = async (id: string, x: number, y: number) => {
    try {
      await projectStore.updateMemoState(
        {
          projectId,
          memoId: id,
          x,
          y
        },
        account,
        hostname
      )
    } catch (error) {
      message.error('更新便笺位置失败!')
    }
  }

  const handleUpdateMemoBgColor = async (id: string, bgcolor: Memo['bgColor']) => {
    try {
      await projectStore.updateMemoState(
        {
          projectId,
          memoId: id,
          bgColor: bgcolor
        },
        account,
        hostname
      )
    } catch (error) {
      message.error('更新便笺颜色失败!')
    }
  }

  const handleExpandMemo = async (id: string, isExpanded: boolean) => {
    try {
      await projectStore.updateMemoState(
        {
          projectId,
          memoId: id,
          isExpanded
        },
        account,
        hostname
      )
    } catch (error) {
      message.error('更新便笺展开状态失败!')
    }
  }

  const handleDeleteMemo = async (id: string) => {
    try {
      await projectStore.deleteMemo(
        {
          projectId,
          memoId: id
        },
        account,
        hostname
      )
    } catch (error) {
      message.error('删除便笺失败!')
    }
  }

  const handleSaveMemo = async (id: string, content: string) => {
    try {
      await projectStore.updateMemoContent(
        {
          projectId,
          memoId: id,
          content
        },
        account,
        hostname
      )
    } catch (error) {
      message.error('保存便笺内容失败!')
    }
  }
}
