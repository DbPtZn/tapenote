import useStore from '@/store'
import { DropdownOption } from 'naive-ui'
import { h, onUnmounted, reactive, ref } from 'vue'
import _ from 'lodash'
import { useDialog, useMessage } from 'naive-ui'
import { Player } from '@/editor'
import { Icon } from '@iconify/vue'
import { Subject, Subscription, fromEvent } from '@tanbo/stream'
import { SortableEvent } from 'vue-draggable-plus'
import { Bridge } from '../../bridge'
import FragmentEditor from '../FragmentEditor.vue'
import { NConfig } from '@/views/creator/_common'

type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]
export function useFragment(projectId: string, bridge: Bridge, checkAnimeState: () => void, pauseWatch: () => void, resumeWatch: () => void) {
  // console.log('useFragment：', bridge)
  const { projectStore, clipboardStore } = useStore()
  const onPlayerStateUpdate = new Subject<boolean>()
  const isShowOrder = ref(false)
  const dialog = useDialog()
  const message = useMessage()
  let player: Player | undefined = undefined
  const subs: Subscription[] = []
  const selectedFragments = ref<Fragment[]>([])
  const dropdownState = reactive({
    x: 0,
    y: 0,
    options: [] as DropdownOption[],
    isShow: false
  })
  const playerState = reactive({
    isPlaying: false,
    currentTime: 0
  })

  /** 选择片段 */
  function handleSelect(isSelected: boolean, fragment: Fragment) {
    if (isSelected) {
      selectedFragments.value.push(fragment)
    } else {
      if (selectedFragments.value.length === 0) return
      selectedFragments.value.splice(
        selectedFragments.value.findIndex(f => f.id === fragment.id),
        1
      )
    }
  }

  function handleExpand(fragment: Fragment) {
    fragment.collapsed = false
    projectStore
      .fragment(projectId)
      .updateCollapsed(fragment.id, false)
      .catch(error => {
        console.error(error)
        message.warning('服务端更新折叠状态操作失败!')
      })
  }

  /** 右键菜单 */
  function handleContextmenu(e: MouseEvent, fragment?: Fragment) {
    player = bridge.editor?.get(Player)
    const project = projectStore.get(projectId)
    if (!project) return
    const sequence = project.sequence
    const fragments = selectedFragments.value.sort((a, b) => {
      return sequence!.indexOf(a.id) - sequence!.indexOf(b.id)
    })
    e.preventDefault()
    e.stopPropagation()
    dropdownState.x = e.clientX
    dropdownState.y = e.clientY
    dropdownState.isShow = true
    dropdownState.options = [
      {
        key: 'collapse',
        label: () => `${fragment?.collapsed ? '展开' : '折叠'}`,
        icon: () => h(Icon, { icon: 'mdi:collapse-all' }),
        show: !!fragment && fragment.transcript.length > 16, // 长度大于 16 才显示折叠按钮
        props: {
          onClick: () => {
            if (fragment) {
              fragment.collapsed = !fragment.collapsed
              projectStore
                .fragment(projectId)
                .updateCollapsed(fragment.id, fragment.collapsed)
                .catch(error => {
                  console.error(error)
                  message.warning('服务端更新折叠状态操作失败!')
                })
            }
            dropdownState.isShow = false
          }
        }
      },
      {
        key: 'order',
        label: () => `${isShowOrder.value ? '隐藏排序' : '显示排序'}`,
        icon: () => h(Icon, { icon: 'icon-park-solid:recent-views-sort' }),
        show: !!fragment, // 长度大于 16 才显示折叠按钮
        props: {
          onClick: () => {
            isShowOrder.value = !isShowOrder.value
            dropdownState.isShow = false
          }
        }
      },
      {
        key: 'preview',
        label: '播放预览',
        icon: () => h(Icon, { icon: 'iconamoon:player-play-bold' }),
        show: !!fragment,
        props: {
          onClick: () => {
            applyPlay(fragments)
            dropdownState.isShow = false
          }
        }
      },
      {
        key: 'preview-from-here',
        label: '向下播放',
        icon: () => h(Icon, { icon: 'iconamoon:player-next-duotone' }),
        show: fragments.length === 1,
        props: {
          onClick: () => {
            const allFragments = projectStore.fragment(projectId).getBySort()
            const targetIndex = allFragments.indexOf(fragment!)
            if (targetIndex === -1) return
            const includeFragments = allFragments.slice(targetIndex)
            applyPlay(includeFragments)
            dropdownState.isShow = false
          }
        }
      },
      {
        key: 'copy',
        label: '复制',
        icon: () => h(Icon, { icon: 'mdi:content-copy' }),
        show: fragments.length === 1,
        props: {
          onClick: () => {
            clipboardStore.copyFragment({
              fragmentId: fragment!.id,
              projectId: projectId,
              type: 'copy',
              account: project.account,
              hostname: project.hostname,
              success: () => {
                // message.success('片段复制粘贴成功！')
              }
            })
            dropdownState.isShow = false
          }
        }
      },
      {
        key: 'cut',
        label: '剪切',
        icon: () => h(Icon, { icon: 'mdi:content-cut' }),
        show: fragments.length === 1,
        props: {
          onClick: () => {
            clipboardStore.copyFragment({
              fragmentId: fragment!.id,
              projectId: projectId,
              type: 'cut',
              account: project.account,
              hostname: project.hostname,
              success: () => {
                // message.success('片段剪切粘贴成功！')
                checkAnimeState()
              }
            })
            dropdownState.isShow = false
          }
        }
      },
      {
        key: 'insert-before',
        label: '在前面粘贴片段',
        icon: () => h(Icon, { icon: 'hugeicons:insert-top-image' }),
        disabled: !(clipboardStore.fragment.length === 1),
        show: fragments.length === 1,
        props: {
          onClick: () => {
            clipboardStore
              .pasteFragment({
                fragmentId: fragment!.id,
                projectId: projectId,
                position: 'before',
                account: project.account,
                hostname: project.hostname
              })
              .then(() => {
                // if (clipboardStore.fragment.length !== 0 && clipboardStore.fragment[0].type === 'cut') {
                //   checkAnimeState()
                // }
                clipboardStore.fragment = []
              })
              .catch(err => {
                message.error(err)
              })
            dropdownState.isShow = false
          }
        }
      },
      {
        key: 'insert-after',
        label: '在后面粘贴片段',
        icon: () => h(Icon, { icon: 'hugeicons:insert-bottom-image' }),
        disabled: !(clipboardStore.fragment.length === 1),
        show: fragments.length === 1,
        props: {
          onClick: () => {
            clipboardStore
              .pasteFragment({
                fragmentId: fragment!.id,
                projectId: projectId,
                position: 'after',
                account: project.account,
                hostname: project.hostname
              })
              .then(() => {
                // if (clipboardStore.fragment.length !== 0 && clipboardStore.fragment[0].type === 'cut') {
                //   checkAnimeState()
                // }
                clipboardStore.fragment = []
              })
              .catch(err => {
                message.error(err)
              })
            dropdownState.isShow = false
          }
        }
      },
      {
        key: 'insert',
        label: '粘贴片段',
        icon: () => h(Icon, { icon: 'mdi:content-paste' }),
        disabled: !(clipboardStore.fragment.length === 1),
        show: fragments.length === 0,
        props: {
          onClick: () => {
            clipboardStore
              .pasteFragment({
                fragmentId: '',
                projectId: projectId,
                position: 'insert',
                account: project.account,
                hostname: project.hostname
              })
              .then(() => {
                clipboardStore.fragment = []
              })
              .catch(err => {
                message.error(err)
              })
            dropdownState.isShow = false
          }
        }
      },
      {
        key: 'copy-txt',
        label: '复制文本',
        icon: () => h(Icon, { icon: 'lucide-lab:copy-type' }),
        show: fragments.length === 1,
        props: {
          onClick: () => {
            const txt = fragment?.txt || fragment!.transcript.join('')
            navigator.clipboard.writeText(txt)
            message.success(`已复制文本: ${txt}`)
            dropdownState.isShow = false
          }
        }
      },
      {
        key: 'remove',
        label: '移除',
        icon: () => h(Icon, { icon: 'material-symbols:delete-outline' }),
        show: !!fragment,
        props: {
          onClick: () => {
            const removeQueue = fragments.map(fragment => {
              return applyRemove(fragment.id)
            })
            Promise.all(removeQueue)
              .then(() => {
                checkAnimeState() // 移除片段之后，进行动画状态校验
              })
              .catch(err => {
                console.error(err)
                message.error('部分片段移除失败！')
              })
            dropdownState.isShow = false
          }
        }
      }
    ]
  }

  function handleRebuild(fragment: Fragment) {
    projectStore.fragment(projectId).rebuild(fragment)
  }

  function handlePreview() {
    player = bridge.editor?.get(Player) // 获取播放器实例
    const fragments = projectStore.fragment(projectId).getBySort()
    applyPlay(fragments, true)
  }

  /**
   * 控制片段音频播放
   * playingFragmentId 控制聚焦正在播放的片段
   * playingsub 监听片段上的点击事件以控制音频播放的时间
   * aud 音频实例元素
   */
  const playingFragmentId = ref('')
  const playingSub: Subscription[] = []
  let aud: HTMLAudioElement | null = null
  /** 播放音频 */
  function handlePlay(fragment: Fragment) {
    let audio = fragment.audio
    // 正在播放时暂停
    if (aud && aud.played) {
      aud.pause()
      aud.src = ''
      aud = null
      fragment.error && URL.revokeObjectURL(audio)
      playingFragmentId.value = ''
      playingSub.forEach(s => s.unsubscribe())
      playingSub.length = 0
      return
    }
    try {
      if (fragment.error) {
        const audioUrl = URL.createObjectURL(fragment.error.audio)
        audio = audioUrl
      }
      aud = new Audio(audio)
      aud.play()
      playingFragmentId.value = fragment.id
      aud.addEventListener('ended', () => {
        aud = null
        playingFragmentId.value = ''
        playingSub.forEach(s => s.unsubscribe())
        playingSub.length = 0
        fragment.error && URL.revokeObjectURL(audio)
      })
      const fragmentEl = document.getElementById(`${fragment.id}`)
      if(!fragmentEl || !!fragment.error) return
      playingSub.length === 0 && playingSub.push(
        fromEvent(fragmentEl, 'click').subscribe((ev) => {
          const target = ev.target as HTMLElement
          const index = target.dataset.index
          if(index === undefined) return
          const timestamp = fragment.timestamps[Number(index)]
          if(timestamp === undefined || !aud) return
          aud.currentTime = timestamp
        })
      )
    } catch (error) {
      fragment.error && URL.revokeObjectURL(audio)
      message.error('音频播放失败,请检查音频路径')
    }
  }

  /** 编辑文字 */
  function handleEdit(fragment: Fragment) {
    pauseWatch()
    dialog.create({
      showIcon: false,
      style: { width: '800px' },
      title: '片段编辑器',
      maskClosable: false,
      onMaskClick: ev => {
        ev.preventDefault()
      },
      content: () =>
        h(
          NConfig,
          {},
          {
            default: () =>
              h(FragmentEditor, {
                projectId: projectId,
                fragment: fragment,
                onClose: () => {
                  console.log('close')
                  resumeWatch()
                  dialog.destroyAll()
                }
              })
          }
        ),
      onClose: () => {
        console.log('close')
        resumeWatch()
      }
    })
  }
  /** 移除片段 */
  function handleRemove(fragment: Fragment) {
    if(fragment.error) {
      projectStore.fragment(projectId).get().some((f, index, arr) => {
        if(f.id === fragment.id) {
          arr.splice(index, 1)
        }
      })    
      return           
    }
    applyRemove(fragment.id).then(() => checkAnimeState()) // 移除片段之后，进行动画状态校验
  }
  /** 移动片段 */
  function handleMove(event: SortableEvent) {
    // console.log(event)
    const oldIndex = event.oldIndex
    const newIndex = event.newIndex
    const fragmentId = event.item.id
    if (oldIndex === undefined || newIndex === undefined || fragmentId === undefined) return
    // const { element, oldIndex, newIndex } = args.moved
    // console.log([fragmentId, oldIndex, newIndex])
    projectStore.fragment(projectId).updateSequence({
      fragmentId: fragmentId,
      oldIndex,
      newIndex
    })
  }

  function handleDownload(fragment: Fragment) {
    if(fragment.error) {
      const url = URL.createObjectURL(fragment.error.audio)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fragment.id}.wav`
      a.click()

      URL.revokeObjectURL(url)
    }
  }

  function applyRemove(fragmentId: string) {
    return new Promise((resolve, reject) => {
      projectStore
        .fragment(projectId)
        .remove({ fragmentId: fragmentId })
        .then(() => {
          resolve('')
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  /**
   * 应用播放
   * @param fragments 片段列表
   * @param isHidden 播放前是否隐藏元素（为 true 的时候会在播放前将关联的元素隐藏）
   * @returns
   */
  function applyPlay(fragments: Fragment[], isHidden?: boolean) {
    // 1.生成微课数据
    const data = fragments.map(f => {
      return player!.parseData({
        key: f.id,
        audio: f.audio,
        duration: f.duration,
        promoters: f.promoters,
        timestamps: f.timestamps
      })
    })
    // 2.加载数据
    return new Promise((resolve, reject) => {
      player!
        .loadData(data)
        .then(parsedata => {
          if (isHidden) {
            parsedata.forEach(item => {
              item.animeElementSequence.forEach(elements => {
                elements.forEach(element => {
                  // element.style.opacity = '0'
                  element.style.visibility = 'hidden'
                })
              })
            })
          }
          subs.push(
            /** 播放结束时 */
            player!.onPlayOver.subscribe(() => {
              playerState.isPlaying = false
              onPlayerStateUpdate.next(false)
              playerState.currentTime = 0
              playingFragmentId.value = ''
              clearInterval(timer)
              if (isHidden) {
                parsedata.forEach(item => {
                  item.animeElementSequence.forEach(elements => {
                    elements.forEach(element => {
                      // element.style.opacity = '1'
                      element.style.visibility = 'visible'
                    })
                  })
                })
              }
              resolve('')
              subs.forEach(sub => sub.unsubscribe())
            }),
            /** 播放触发时 */
            player!.onPlay.subscribe(ev => {
              if(!ev) return
              playingFragmentId.value = ev
            })
          )
          // 3.加载完成后启动播放
          player!.start(false)
          playerState.isPlaying = true
          onPlayerStateUpdate.next(true)
          const timer = setInterval(() => {
            playerState.currentTime = player!.totalTime
          }, 300)
        })
        .catch(err => {
          reject(err)
          console.error(err)
          message.error('播放失败！')
        })
    })
  }

  onUnmounted(() => {
    subs.forEach(s => s.unsubscribe())
  })

  return {
    selectedFragments,
    dropdownState,
    playerState,
    playingFragmentId,
    onPlayerStateUpdate,
    isShowOrder,
    handleDownload,
    handlePreview,
    handleContextmenu,
    handleExpand,
    handleSelect,
    handlePlay,
    handleEdit,
    handleRemove,
    handleMove,
    handleRebuild
  }
}
