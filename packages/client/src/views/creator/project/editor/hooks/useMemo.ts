import useStore from '@/store'
import { DropdownOption, useMessage } from 'naive-ui'
import { MaybeRefOrGetter, Ref, h, nextTick, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Editor } from '@textbus/editor'
import { Bridge } from '../../bridge'
import { MemoService } from '@/editor'
import { VIEW_CONTAINER } from '@textbus/platform-browser'

type Memo = ReturnType<typeof useStore>['projectStore']['data'][0]['memos'][0]
export function useMemo(projectId: string, account: string, hostname: string, container: Ref<HTMLElement>, bridge: Bridge) {
  const { projectStore } = useStore()
  const message = useMessage()
  const showDropdownRef = ref(false)
  const xRef = ref(0)
  const yRef = ref(0)
 
  const options: DropdownOption[] = [
    {
      key: 'newMemo',
      label: '新建便笺',
      icon: () => h(Icon, { icon: 'ic:baseline-note-add', height: 24 }),
      props: {
        onClick: () => {
          if(!container.value) return
          const x = xRef.value - container.value.offsetLeft
          const y = yRef.value - container.value.offsetTop + container.value.scrollTop
          add(x, y)
        }
      }
    }
  ]
  
  bridge.onEditorReady.subscribe(editor => {
    const memoService = editor.get(MemoService)
    memoService.onCreateMeno.subscribe(memo => {
      const x = memo.x
      const y = memo.y + container.value.scrollTop
      add(x, y)
    })
  })
  
  const handleContextmenu = (e: MouseEvent) => {
    e.preventDefault()
    const target = e.target as HTMLElement
    if(target.closest('.textbus-ui-workbench')) return
    showDropdownRef.value = false
    nextTick().then(() => {
      showDropdownRef.value = true
      xRef.value = e.clientX
      yRef.value = e.clientY
      // console.log(xRef.value, yRef.value)
    })
  }

  const onClickoutside = () => {
    showDropdownRef.value = false
  }

  const handleSelect = () => {
    showDropdownRef.value = false
  }

  const add = async (x: number, y: number) => {
    try {
      await projectStore.addMemo({ projectId, x, y }, account, hostname)
    } catch (error) {
      message.error('添加便笺失败!')
    }
  }

  const handleResizeMemo = async (id: string, height: number, width: number) => {
    try {
      await projectStore.updateMemoState({
        projectId,
        memoId: id,
        height,
        width
      }, account, hostname)
    } catch (error) {
      message.error('更新便笺大小失败!')
    }
  }

  const handleMoveMemo = async (id: string, x: number, y: number) => {
    try {
      await projectStore.updateMemoState({
        projectId,
        memoId: id,
        x,
        y
      }, account, hostname)
    } catch (error) {
      message.error('更新便笺位置失败!')
    }
  }

  const handleUpdateMemoBgColor = async (id: string, bgcolor: Memo['bgColor']) => {
    try {
      await projectStore.updateMemoState({
        projectId,
        memoId: id,
        bgColor: bgcolor
      }, account, hostname)
    } catch (error) {
      message.error('更新便笺颜色失败!')
    }
  }

  const handleExpandMemo = async (id: string, isExpanded: boolean) => {
    try {
      await projectStore.updateMemoState({
        projectId,
        memoId: id,
        isExpanded
      }, account, hostname)
    } catch (error) {
      message.error('更新便笺展开状态失败!')
    }
  }

  const handleDeleteMemo = async (id: string) => {
    try {
      await projectStore.deleteMemo({
        projectId,
        memoId: id
      }, account, hostname)
    } catch (error) {
      message.error('删除便笺失败!')
    }
  }

  const handleSaveMemo = async (id: string, content: string) => {
    try {
      await projectStore.updateMemoContent({
        projectId,
        memoId: id,
        content
      }, account, hostname)
    } catch (error) {
      message.error('保存便笺内容失败!')
    }
  }

  
  return {
    options,
    showDropdownRef,
    xRef,
    yRef,
    onClickoutside,
    handleSelect,
    handleContextmenu,
    handleResizeMemo,
    handleMoveMemo,
    handleUpdateMemoBgColor,
    handleExpandMemo,
    handleDeleteMemo,
    handleSaveMemo
  }
}