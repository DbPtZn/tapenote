import { Commander, Ref, Renderer, Selection, Slots, Subscription, fromEvent, onDestroy, onViewInit, useContext } from '@textbus/core'
import { imageB2UComponent } from '../imageB2U.component'
import { paragraphComponent } from '../paragraph.component'

export function useImgDrag(rootNode: Ref<HTMLElement>, slots: Slots<any>) {
  const injector = useContext()
  const selection = injector.get(Selection)
  const commander = injector.get(Commander)
  const renderer = injector.get(Renderer)

  const subscription = new Subscription()
  onViewInit(() => {
    subscription.add(
      fromEvent(rootNode.current!, 'dragenter').subscribe(ev => {
        ev.preventDefault()
        ev.stopPropagation()
      }),
      fromEvent(rootNode.current!, 'dragover').subscribe(ev => {
        ev.preventDefault()
        ev.stopPropagation()

        const target = ev.target as HTMLElement
        const self = renderer.getComponentByNativeNode(target)
        // 当拖拽移动的时候，根据经过的元素找到组件，然后将光标设置到对应组件尾部
        if (self && self.name !== 'RootComponent') {
          selection.selectLastPosition(self)
        }
      }),
      fromEvent(rootNode.current!, 'dragleave').subscribe(ev => {
        ev.preventDefault()
        ev.stopPropagation()
      }),
      fromEvent<DragEvent>(rootNode.current!, 'drop').subscribe(ev => {
        ev.preventDefault()
        ev.stopPropagation()
        // console.log(ev)
        const files = ev.dataTransfer?.files
        // console.log(files)
        if (!files || !files.length) {
          return
        }
        for (const file of files) {
          if (file.type.indexOf('image') === -1) {
            continue
          }
          const reader = new FileReader()
          reader.onload = e => {
            // console.log(e.target?.result as string)
            // 获取 base64 数据
            const base64 = e.target?.result as string
            try {
              const target = ev.target as HTMLElement

              // 构建图片组件（组件内实现会自动将 base64 上传到服务器转 url）
              const imgComponent = imageB2UComponent.createInstance(injector, {
                state: {
                  src: base64
                }
              })
              // console.log(imgComponent)
              const p = paragraphComponent.createInstance(injector)
              p.slots.get(0)!.insert(imgComponent)

              const self = renderer.getComponentByNativeNode(target)
              // console.log(self)
              // 如果根据元素找不到组件，则根据当前光标位置插入（也可以递归向上找组件，但似乎必要性不大）
              if (!self) {
                commander.insert(p)
                return
              }
              // 如果是根组件，则根据当前光标位置插入
              if (self.name === 'RootComponent') {
                commander.insert(p)
                return
              }

              // 找到父组件插槽
              const parentSlot = self.parent
              if (!parentSlot) return
              // 找到自己在父组件插槽中的位置
              const index = parentSlot.indexOf(self)
              // 前进一格
              parentSlot.retain(index + 1)
              // 获取当前插槽
              const currentSlot = slots.get(0)!
              currentSlot.insert(p)
              selection.selectLastPosition(p) // 将光标设置到尾部
            } catch (error) {
              console.log(error)
            }
          }
          reader.readAsDataURL(file)
        }
      })
    )
  })

  onDestroy(() => {
    subscription.unsubscribe()
  })
}
