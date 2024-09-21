import { createRef, createSignal, inject, withAnnotation } from '@viewfly/core'
import { withScopedCSS } from '@viewfly/scoped-css'
import { Adapter, Commander, Component, ContentType, Slot, Subscription, Textbus } from '@textbus/core'
// import { Editor } from '../../editor'
import { AnimeService, RefreshService } from '../../services/_api'
import css from './anime-contextmenu.scss'
import { VIEW_CONTAINER } from '@textbus/platform-browser'
import { useProduce } from '@viewfly/hooks'
import { AnimeProvider } from '../../providers/_api'
import { AnimeComponent, ListComponent } from '../../textbus/components/_api'
import { AnimeTool } from '../_common/anime.tool'

export const AnimeContextmenu = withAnnotation({
  providers: [RefreshService]
}, function AnimeContextmenu() {
  const animeService = inject(AnimeService)
  const adapter = inject(Adapter)
  const textbus = inject(Textbus)
  const animeProvider = inject(AnimeProvider)
  const viewContainer = inject(VIEW_CONTAINER)
  
  const subs: Subscription[] = []

  const [positionSignal, updatePosition] = useProduce({
    left: 0,
    top: 0,
    display: false
  })

  subs.push(
    animeService.onContextmenu.subscribe(element => {
      if(!element) return
      
      const containerRect = viewContainer.getBoundingClientRect()
      const rect = element.getBoundingClientRect()
    
      if(element.tagName.toLocaleLowerCase() === 'anime') {
        // 格式处理逻辑
        const { x, y } = getTextNodeEndPosition(element)
        console.log(x, y)
        updatePosition(draft => {
          draft.left = x - containerRect.left
          draft.top = y - containerRect.top
          draft.display = true
        })
      }
      if(element.className === 'anime-component-tab') {
        // 组件处理逻辑
      }
      // updatePosition(draft => {
      //   draft.left = rect.left - containerRect.left
      //   draft.top = rect.top - containerRect.top
      //   draft.display = true
      // })
    })
  )
  
  return withScopedCSS(css, () => {
    const position = positionSignal()
    
    return (
      <div
        class="contextmenu"
        style={
          {
            left: position.left + 'px',
            top: position.top + 'px',
            display: position.display ? 'block' : 'none'
          }
        }>
        菜单
      </div>
    )
  })
})

/** 递归查询最后一个文本节点的坐标 */
function getTextNodeEndPosition(element: HTMLElement | ChildNode) {
  const lastChild = element.lastChild
  if (!lastChild) {
    const rect = (element as HTMLElement).getBoundingClientRect()
    return {
      x: rect.x + rect.width,
      y: rect.y
    }
  }
  if (lastChild.nodeType === Node.TEXT_NODE) {
    // 如果最后一个子节点是文本节点
    const range = document.createRange()
    range.setStart(lastChild, (lastChild as any).length)
    range.setEnd(lastChild, (lastChild as any).length)

    const rect = range.getBoundingClientRect()
    return {
      x: rect.x + rect.width,
      y: rect.y,
    }
  }
  // 如果最后一个子节点不是文本节点，递归查找
  return getTextNodeEndPosition(lastChild)
}
