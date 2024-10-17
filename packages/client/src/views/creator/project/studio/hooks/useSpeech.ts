import { Bridge } from '../../bridge'
import { Subscription, auditTime, fromEvent } from '@tanbo/stream'
import { AnimeProvider } from '@/editor'
import { SelectOption, useMessage } from 'naive-ui'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Editor, Layout } from '@textbus/editor'
import useStore from '@/store'
type Action = Required<Parameters<ReturnType<ReturnType<typeof useStore>['projectStore']['fragment']>['createByAudio']>[0]['actions']>[0]

export function useSpeech(bridge: Bridge, getCurrentDuration: () => number, handleOperate: () => void) {
  const message = useMessage()

  const subs1: Subscription[] = []
  const subs2: Subscription[] = []


  let studioEl: HTMLElement
  let editorEl: HTMLElement
  let scrollerEl: HTMLElement
  let containerEl: HTMLElement
  const mode = ref('speech')
  let animeMap: HTMLElement[] = []
  let actionSequence: Action[] = []
  let animeProvider: AnimeProvider
  let editor: Editor
  let startTime = 0
  const pointerIndex = ref(-1)

  onMounted(() => {
    studioEl = bridge.studioRef!
    bridge.onEditorReady.subscribe((e) => {
      editor = e
      editorEl = bridge.editorRef!
      scrollerEl = bridge.scrollerRef!
      containerEl = editor.get(Layout).container
      animeProvider = editor.get(AnimeProvider)
    })
  })
  
  const options: SelectOption[] = [
    {
      label: '演讲模式',
      value: 'speech',
      txt: '演讲'
    },
    {
      label: '解读模式',
      value: 'interpretation',
      txt: '解读'
    }
  ]
  
  function start(callback: () => void) {
    const elements = editorEl.querySelectorAll<HTMLElement>(`[data-id]:not([data-id=""])`)
    if (!elements) return
    animeMap = Array.from(elements)
    if (!editorEl) return

    // 监听点击事件, 从目标动画块开始录制
    const startEvent = fromEvent<PointerEvent>(editorEl, 'click').subscribe(e => {
      const target = e.target as HTMLElement
      const animeElement = AnimeProvider.toAnimeElement(target)
      if (!animeElement) return
      let startpoint = false
      animeMap.forEach((element, index) => {
        if (element === animeElement) {
          startpoint = true
          // 等待录音器启动，否则会出现错误计时
          const timer = setTimeout(() => {
            pointerIndex.value = index
            clearTimeout(timer)
          }, 500)
          return
        }
        if (!startpoint) return
        if(mode.value === 'speech') element.style.visibility = 'hidden'
      })
  
      callback()
      bridge.handleBlur()
      // startTime = Date.now()
      startEvent.unsubscribe()

      // 允许通过点击动画来添加动作
      subs2.push(
        fromEvent<PointerEvent>(editorEl, 'click').subscribe(e => {
          const target = e.target as HTMLElement
          const animeElement = AnimeProvider.toAnimeElement(target)
          if (!animeElement) return
          const index = animeMap.findIndex(element => element === animeElement)
          if(index !== -1) pointerIndex.value = index
          
          const el = animeMap[index]
          const animeId = el.dataset.id
          const serial = el.dataset.serial
          if(!animeId || !serial) return
          const currentDuration = getCurrentDuration()
          // console.log(currentDuration)
          actionSequence.push({
            animeId,
            serial,
            keyframe: currentDuration
          })
        })
      )
    })

    subs1.push(
      fromEvent<KeyboardEvent>(window, 'keydown').pipe(auditTime(100)).subscribe(e => {
        if(mode.value === 'interpretation') return
        if (['ArrowDown'].includes(e.code)) {
          if (pointerIndex.value < animeMap.length - 1) pointerIndex.value++
          else message.info(`到底啦!`)
        }
        if (e.code === 'ArrowUp') {
          if (pointerIndex.value > 0) pointerIndex.value--
          else message.info(`到顶啦!`)
        }
        // TODO 通知录音器，如果用户保持操作，不要重起新录音
      })
    )
  }

  function stop() {
    animeMap.forEach(element => {
      element.style.visibility = 'visible'
    })
    animeMap = []
    subs1.forEach(sub => sub.unsubscribe())
    subs2.forEach(sub => sub.unsubscribe())
  }

  onUnmounted(() => {
    animeMap = []
    subs1.forEach(sub => sub.unsubscribe())
    subs2.forEach(sub => sub.unsubscribe())
  })

  function getActionSequence() {
    const sequence = actionSequence
    actionSequence = []
    return sequence
  }

  watch(() => pointerIndex.value, index => {
    handleOperate()
    const el = animeMap[index]
    const animeId = el.dataset.id
    const serial = el.dataset.serial
    if(!animeId || !serial) return
    const effect = el.dataset.effect || 'bounceIn'
    const handler = animeProvider.getAnime(effect)
    if (!handler) return
    const isMarked = animeMap[index].style.visibility !== 'visible'
    applyAnime(el, handler.play)
    applyScroll({
      el,
      scroller: scrollerEl,
      container: containerEl,
      commonRollSpeed: 1,
      commonReservedZone: 300,
      overflowTopRollSpeed: 2,
      overflowTopReservedZone: 200,
      overflowBottomRollSpeed: 2,
      overflowBottomReservedZone: 200
    })
    if(!isMarked) return // 已经播放过的动画块通过 ↑↓ 操作不会再记录动作
    const currentDuration = getCurrentDuration()
    // console.log(currentDuration)
    actionSequence.push({
      animeId,
      serial,
      keyframe: currentDuration
    })
  })

  return {
    mode,
    options,
    startSpeech: start,
    stopSpeech: stop,
    getActionSequence,
  }
}

