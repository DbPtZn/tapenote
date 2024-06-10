import useStore from '@/store'
import { Bridge } from '../../bridge'
import { Subscription, fromEvent, auditTime } from '@tanbo/stream'
import { VIEW_DOCUMENT } from '@textbus/platform-browser'
import { ANIME, ANIME_COMPONENT } from '@/editor'
import { useMessage } from 'naive-ui'
import { onUnmounted } from 'vue'
import { Renderer } from '@textbus/core'
export function usePromoter(procedureId: string, bridge: Bridge) {
  const { projectStore } = useStore()
  const message = useMessage()
  const subs: Subscription[] = []
  /** 选择启动子 */
  function handlePromoterSelect(fragmentId: string, subscript: number) {
    makePresetStart(fragmentId, subscript, null)
  }
  /** 更新启动子 */
  function handlePromoterUpdate(fragmentId: string, subscript: number, aniId: string | null) {
    makePresetStart(fragmentId, subscript, aniId)
  }
  /** 移除启动子 */
  function handlePromoterRemove(fragmentId: string, subscript: number) {
    removePromoter(fragmentId, subscript)
  }
  /** 定位启动子 */
  function handleAnimeLocate(aniId: string | null) {
    if(!aniId) return
    bridge.animeUtils?.locateAnimeBlock(aniId)
  }
  /** 开启预设进程 */
  function makePresetStart(fragmentId: string, subscript: number, oldAniId: string | null) {
    // 每次开启预设启动子进程时，取消之前的订阅并清空 subs, 确保有且只有一个订阅生效 （使得每次点击 character 时都能获得一个新的监听）
    makePresetEnd() // 结束上一个订阅
    const container = bridge.container
    const renderer = bridge.renderer
    if (!container || !renderer) return
    subs.push(
      // ----------------- 弃用 ( 改用事件委托 ) ------------------
      // bridge.animeService!.onAnimeClick.subscribe(animeInfo => {
      //   const { id, serial } = animeInfo
      //   addPromoter(fragmentId, subscript, serial, id)
      //   if (oldAniId) { // 更新操作时的判定
      //     const isUnique = checkPromoterUnique(oldAniId)
      //     // aniId 是唯一绑定，其被替换后，应该取消其对应动画块的激活状态
      //     if (isUnique) setAnimeToInactive(oldAniId)
      //   }
      //   makePresetEnd()
      // }),
      fromEvent<PointerEvent>(container, 'click').subscribe(ev => {
        // console.log(ev)
        let id = ''
        let serial = ''
        const target = ev.target as HTMLElement
        if (target.tagName.toLocaleLowerCase() === 'anime') {
            ev.preventDefault() // 阻止默认事件
            ev.stopPropagation() // 阻止事件冒泡
            // console.log('anime')
            if (target.dataset.id && target.dataset.serial) {
              id = target.dataset.id
              serial = target.dataset.serial
            }
        }
        if (target.classList.contains('anime-component-tab')) {
          const node = target.parentElement
          if(node?.tagName.toLocaleLowerCase() === 'anime-component') {
            ev.preventDefault() // 阻止默认事件
            ev.stopPropagation() // 阻止事件冒泡
            // console.log(node)
            const component = renderer.getComponentByNativeNode(node)
            if(component) {
              // console.log(component.state)
              const state = component.state
              if (state && state.dataId && state.dataSerial) {
                id = state.dataId
                serial = state.dataSerial
              }
            }
          }
        }
        addPromoter(fragmentId, subscript, serial, id)
        if (oldAniId) { // 更新操作时的判定
          const isUnique = checkPromoterUnique(oldAniId)
          // aniId 是唯一绑定，其被替换后，应该取消其对应动画块的激活状态
          if (isUnique) setAnimeToInactive(oldAniId)
        }
        makePresetEnd()
      }),
      fromEvent(document, 'click', true).pipe(auditTime(5)).subscribe(event => {
        // 点击动画标记以外的任意位置取消预设动画进程
        // 设置一定时间延迟，确保点击动画标记时不会触发该订阅
        // (实际上添加了 auditTime 后，事务会变成宏任务，animeClick 作为微任务会先于该宏任务执行)
        // 点击动画标记后结束进程时会销毁所有订阅，所以该订阅也不会触发
        makePresetEnd()
      })
    )
  }
  /** 预设进程结束 */
  function makePresetEnd() {
    // 完成预设后，取消之前的订阅并清空 subs
    if (subs.length > 0) {
      subs.forEach(sub => sub.unsubscribe())
      subs.length = 0
    }
  }
  function addPromoter(fragmentId: string, subscript: number, serial: string, aniId: string) {
    projectStore.fragment(procedureId).addPromoter({
      fragmentId: fragmentId,
      promoterIndex: subscript,
      promoterSerial: serial,
      promoterId: aniId
    }, (aniId) => setAnimeToActive(aniId))
  }
  function removePromoter(fragmentId: string, subscript: number) {
    projectStore.fragment(procedureId).removePromoter({
      fragmentId: fragmentId,
      promoterIndex: subscript
    }, (aniId) => setAnimeToInactive(aniId))
  }
  function setAnimeToInactive(aniId: string) {
    // 查找启动子序列中是否还有相同的动画 id
    const isExist = projectStore.fragment(procedureId).getBySort().some((item) => {
      return item.promoters.includes(aniId)
    })
    if (!isExist) bridge.animeState?.setInactive(aniId)
  }
  function setAnimeToActive(aniId: string) {
    bridge.animeState?.setActive(aniId)
  }
  // 校验启动子的唯一性
  function checkPromoterUnique(aniId: string) {
    const isExist = projectStore.fragment(procedureId).getBySort().some(fragment => {
      return fragment.promoters.includes(aniId)
    })
    // isExist 为 true， 意味着该 aniId 非唯一绑定，返回 false
    return !isExist
  }
  /** 
   * -启动子的状态校验: 用于校验启动子是否有正确绑定动画快
   * -当发现启动子关联的动画块已经被移除时，相应的启动子也会被移除
   */
  function checkPromoter() {
    const container = bridge.editor!.get(VIEW_DOCUMENT)
    projectStore.fragment(procedureId).getBySort().forEach((fragment, index, arr) => {
      fragment.promoters.forEach((promoter, subscript) => {
        // console.log(typeof promoter)
        if(promoter) {
          // console.log(promoter)
          const elem = container.querySelector(`[data-id="${promoter}"]`) as HTMLElement
          if (elem) {
            // 启动子存在但动画格式未被激活的情况，处理：重新激活动画块
            if ([ANIME, ANIME_COMPONENT].includes(elem.tagName.toLowerCase()) && elem.dataset.state === 'inactive') {
              console.log(elem)
              setAnimeToActive(promoter)
            }
            const serial = arr[index].tags[subscript]
            if (elem.dataset.serial && serial) {
              // 启动子编号不匹配的情况
              if (elem.dataset.serial !== serial.toString()) {
                // 策略一： 更新动画块编号（内容发生变化自动触发更新）
                bridge.animeState!.updateSerial(promoter, Number(serial))
                // 策略二： 更新启动子编号
                // fragment.tags[subscript] = elem.dataset.serial
                // ...更新至数据库操作
              }
            }
            // 动画组件的处理逻辑
          } else {
            // 启动子存在，但动画块不存在的情况，处理：移除启动子
            removePromoter(fragment.id, subscript)
          }
        }
      })
    })
  }

  /** 
   * - 所有动画块（不区分formatter和component）的状态校验: 用于校验已激活的动画块是否有正确绑定启动子，如果绑定的启动子不存在，取消动画块激活状态
   */
  function checkAnimeState() {
    const container = bridge.editor!.get(VIEW_DOCUMENT)
    const elements = container.querySelectorAll(ANIME + ',' + ANIME_COMPONENT) as NodeListOf<HTMLElement>
    elements.forEach((element) => {
      // 找到激活态的 AnimeComponent
      if (element.dataset.state === 'active') {
        const animeId = element.dataset.id as string
        // 查询激活态 Anime 标签块是否绑定了启动子
        const isExist = projectStore.fragment(procedureId).getBySort().some(fragment => {
          return fragment.promoters.includes(animeId)
        })
        // 如果没有绑定启动子，则将动画组件置为非激活态
        if (!isExist) setAnimeToInactive(animeId)
      }
    })
  }

  /** 动画格式状态校验 */
  function checkAnimeFormatter() {
    const container = bridge.editor!.get(VIEW_DOCUMENT)
    // 找到所有 Anime 标签块
    const elements = container.querySelectorAll(ANIME) as NodeListOf<HTMLElement>
    // 遍历动画 Anime 标签块
    elements.forEach(element => {
      // 找到激活态的 Anime 标签块
      if (element.dataset.state === 'active') {
        const animeId = element.dataset.id as string
        // 查询激活态 Anime 标签块是否绑定了启动子
        const isExist = projectStore.fragment(procedureId).getBySort().some(fragment => {
          return fragment.promoters.includes(animeId)
        })
        // 如果没有绑定启动子，则将动画块置为非激活态
        if (!isExist) setAnimeToInactive(animeId)
      }
    })
  }
  /** 动画组件状态校验 */
  function checkAnimeComponent() {
    const container = bridge.editor!.get(VIEW_DOCUMENT)
    const elements = container.querySelectorAll(ANIME_COMPONENT) as NodeListOf<HTMLElement>
    elements.forEach((element) => {
      // 找到激活态的 AnimeComponent
      if (element.dataset.state === 'active') {
        const animeId = element.dataset.id as string
        // 查询激活态 Anime 标签块是否绑定了启动子
        const isExist = projectStore.fragment(procedureId).getBySort().some(fragment => {
          return fragment.promoters.includes(animeId)
        })
        // 如果没有绑定启动子，则将动画组件置为非激活态
        if (!isExist) setAnimeToInactive(animeId)
      }
    })
  }
  /** 动画与启动子重新排序 */
  function handleReorder() {
    /** 动画标记重排序 */
    const animeState = bridge.animeState!
    const container = bridge.editorRef!
    // 查询所有动画元素（通过 dom 查询得到的结果一般就是自上而下的顺序）
    const elements = container.querySelectorAll(ANIME + ',' + ANIME_COMPONENT) as NodeListOf<HTMLElement> 
    const sequence: string[] = []
    elements.forEach((element) => {
      if(element.dataset.id) {
        sequence.push(element.dataset.id)
      }
    })
    // 去重（动画标签可能有重复的情况）
    const uniqueSet = new Set(sequence)
    const uniqueSequence = [...uniqueSet]
    uniqueSequence.forEach((aniId, index) => {
      animeState.updateSerial(aniId, index + 1)
    })

    /** 更新启动子标记 */
    const timer = setTimeout(() => {
      projectStore.fragment(procedureId).getBySort().forEach(fragment => {
        fragment.promoters.forEach((promoter, index) => {
          if(promoter) {
            const element = document.querySelector(`[data-id="${promoter}"]`) as HTMLElement
            fragment.tags[index] = element && element.dataset.serial ? element.dataset.serial : null
          }
        })
      })
  
      projectStore.fragment(procedureId).updateFragmentsTags()
      .then(() => {
        message.success('重新排序成功！')
        clearTimeout(timer)
      }).catch(err => {
        console.log(err)
        clearTimeout(timer)
        message.error('重新排序失败！')
      })
    }, 5)
  }

  onUnmounted(() => {
    subs.forEach(s => s.unsubscribe())
  })

  return {
    handlePromoterSelect,
    handlePromoterUpdate,
    handlePromoterRemove,
    handleAnimeLocate,
    handleReorder,
    checkPromoter,
    checkAnimeState,
  }
}
