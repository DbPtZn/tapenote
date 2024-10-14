import useStore from '@/store'
import { Bridge } from '../../bridge'
import { Subscription, fromEvent, auditTime } from '@tanbo/stream'
import { VIEW_DOCUMENT } from '@textbus/platform-browser'
import { useMessage } from 'naive-ui'
import { onUnmounted } from 'vue'
import { AnimeProvider } from '@/editor'

export function usePromoter(procedureId: string, bridge: Bridge) {
  const { projectStore } = useStore()
  const message = useMessage()
  const subs: Subscription[] = []
  /** 选择启动子 */
  function handlePromoterSelect(fragmentId: string, subscript: number, id?: string, serial?: string) {
    if(id && serial) return makePreset(fragmentId, subscript, id, serial)
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
    bridge.animeProvider?.locateAnimeBlock(aniId)
  }

  /** 开启预设进程 */
  function makePresetStart(fragmentId: string, subscript: number, oldAniId: string | null) {
    // 每次开启预设启动子进程时，取消之前的订阅并清空 subs, 确保有且只有一个订阅生效 （使得每次点击 character 时都能获得一个新的监听）
    makePresetEnd() // 结束上一个订阅
    const container = bridge.container
    if (!container) return
    subs.push(
      fromEvent<PointerEvent>(container, 'click').subscribe(ev => {
        let id
        let serial
        const target = ev.target as HTMLElement
        if (['anime-component', 'anime'].includes(target.tagName.toLocaleLowerCase())) {
            ev.preventDefault() // 阻止默认事件
            ev.stopPropagation() // 阻止事件冒泡
            id = target.dataset.id
            serial = target.dataset.serial
            bridge.handleAddPromoter(target)
        } else if (target.classList.contains('anime-component-tab')) {
          const animeElement = target.parentElement
          if (animeElement?.dataset.anime !== 'true') return
          ev.preventDefault() // 阻止默认事件
          ev.stopPropagation() // 阻止事件冒泡
          id = animeElement.dataset.id
          serial = animeElement.dataset.serial
          bridge.handleAddPromoter(animeElement)
        }
        if(!serial || !id) return
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
        // 实际上添加了 auditTime 后，事务会变成宏任务，animeClick 作为微任务会先于该宏任务执行
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
  /** 预设启动子  */
  function makePreset(fragmentId: string, subscript: number, id: string, serial: string) {
    addPromoter(fragmentId, subscript, serial, id)
  }

  /** 添加启动子 */
  function addPromoter(fragmentId: string, subscript: number, serial: string, aniId: string) {
    projectStore.fragment(procedureId).addPromoter({
      fragmentId: fragmentId,
      promoterIndex: subscript,
      promoterSerial: serial,
      promoterId: aniId
    }).then(aniId => {
      setAnimeToActive(aniId)
      console.log('移除焦点')
      setTimeout(() => {
        bridge.handleBlur()
      }, 10)
    })
  }

  /** 移除启动子 */
  function removePromoter(fragmentId: string, subscript: number) {
    projectStore.fragment(procedureId).removePromoter({
      fragmentId: fragmentId,
      promoterIndex: subscript
    }).then(aniId => {
      aniId && setAnimeToInactive(aniId)
      bridge.handleBlur()
    })
  }

  function setAnimeToInactive(aniId: string) {
    // 查找启动子序列中是否还有相同的动画 id
    const isExist = projectStore.fragment(procedureId).getBySort().some((item) => {
      return item.promoters.includes(aniId)
    })
    if (!isExist) bridge.animeProvider?.updateAnimeState(aniId, { active: false })
  }
  function setAnimeToActive(aniId: string) {
    bridge.animeProvider?.updateAnimeState(aniId, { active: true })
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
        if(promoter) {
          const elem = container.querySelector(`[data-id="${promoter}"]`) as HTMLElement
          if (elem) {
            // 启动子存在但动画格式未被激活的情况，处理：重新激活动画块
            if (elem.dataset.active === 'false') setAnimeToActive(promoter)
            const serial = arr[index].tags[subscript]
            if (elem.dataset.serial && serial) {
              // 启动子编号不匹配的情况
              if (elem.dataset.serial !== serial.toString()) bridge.animeProvider!.updateAnimeState(promoter, { serial: Number(serial) })
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
    const animeProvider = bridge.editor?.get(AnimeProvider)
    animeProvider?.animeElementIterator(element => {
      // 找到激活态的 AnimeComponent
      if (element.dataset.active === 'true') {
        const animeId = element.dataset.id as string
        // 查询激活态 Anime 标签块是否绑定了启动子 ( 每个动画块都要遍历一遍 fragment )
        const isExist = projectStore.fragment(procedureId).getBySort().some(fragment => {
          return fragment.promoters.includes(animeId)
        })
        // 如果没有绑定启动子，则将动画组件置为非激活态
        if (!isExist) setAnimeToInactive(animeId)
      }
    }, true)
    // const container = bridge.editor?.get(VIEW_DOCUMENT)
    // if(!container) return
    // const elements = AnimeProvider.queryAllAnimeElements(container)
    // elements.forEach((element) => {
    //   // 找到激活态的 AnimeComponent
    //   if (element.dataset.active === 'true') {
    //     const animeId = element.dataset.id as string
    //     // 查询激活态 Anime 标签块是否绑定了启动子 ( 每个动画块都要遍历一遍 fragment )
    //     const isExist = projectStore.fragment(procedureId).getBySort().some(fragment => {
    //       return fragment.promoters.includes(animeId)
    //     })
    //     // 如果没有绑定启动子，则将动画组件置为非激活态
    //     if (!isExist) setAnimeToInactive(animeId)
    //   }
    // })
  }

  /** 动画与启动子重新排序 */
  function handleReorder() {
    /** 动画标记重排序 */
    const animeProvider = bridge.animeProvider
    const container = bridge.editorRef
    if(!container) return
    // 查询所有动画元素（通过 dom 查询得到的结果一般就是自上而下的顺序）
    const elements = AnimeProvider.queryAllAnimeElements(container)
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
      animeProvider?.updateAnimeState(aniId, { serial: index + 1 })
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
    makePreset,
    checkPromoter,
    checkAnimeState,
  }
}
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
// })
/** 动画格式状态校验 */
// function checkAnimeFormatter() {
//   const container = bridge.editor!.get(VIEW_DOCUMENT)
//   // 找到所有 Anime 标签块
//   const elements = container.querySelectorAll('anime') as NodeListOf<HTMLElement>
//   // 遍历动画 Anime 标签块
//   elements.forEach(element => {
//     // 找到激活态的 Anime 标签块
//     if (element.dataset.state === 'active') {
//       const animeId = element.dataset.id as string
//       // 查询激活态 Anime 标签块是否绑定了启动子
//       const isExist = projectStore.fragment(procedureId).getBySort().some(fragment => {
//         return fragment.promoters.includes(animeId)
//       })
//       // 如果没有绑定启动子，则将动画块置为非激活态
//       if (!isExist) setAnimeToInactive(animeId)
//     }
//   })
// }
/** 动画组件状态校验 */
// function checkAnimeComponent() {
//   const container = bridge.editor!.get(VIEW_DOCUMENT)
//   const elements = container.querySelectorAll(ANIME_COMPONENT) as NodeListOf<HTMLElement>
//   elements.forEach((element) => {
//     // 找到激活态的 AnimeComponent
//     if (element.dataset.state === 'active') {
//       const animeId = element.dataset.id as string
//       // 查询激活态 Anime 标签块是否绑定了启动子
//       const isExist = projectStore.fragment(procedureId).getBySort().some(fragment => {
//         return fragment.promoters.includes(animeId)
//       })
//       // 如果没有绑定启动子，则将动画组件置为非激活态
//       if (!isExist) setAnimeToInactive(animeId)
//     }
//   })
// }