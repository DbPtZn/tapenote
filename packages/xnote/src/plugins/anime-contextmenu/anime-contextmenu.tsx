import { createRef, createSignal, inject, withAnnotation } from '@viewfly/core'
import { withScopedCSS } from '@viewfly/scoped-css'
import { Adapter, Commander, Selection, Component, ContentType, Slot, Subscription, Textbus, auditTime, fromEvent } from '@textbus/core'
// import { Editor } from '../../editor'
import { AnimeService, RefreshService } from '../../services/_api'
import css from './anime-contextmenu.scss'
import { VIEW_CONTAINER } from '@textbus/platform-browser'
import { useProduce } from '@viewfly/hooks'
import { AnimeProvider } from '../../providers/_api'
import { AnimeComponent, ListComponent } from '../../textbus/components/_api'
import { AnimeTool } from '../_common/anime.tool'
import { Dropdown, DropdownProps } from '../../components/dropdown/dropdown'
import { animeFormatter } from '../../textbus/formatters/_api'

export const AnimeContextmenu = withAnnotation({
  providers: [RefreshService]
}, function AnimeContextmenu() {
  const animeService = inject(AnimeService)
  const commander = inject(Commander)
  const selection = inject(Selection)
  const adapter = inject(Adapter)
  const textbus = inject(Textbus)
  const animeProvider = inject(AnimeProvider)
  const viewContainer = inject(VIEW_CONTAINER)
  const subs: Subscription[] = []

  const currentElement = createSignal<HTMLElement | null>(null)
  const [positionSignal, updatePosition] = useProduce({
    left: 0,
    top: 0,
    display: false
  })

  subs.push(
    animeService.onContextmenu.subscribe(element => {
      if(!element) return
      const containerRect = viewContainer.getBoundingClientRect()
    
      if(element.tagName.toLocaleLowerCase() === 'anime') {
        // 格式处理逻辑
        currentElement.set(element)
        const { x, y } = getTextNodeEndPosition(element)
        updatePosition(draft => {
          draft.left = x - containerRect.left + 24
          draft.top = y - containerRect.top
          draft.display = true
        })
      }
      if(element.className === 'anime-component-tab') {
        // 组件处理逻辑
        const naiveNode = element.parentElement
        currentElement.set(naiveNode)
        if(!naiveNode) return
        const rect = naiveNode.getBoundingClientRect()
        updatePosition(draft => {
          draft.left = rect.width
          draft.top = rect.top - containerRect.top
          draft.display = true
        })
      }
      const s = fromEvent(document.body, 'click').subscribe(() => {
        updatePosition(draft => {
          draft.display = false
          currentElement.set(null)
        })
        s.unsubscribe()
      })
    })
  )

  function handleRemove() {
    const element = currentElement()
    if(!element) return
    if(element.tagName.toLocaleLowerCase() === 'anime') {
      removeAnimeFormatter(currentElement())
      return
    }
    if(element.tagName.toLocaleLowerCase() === 'anime-component') {
      removeAnimeComponent(element)
      return
    }
    if(element.dataset.anime === 'true') {
      removeAnimeComponent(element)
    }
  }

  function handlePreview() {
    const element = currentElement()
    if(!element) return
    const effect = element.dataset.effect
    if(!effect) return
    playAnime(element, effect, element.tagName.toLocaleLowerCase() === 'anime')
  }
  
  function removeAnimeFormatter(node: HTMLElement | null) {
    const location = adapter.getLocationByNativeNode(node)
    if (location) {
      /** 设置选区锚点位置 */
      selection.setAnchor(location.slot, location.startIndex)
      /** 设置选区焦点位置 */
      selection.setFocus(location.slot, location.endIndex)
      /** 清除指定格式 */
      commander.unApplyFormat(animeFormatter)
    }
  }

  function removeAnimeComponent(node: HTMLElement | null) {
    const component = adapter.getComponentByNativeNode(node)
    if(!component) return
    AnimeComponent.removeAnime(component, textbus)
  }

  /** 测试动画效果 */
  function playAnime(target: HTMLElement, effect: string, isInline = false) {
    const display = target.style.display
    isInline && (target.style.display = 'inline-block') // 设置成 block 才能正常播放动画
    const anime = animeProvider.getAnime(effect)
    if(anime) {
      anime.play(target).finished.then(() => {
        isInline && (target.style.display = display)
      })
    } else {
      isInline && (target.style.display = display)
    }
  }
  
  return withScopedCSS(css, () => {
    const position = positionSignal()
    
    return (
      <div
        class="contextmenu"
        style={
          {
            left: position.left + 'px',
            top: position.top + 'px',
            scale: position.display ? '1' : '0',
            opacity: position.display ? '1' : '0'
          }
        }>
        <div class="contextmenu-inner" style={{ width: '150px' }}>
          <div class="option" onClick={handleRemove}>
            <span class="icon prefix">✍</span>
            <span class="label">移除</span>
            <span class="icon suffix"> </span>
          </div>
          <AnimeTool abreast={true} style={{height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
            <div class="option">
              <span class="icon prefix">✍</span>
              <span class="label">修改</span>
              <span class="icon suffix xnote-icon-arrow-right"></span>
            </div>
          </AnimeTool>
          <div class="option" onClick={handlePreview}>
            <span class="icon prefix">✍</span>
            <span class="label">预览</span>
            <span class="icon suffix"></span>
          </div>
        </div>
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
