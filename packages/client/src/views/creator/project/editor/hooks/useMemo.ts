import useStore from '@/store'

type Memo = ReturnType<typeof useStore>['projectStore']['data'][0]['memos'][0]
export function useMemo(id: string) {
  const { projectStore } = useStore()
  const create = (x: number, y: number) => {
    const meno: Memo = {
      id: 'adsc',
      content: 'ddddddddd',
      updateAt: '',
      createAt: '',
      isExpanded: true,
      bgColor: 'yellow',
      height: 300,
      width: 300,
      x,
      y
    }
    projectStore.get(id)?.memos.push(meno)
  }
  
  
  const handleContextmenu = (ev) => {
    console.log(ev)
    const x = ev.clientX
    const y = ev.clientY
    create(x, y)
  }
  
  return {
    handleContextmenu
  }
}