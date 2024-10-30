import { 
  onDestroy, onViewInit, Ref, Selection, Renderer, useContext, 
  useSelf, fromEvent, Subscription, onCompositionUpdate, 
  onParentSlotUpdated, onViewChecked, onContentInserted
} from '@textbus/core'
import { createElement, VIEW_CONTAINER, Rect } from '@textbus/platform-browser'
// import { fromEvent, Subscription } from '@tanbo/core'

const text = document.createElement('div')

const handlers: HTMLButtonElement[] = []

for (let i = 0; i < 8; i++) {
  const button = document.createElement('button')
  button.type = 'button'
  handlers.push(button)
}

const mask = createElement('div', {
  classes: ['textbus-image-video-resize'],
  children: [
    ...handlers,
    text
  ]
})

export interface DragRect {
  width: string
  height: string
}

let currentRef: Ref<HTMLElement> | null = null

export function useDragResize(ref: Ref<HTMLElement>, callback: (rect: DragRect) => void) {
  const context = useContext()
  const componentInstance = useSelf()
  const selection = context.get(Selection)
  const docContainer = context.get(VIEW_CONTAINER)
  const renderer = context.get(Renderer)

  const self = useSelf()
  let isFocus = false

  const subs: Subscription[] = []
  // console.log('useDragResize', ref.current)
  subs.push(
    renderer.onViewUpdated.subscribe(() => {
      if (isFocus && currentRef) {
        updateStyle(currentRef.current!, docContainer.getBoundingClientRect())
      }
    }),
    selection.onChange.subscribe(() => {
      const index = self.parent?.indexOf(self)
      if (selection.startSlot !== self.parent ||
        selection.endSlot !== self.parent ||
        selection.startOffset !== index ||
        selection.endOffset !== index + 1) {
        isFocus = false
        mask.parentNode?.removeChild(mask)
      }
    }),
    fromEvent<MouseEvent>(mask, 'mousedown').subscribe(ev => {
      // console.log('mousedown', currentRef !== ref || !currentRef?.current)
      if (currentRef !== ref || !currentRef?.current) {
        return
      }

      docContainer.style.pointerEvents = 'none'

      const startRect = ref.current!.getBoundingClientRect()

      const startX = ev.clientX
      const startY = ev.clientY

      const startWidth = startRect.width
      const startHeight = startRect.height
      const startHypotenuse = Math.sqrt(startWidth * startWidth + startHeight * startHeight)

      let endWidth = startWidth
      let endHeight = startHeight
      const index = handlers.indexOf(ev.target as HTMLButtonElement)

      const unMove = fromEvent<MouseEvent>(document, 'mousemove').subscribe(ev => {
        const moveX = ev.clientX
        const moveY = ev.clientY

        const offsetX = moveX - startX
        const offsetY = moveY - startY

        let gainHypotenuse: number
        let proportion: number
        let sideX: number
        let sideY: number

        switch (index) {
          case 0:
          case 4:
            sideX = startWidth + offsetX
            sideY = startHeight + offsetY
            gainHypotenuse = Math.sqrt(sideX * sideX + sideY * sideY)
            proportion = gainHypotenuse / startHypotenuse
            if (index === 0) {
              proportion = 1 - (proportion - 1)
            }
            endWidth = startWidth * proportion
            endHeight = startHeight * proportion
            break
          case 2:
            sideX = startWidth + offsetX
            sideY = startHeight - offsetY
            gainHypotenuse = Math.sqrt(sideX * sideX + sideY * sideY)
            proportion = gainHypotenuse / startHypotenuse
            endWidth = startWidth * proportion
            endHeight = startHeight * proportion
            break
          case 6:
            sideX = startWidth - offsetX
            sideY = startHeight + offsetY
            gainHypotenuse = Math.sqrt(sideX * sideX + sideY * sideY)
            gainHypotenuse = Math.sqrt(sideX * sideX + sideY * sideY)
            proportion = gainHypotenuse / startHypotenuse
            endWidth = startWidth * proportion
            endHeight = startHeight * proportion
            break
          case 1:
            endHeight = startHeight - offsetY
            break
          case 5:
            endHeight = startHeight + offsetY
            break
          case 3:
            endWidth = startWidth + offsetX
            break
          case 7:
            endWidth = startWidth - offsetX
            break
        }
        currentRef!.current!.style.width = endWidth + 'px'
        currentRef!.current!.style.height = endHeight + 'px'
        updateStyle(currentRef!.current!, docContainer.getBoundingClientRect())
      })

      const unUp = fromEvent(document, 'mouseup').subscribe(() => {
        callback({
          width: endWidth + 'px',
          height: endHeight + 'px'
        })
        docContainer.style.pointerEvents = ''
        unMove.unsubscribe()
        unUp.unsubscribe()
      })
    })
  )

  const subs2: Subscription[] = []
  // 父插槽发生更新后重新给 img 添加事件监听
  onParentSlotUpdated(() => {
    // console.log('onParentSlotUpdated')
    // 清理一下上一个 subs2, 确保只有一个生效
    subs2.forEach(i => i.unsubscribe())
    subs2.length = 0
    // 此时立刻获取的 ref.current 是旧的，所以应进行一定的延迟后再获取（100 ms 对用户基本无感）
    setTimeout(() => {
      subs2.push(fromEvent(ref.current!, 'click').subscribe((ev) => {
        currentRef = ref
        isFocus = true
        selection.selectComponent(componentInstance, true)
        updateStyle(ref.current!, docContainer.getBoundingClientRect())
        docContainer.appendChild(mask)
        ev.stopPropagation()
      }))
    }, 100)
  })

  

  onViewInit(() => {
    subs.push(
      fromEvent(ref.current!, 'click').subscribe((ev) => {
        // console.log('click', ref.current)
        currentRef = ref
        isFocus = true
        selection.selectComponent(componentInstance, true)
        updateStyle(ref.current!, docContainer.getBoundingClientRect())
        docContainer.appendChild(mask)
        ev.stopPropagation()
      })
    )
  })

  onDestroy(() => {
    isFocus = false
    mask.parentNode?.removeChild(mask)
    subs.forEach(i => i.unsubscribe())
    subs2.forEach(i => i.unsubscribe())
  })
}

function updateStyle(nativeElement: HTMLElement, offsetRect: Rect) {
  const rect = nativeElement.getBoundingClientRect()
  // eslint-disable-next-line max-len
  mask.style.cssText = `left: ${rect.left - offsetRect.left}px; top: ${rect.top - offsetRect.top}px; width: ${rect.width}px; height: ${rect.height}px;`
  text.innerText = `${Math.round(rect.width)}px * ${Math.round(rect.height)}px`
}
