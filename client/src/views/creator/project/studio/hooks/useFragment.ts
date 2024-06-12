import useStore from '@/store'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { h, onUnmounted, reactive, ref } from 'vue'
import { Bridge } from '../../bridge'
import _ from 'lodash'
import { useDialog, useMessage } from 'naive-ui'
import { TxtEdit } from '../private'
import { usePromoter } from './usePromoter'
import { Player } from '@/editor'
import { Subscription } from '@tanbo/stream'
import { SortableEvent } from 'vue-draggable-plus'
type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]
export function useFragment(projectId: string, bridge: Bridge) {
  const { projectStore, clipboardStore } = useStore()
  const isShowName = ref(false)
  const dialog = useDialog()
  const message = useMessage()
  let player: Player | undefined = undefined
  const subs: Subscription[] = []
  const { checkAnimeState, handleReorder } = usePromoter(projectId, bridge)
  const selectedFragments = ref<Fragment[]>([])
  const dropdownState = reactive({
    x: 0,
    y: 0,
    options: [] as DropdownMixedOption[],
    isShow: false
  })
  const playerState = reactive({
    isPlaying: false,
    currentTime: 0,
  })

  onUnmounted(() => {
    player?.destory()
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
        key: 'preview',
        label: '播放预览',
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
        key: 'remove',
        label: '移除',
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
      {
        key: 'copy',
        label: '复制',
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
    ]
  }

  const studioOptions: DropdownMixedOption[] = [
    {
      key: 'preview',
      label: '播放预览',
      props: {
        onClick: () => {
          message.warning('注意：预览模式与作品成品的播放效果不完全一致')
          player = bridge.editor?.get(Player)
          const fragments = projectStore.fragment(projectId).getBySort()
          applyPlay(fragments, true)
        }
      }
    },
    {
      key: 'reorder',
      label: '标记重排序',
      props: {
        onClick: () => {
          handleReorder()
        }
      }
    },
    {
      key: 'bgm',
      disabled: true,
      label: '背景音乐',
      props: {
        onClick: () => {
          //
        }
      }
    },
    {
      key: 'showname',
      label: () => `${isShowName.value ? '隐藏' : '显示'}名称`,
      props: {
        onClick: () => {
          isShowName.value = !isShowName.value
        }
      }
    },
    {
      key: 'language',
      disabled: true,
      label: '语言',
      props: {
        onClick: () => {
          //
        }
      }
    },
    {
      key: 'settings',
      disabled: true,
      label: '设置',
      props: {
        onClick: () => {
          //
        }
      }
    }
  ]

  /** 播放音频 */
  let aud: HTMLAudioElement | null = null 
  function handlePlay(fragment: Fragment) {
    if (!aud) {
      aud = new Audio(fragment.audio)
      aud.play()
      aud.addEventListener('ended', () => {
        aud = null
      })
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
      title: '转写文字更改',
      content: () =>
        h(TxtEdit, {
          transcript: fragment.transcript,
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
    console.log(event)
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
        const timer = setInterval(() => {
          playerState.currentTime = player!.totalTime
        }, 300)
        subs.push(
          player!.onPlayOver.subscribe(() => {
            playerState.isPlaying = false
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
    player?.destory()
    subs.forEach(s => s.unsubscribe())
  })

  return {
    selectedFragments,
    dropdownState,
    playerState,
    studioOptions,
    isShowName,
    handleContextmenu,
    handleExpand,
    handleSelect,
    handlePlay,
    handleEdit,
    handleRemove,
    handleMove
  }
}
