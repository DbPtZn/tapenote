import { createRef, createSignal, inject, withAnnotation } from '@viewfly/core'
import { withScopedCSS } from '@viewfly/scoped-css'
import { Adapter, Commander, Component, ContentType, Slot, Subscription, Textbus } from '@textbus/core'
// import { Editor } from '../../editor'
import { AnimeService, RefreshService } from '../../services/_api'
import css from './add-anime-tool.scoped.scss'
import { VIEW_CONTAINER } from '@textbus/platform-browser'
import { useProduce } from '@viewfly/hooks'
import { AnimeProvider } from '../../providers/_api'
import { AnimeComponent, ListComponent } from '../../textbus/components/_api'
import { AnimeTool } from '../_common/anime.tool'

// 以下组件不支持动画组件
const exclude = ['RootComponent', 'ParagraphComponent', 'BlockComponent', 'AnimeIgnoreComponent', 'AnimeComponent']

export const AddAnimeTool = withAnnotation({
  providers: [RefreshService]
}, function AddAnimeTool() {
  const animeService = inject(AnimeService)
  const adapter = inject(Adapter)
  const textbus = inject(Textbus)
  const animeProvider = inject(AnimeProvider)
  const viewContainer = inject(VIEW_CONTAINER)
  const subs: Subscription[] = []

  const toolRef = createRef<HTMLElement>()
  const btnRef = createRef<HTMLElement>()
  const triggerRef = createRef<HTMLElement>()

  const animeOptions = animeProvider.getOptions()
  
  let currentElement: HTMLElement | null = null
  let currentComponent: Component | null = null
  let isDropdownExpanded = false
  
  const [positionSignal, updatePosition] = useProduce({
    left: 0,
    top: 0,
    display: false
  })

  const [currentOptionSignal, updateCurrentOption] = useProduce({
    effect: animeOptions[0].value,
    title: animeOptions[0].label
  })

  // 计算动画标题的宽度, 修正按钮位置
  const offsetVal = () => currentOptionSignal().title.length * 14

  subs.push(
    animeService.onComponentActive.subscribe((component) => {
      // console.log(component)
      if(isDropdownExpanded) return // 如果下拉列表处于展开状态，则不处理

      // 如果组件不存在，直接跳出
      if (!component) {
        updatePosition(draft => { draft.display = false })
        return
      }

      if (exclude.includes(component.name)) {
        if (component.parentComponent) {
          // 如果组件属于非动画组件，且其父组件也属于非动画组件，不显示按钮
          if (exclude.includes(component.parentComponent?.name)) {
            return
          }
          // 否则，在父组件上显示按钮
          component = component.parentComponent
        }
      }

      // 递归查询父组件是否包含动画忽略组件，若包含该组件则不显示按钮
      let parentComponent = component.parentComponent
      while (parentComponent) {
        if (parentComponent && parentComponent.name === 'RootComponent') break
        if (parentComponent && parentComponent.name === 'AnimeIgnoreComponent') return
        parentComponent = parentComponent.parentComponent
      }

      // 如果是行内组件或文本组件，不显示按钮（可以通过 formatter 方式设置动画）
      if ([ContentType.InlineComponent, ContentType.Text].includes(component.type)) return

      // 如果组件不包含动画属性 且 父组件不是动画组件，说明该组件未添加动画 
      if (component.state.dataAnime || (component.parentComponent && component.parentComponent.name === 'AnimeComponent')) return
      // console.log(component.name)
      const nativeNode = adapter.getNativeNodeByComponent(component) as HTMLElement
      // console.log(nativeNode)
      const containerRect = viewContainer.getBoundingClientRect()
      const rect = nativeNode.getBoundingClientRect()
      const top = rect.top - containerRect.top

      updatePosition(draft => {
        draft.left = -(containerRect.width - rect.width)
        draft.top = top
        draft.display = true
      })
      // console.log(component)
      currentComponent = component
      currentElement = nativeNode
    })
  )
  
  function handleMouseMove() {
    updatePosition(draft => {
      draft.display = true
    })
    if (currentElement) currentElement.style.outline = '1px dashed #aaaaaa30'
  }
  function handleMouseLeave() {
    if (currentElement) currentElement.style.outline = 'none'
  }
  
  function handleClick() {
    if (currentComponent) {
      AnimeComponent.addAnime(currentComponent, textbus, currentOptionSignal().effect, currentOptionSignal().title)
    }
    currentComponent = null
    updatePosition(draft => {
      draft.display = false
    })
  }

  function handleExpendStateChange(is: boolean) {
    isDropdownExpanded = is
  }
  function handleApply(effect: string, title: string) {
    updateCurrentOption(draft => {
      draft.effect = effect
      draft.title = title
    })
  }

  return withScopedCSS(css, () => {
    const position = positionSignal()

    return (
      <div ref={toolRef} class="anime-tool">
        <div
          ref={btnRef}
          class="anime-btn"
          onMousemove={handleMouseMove}
          onMouseleave={handleMouseLeave}
          style={
            {
              left: position.left - offsetVal() + 'px',
              top: position.top + 'px',
              display: position.display ? 'block' : 'none'
            }
          }
          >
            <div class="trigger" ref={triggerRef}>
              <div class="left-btn" onClick={handleClick}>
                <span class="left-btn-txt">{ currentOptionSignal().title }</span>
              </div>
              <div class="right-btn">
                <AnimeTool abreast={true} component={currentComponent} style={{height: '100%', width: '100%', display: 'flex', alignItems: 'center' }} onExpendStateChange={handleExpendStateChange} onApply={handleApply}>
                  <div class="arrow">
                    <span class="xnote-icon-arrow-right"></span>
                  </div>
                </AnimeTool>
              </div>
            </div>
        </div>
      </div>
    )
  })
})