import useStore from '@/store'
import { DropdownOption } from 'naive-ui'
import { h, onUnmounted, reactive, ref } from 'vue'
import _ from 'lodash'
import { useDialog, useMessage } from 'naive-ui'
import { Player } from '@/editor'
import { Icon } from '@iconify/vue'
import { Subject, Subscription } from '@tanbo/stream'
import { SortableEvent } from 'vue-draggable-plus'
import { Bridge } from '../../bridge'
import { TxtEdit, FragmentEditor } from '../private'
import { usePromoter } from './usePromoter'

type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]
export function useFragment(projectId: string, bridge: Bridge, checkAnimeState: () => void, checkPromoter: () => void, handleReorder: () => void) {
  // console.log('useFragment：', bridge)
  const { projectStore, clipboardStore } = useStore()
  // const isShowName = ref(false)
  const onPlayerStateUpdate = new Subject<boolean>()
  const isShowOrder = ref(false)
  // const isShowSpeechModeToolbar = ref(false)
  // let autoMoveAnimePointer = false
  const dialog = useDialog()
  const message = useMessage()
  let player: Player | undefined = undefined
  const subs: Subscription[] = []
  // const { checkAnimeState, handleReorder } = usePromoter(projectId, bridge) // bridge 透传无法同步更新，只传入当前值
  const selectedFragments = ref<Fragment[]>([])
  const dropdownState = reactive({
    x: 0,
    y: 0,
    options: [] as DropdownOption[],
    isShow: false
  })
  const playerState = reactive({
    isPlaying: false,
    currentTime: 0,
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
    projectStore.fragment(projectId).updateCollapsed(fragment.id, false).catch(error => {
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
        label: () => `${ fragment?.collapsed ? '展开' : '折叠' }`,
        icon: () => h(Icon, { icon: 'mdi:collapse-all' }),
        show: !!fragment && fragment.transcript.length > 16,  // 长度大于 16 才显示折叠按钮
        props: {
          onClick: () => {
            if(fragment) {
              fragment.collapsed = !fragment.collapsed
              projectStore.fragment(projectId).updateCollapsed(fragment.id, fragment.collapsed).catch(error => {
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
        label: () => `${ isShowOrder.value ? '隐藏排序' : '显示排序' }`,
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
            clipboardStore.pasteFragment({
              fragmentId: fragment!.id,
              projectId: projectId,
              position: 'before',
              account: project.account,
              hostname: project.hostname
            }).then(() => {
              // if (clipboardStore.fragment.length !== 0 && clipboardStore.fragment[0].type === 'cut') {
              //   checkAnimeState()
              // }
              clipboardStore.fragment = []
            }).catch(err => {
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
            clipboardStore.pasteFragment({
              fragmentId: fragment!.id,
              projectId: projectId,
              position: 'after',
              account: project.account,
              hostname: project.hostname
            }).then(() => {
              // if (clipboardStore.fragment.length !== 0 && clipboardStore.fragment[0].type === 'cut') {
              //   checkAnimeState()
              // }
              clipboardStore.fragment = []
            }).catch(err => {
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
            clipboardStore.pasteFragment({
              fragmentId: '',
              projectId: projectId,
              position: 'insert',
              account: project.account,
              hostname: project.hostname
            }).then(() => {
              clipboardStore.fragment = []
            }).catch(err => {
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
      },
    ]
  }


  function handlePreview() {
    player = bridge.editor?.get(Player) // 获取播放器实例
    const fragments = projectStore.fragment(projectId).getBySort()
    applyPlay(fragments, true)
  }

  // const studioOptions: DropdownOption[] = [
  //   // {
  //   //   key: 'auto',
  //   //   label: () => `${autoMoveAnimePointer ? '关闭' : '开启' }自动切换动画块`,
  //   //   icon: () => h(Icon, { icon: 'mdi:animation-play-outline' }),
  //   //   props: {
  //   //     onClick: () => {
  //   //       autoMoveAnimePointer = !autoMoveAnimePointer
  //   //       bridge.handleAutoMoveAnimePointer(autoMoveAnimePointer)
  //   //     }
  //   //   }
  //   // },
  //   // {
  //   //   key: 'lecture', // 演讲
  //   //   label: () => `${isShowSpeechModeToolbar.value ? '隐藏' : '显示'}演讲模式控制台`,
  //   //   icon: () => h(Icon, { icon: 'mdi:speaker' }),
  //   //   props: {
  //   //     onClick: () => {
  //   //       isShowSpeechModeToolbar.value = !isShowSpeechModeToolbar.value
  //   //     }
  //   //   }
  //   // },
  //   // {
  //   //   key: 'preview',
  //   //   label: '播放预览',
  //   //   icon: () => h(Icon, { icon: 'mdi:play' }),
  //   //   props: {
  //   //     onClick: () => {
  //   //       message.warning('注意：预览模式与作品成品的播放效果不完全一致')
  //   //       // player = bridge.editor?.get(Player)
  //   //       const fragments = projectStore.fragment(projectId).getBySort()
  //   //       applyPlay(fragments, true)
  //   //     }
  //   //   }
  //   // },
  //   // {
  //   //   key: 'refresh',
  //   //   label: '更新标记',
  //   //   icon: () => h(Icon, { icon: 'mdi:refresh' }),
  //   //   props: {
  //   //     onClick: () => {
  //   //       checkPromoter()
  //   //     }
  //   //   }
  //   // },
  //   // {
  //   //   key: 'reorder',
  //   //   label: '标记重排序',
  //   //   icon: () => h(Icon, { icon: 'mdi:sort' }),
  //   //   props: {
  //   //     onClick: () => {
  //   //       handleReorder()
  //   //     }
  //   //   }
  //   // },
  //   // {
  //   //   key: 'bgm',
  //   //   disabled: true,
  //   //   label: '背景音乐',
  //   //   icon: () => h(Icon, { icon: 'mdi:music-note-outline' }),
  //   //   props: {
  //   //     onClick: () => {
  //   //       //
  //   //     }
  //   //   }
  //   // },
  //   // {
  //   //   key: 'showname',
  //   //   label: () => `${isShowName.value ? '隐藏' : '显示'}名称`,
  //   //   icon: () => h(Icon, { icon: 'mdi:account-group-outline' }),
  //   //   props: {
  //   //     onClick: () => {
  //   //       isShowName.value = !isShowName.value
  //   //     }
  //   //   }
  //   // },
  //   // {
  //   //   key: 'showorder',
  //   //   label: () => `${ isShowOrder.value ? '隐藏' : '显示' }排序`,
  //   //   icon: () => h(Icon, { icon: 'mdi:sort' }),
  //   //   props: {
  //   //     onClick: () => {
  //   //       isShowOrder.value = !isShowOrder.value
  //   //       dropdownState.isShow = false
  //   //     }
  //   //   }
  //   // },
  //   // {
  //   //   key: 'language',
  //   //   disabled: true,
  //   //   label: '语言',
  //   //   icon: () => h(Icon, { icon: 'mdi:translate' }),
  //   //   props: {
  //   //     onClick: () => {
  //   //       //
  //   //     }
  //   //   }
  //   // },
  //   // {
  //   //   key: 'settings',
  //   //   disabled: true,
  //   //   label: '设置',
  //   //   icon: () => h(Icon, { icon: 'mdi:cog' }),
  //   //   props: {
  //   //     onClick: () => {
  //   //       //
  //   //     }
  //   //   }
  //   // }
  // ]

  /** 播放音频 */
  let aud: HTMLAudioElement | null = null 
  function handlePlay(fragment: Fragment) {
    if (!aud) {
      try {
        aud = new Audio(fragment.audio)
        aud.play()
        aud.addEventListener('ended', () => {
          aud = null
        })
      } catch (error) {
        message.error('音频播放失败,请检查音频路径')
      }
      return
    }
    if (aud.played) {
      aud.pause()
      aud.src = ''
      aud = null
    }
  }
  /** 编辑文字 */
  function handleEdit(fragment: Fragment) {
    dialog.create({
      showIcon: false,
      style: { width: '800px' },
      title: '片段编辑器',
      maskClosable: false,
      onMaskClick: (ev) => {
        ev.preventDefault()
        // dialog.destroyAll()
      },
      content: () =>
        h(FragmentEditor, {
          fragment: fragment,
          onConfirm: (newTranscript: string[]) => {
            if (_.isEqual(fragment.transcript, newTranscript)) {
              message.warning('未进行任何更改')
              dialog.destroyAll()
              return
            }
            projectStore
              .fragment(projectId)
              .updateTranscript({ fragmentId: fragment.id, newTranscript })
              .then(() => {
                message.success('更新成功')
                fragment.transcript = newTranscript
              })
            dialog.destroyAll()
          },
          onCancel: () => {
            dialog.destroyAll()
          }
        })
    })
  }
  /** 移除片段 */
  function handleRemove(fragment: Fragment) {
    applyRemove(fragment.id).then(() => checkAnimeState()) // 移除片段之后，进行动画状态校验
  }
  /** 移动片段 */
  function handleMove(event: SortableEvent) {
    // console.log(event)
    const oldIndex = event.oldIndex
    const newIndex = event.newIndex
    const fragmentId = event.item.id
    if(oldIndex === undefined || newIndex === undefined || fragmentId === undefined) return
    // const { element, oldIndex, newIndex } = args.moved
    // console.log([fragmentId, oldIndex, newIndex])
    projectStore.fragment(projectId).updateSequence({
      fragmentId: fragmentId,
      oldIndex,
      newIndex
    })
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
        audio: f.audio,
        duration: f.duration,
        promoters: f.promoters,
        timestamps: f.timestamps
      })
    })
    // 2.加载数据
    return new Promise((resolve, reject) => {
      player!.loadData(data).then((parsedata) => {
        if (isHidden) {
          parsedata.forEach(item => {
            item.animeElementSequence.forEach(elements => {
              elements.forEach(element => {
                element.style.opacity = '0'
              })
            })
          })
        }
        // 3.加载完成后启动播放
        player!.start()
        playerState.isPlaying = true
        onPlayerStateUpdate.next(true)
        const timer = setInterval(() => {
          playerState.currentTime = player!.totalTime
        }, 300)
        subs.push(
          player!.onPlayOver.subscribe(() => {
            // console.log(parsedata)
            playerState.isPlaying = false
            onPlayerStateUpdate.next(false)
            playerState.currentTime = 0
            clearInterval(timer)
            if (isHidden) {
              parsedata.forEach(item => {
                item.animeElementSequence.forEach(elements => {
                  elements.forEach(element => {
                    element.style.opacity = '1'
                  })
                })
              })
            }
            resolve('')
            subs.forEach(sub => sub.unsubscribe())
          })
        )
      }).catch(err => {
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
    // studioOptions,
    // isShowName,
    onPlayerStateUpdate,
    isShowOrder,
    // isShowSpeechModeToolbar,
    handlePreview,
    handleContextmenu,
    handleExpand,
    handleSelect,
    handlePlay,
    handleEdit,
    handleRemove,
    handleMove
  }
}