function applyAnime(
  el: HTMLElement,
  handler: (target: Element) => anime.AnimeInstance
) {
  const display = el.style.display
  switch (el.tagName.toLocaleLowerCase()) {
    case 'anime':
      el.style.display = 'inline-block'
      break
    case 'anime-component':
      el.style.display = 'block'
      break
    default:
      el.style.display = 'block'
      break
  }
  el.style.visibility = 'visible'
  handler(el).finished.then(() => {
    el.style.display = display
  })
}


// const div = document.createElement('div')
// div.tabIndex = 0
// document.body.appendChild(div)
// /** 将焦点从编辑器上移除 */
// function blur() {
//   div.focus()
// }
// function clearDiv() {
//   div.remove()
// }

let scrollTimer: NodeJS.Timeout
function applyScroll(args: {
  /** 播放中的动画元素 */
  el: HTMLElement
  /** 滚动层 */
  scroller: HTMLElement
  /** 容器层 */
  container: HTMLElement
  /** 一般滚动速率 默认 1 */
  commonRollSpeed: number
  /** 一般预留区 默认 300  */
  commonReservedZone: number
  /** 溢出滚动速率 默认 1 */
  overflowTopRollSpeed: number
  /** 溢出预留区 默认 100 */
  overflowTopReservedZone: number
  /** 溢出滚动速率 默认 1 */
  overflowBottomRollSpeed: number
  /** 溢出预留区 默认 100 */
  overflowBottomReservedZone: number
}) {
  const {
    el,
    scroller,
    container,
    commonRollSpeed,
    commonReservedZone,
    overflowTopRollSpeed,
    overflowTopReservedZone,
    overflowBottomRollSpeed,
    overflowBottomReservedZone
  } = args
  const Horizon = scroller.clientHeight // 可视窗口的高度
  const Scrolled = scroller.scrollTop // 已滚动高度
  const Node2Top = getTopDistance(el) - container.offsetTop // 节点距离文档顶部（指节点的上边界至文档顶部）
  // console.log(getTopDistance(el))
  // console.log(container.offsetTop)
  const NodeHeight = el.clientHeight // 元素自身的高度
  const Node2HorizonBottom = Horizon + Scrolled - Node2Top - NodeHeight //节点距离可视区间底部
  if (Node2Top < Scrolled) {
    clearInterval(scrollTimer) // 立即结束上一个滚动事务
    // 节点距离可视区间顶部小于滚动距离（溢出可视区间上边界），执行回滚动作
    let Node2HorizonTop = Scrolled - Node2Top // 溢出上边界的高度 = 已滚距离 - 节点至文档顶部距离
    let rollSpeed = Math.round((Node2HorizonTop + overflowTopReservedZone) / (30 / overflowTopRollSpeed)) // 基于溢出上边界的距离(加预留区高度)来计算滚动速率
    if (rollSpeed < 10) rollSpeed = 10 // 最小滚动速率为 10
    scrollTimer = setInterval(() => {
      scroller.scrollTop -= rollSpeed
      Node2HorizonTop -= rollSpeed
      if (Node2HorizonTop <= -overflowTopReservedZone) {
        clearInterval(scrollTimer)
        return
      }
    }, 10)
  } else if (Node2HorizonBottom < 0) {
    clearInterval(scrollTimer) // 立即结束上一个滚动事务
    //节点距离可视区间底部小于0（溢出可视区间下边界），执行滚动动作
    let Node2HorizonBottomAbs = Math.abs(Node2HorizonBottom) // 计算溢出的距离（取绝对值）
    let rollSpeed = Math.round((Node2HorizonBottomAbs + overflowBottomReservedZone) / (30 / overflowBottomRollSpeed)) // 基于溢出的距离(加预留区高度)计算滚动速率
    if (rollSpeed < 10) rollSpeed = 10 // 最小滚动速率为 10
    scrollTimer = setInterval(() => {
      scroller.scrollTop += rollSpeed
      Node2HorizonBottomAbs -= rollSpeed
      // 默认滚动后，给底部预留 100 px 的距离
      if (Node2HorizonBottomAbs < -overflowBottomReservedZone) {
        clearInterval(scrollTimer)
        return
      }
    }, 10)
    // this.applyNativeScroll(el, container, scroller) // 原生滚动模式
  } else if (Node2HorizonBottom < 200 && Node2HorizonBottom > 0) {
    clearInterval(scrollTimer) // 立即结束上一个滚动事务
    //设置当节点距离可视区间底部小于200时，执行动作
    let sum = 0 // 滚动累计量
    scrollTimer = setInterval(() => {
      scroller.scrollTop += 10 * commonRollSpeed
      sum += 10 * commonRollSpeed
      // 默认滚动后，给底部预留 300 px 的空间
      if (sum > commonReservedZone) {
        clearInterval(scrollTimer)
        return
      }
    }, 20)
  } else {
    //排除上述三种情况以后，执行动作
    clearInterval(scrollTimer)
    return
  }
}

/**
 * 获取最外层（祖先）元素到顶部的距离（部分组件中的元素offsetTop可能是相对于组件）
 * @param el 目标元素
 * @returns 返回距离
 */
function getTopDistance(el: HTMLElement) {
  let i = el.offsetTop
  while (el.offsetParent) {
    el = el.offsetParent as HTMLElement
    i += el.offsetTop
  }
  return i
}