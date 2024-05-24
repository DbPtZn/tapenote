import { creator, CreatorApi } from '@/api'
import { defineStore } from 'pinia'
import _ from 'lodash'
import utils from '@/utils'
import router from '@/router'
import { LibraryEnum } from '@/enums'
import useStore from '..'
interface FragmentSpeaker {
  type: 'human' | 'machine'
  avatar: string
  name: string
  role: number
}

interface Fragment {
  key?: string
  id: string
  audio: string
  duration: number
  // 文本
  txt: string
  // 转录文字
  transcript: Array<string>
  // 标记数字
  tags: Array<string | null>
  // 动画编号
  promoters: Array<string | null>
  timestamps: Array<number>
  // 排序号
  // sortNum: number
  projectId: string
  // role: number
  speaker: FragmentSpeaker
  removed: 'never' | 'active' | 'passive'
}

interface Detial {
  penname: string; email: string; homepage: string, wordage: number; filesize: number
}

export interface Project {
  account: string
  hostname: string

  id: string
  lib: LibraryEnum
  dirname: string
  folderId: string
  title: string
  content: string
  abbrev: string

  fragments: Fragment[]
  sequence: Array<string>
  removedSequence: Array<string>
  speakerRecorder: string[]
  speakerHistory: { human: string; machine: string }

  audio: string
  duration: number
  promoterSequence: Array<string>
  keyframeSequence: Array<number>
  subtitleSequence: Array<string>
  subtitleKeyframeSequence: Array<number>
  sidenote: string
  annotations: Array<any>

  detial: Detial
  createAt: string
  updateAt: string
}

interface State {
  data: Project[]
}

const userInfoMap = new Map()

export const useProjectStore = defineStore('projectStore', {
  state(): State {
    return {
      data: []
    }
  },
  actions: {
    creatorApi(account: string, hostname: string) {
      return creator.getCreatorApi(account, hostname)!
    },
    create(folderId: string, lib: LibraryEnum, account: string, hostname: string) {
      const { userStore } = useStore()
      const author = { penname: userStore.nickname, email: userStore.email, homepage: userStore.homepage }
      // console.log(author)
      return this.creatorApi(account, hostname).project.create<Project>({ folderId, lib, ...author }).then(res => {
        // 这里不能设置state，否则在创建后自动切换页面时不会更新state，因为它已经存在
        res.data.account = account
        res.data.hostname = hostname
        res.data.audio = res.data.audio ? hostname + res.data.audio : ''
        res.data.fragments?.forEach(fragment => {
          fragment.audio = hostname + fragment.audio
        })
        return res.data
      })
    },
    createBy(args : {folderId: string, sourceId: string, lib: LibraryEnum, account: string, hostname: string}) {
      const { folderId, sourceId, lib, account, hostname } = args
      const { userStore } = useStore()
      const author = { penname: userStore.nickname, email: userStore.email, homepage: userStore.homepage }
      return new Promise<Project>((resolve, reject) => {
        if (lib === LibraryEnum.NOTE) {
          const noteId = sourceId
          return this.creatorApi(account, hostname).project.create<Project>({ folderId, noteId, lib: LibraryEnum.PROCEDURE, ...author }).then(res => {
            res.data.account = account
            res.data.hostname = hostname
            res.data.audio = res.data.audio ? hostname + res.data.audio : ''
            res.data.fragments?.forEach(fragment => {
              fragment.audio = hostname + fragment.audio
            })
            resolve(res.data)
          }).catch(err => reject(err))
        }
        if (lib === LibraryEnum.PROCEDURE) {
          const procedureId = sourceId
          return this.creatorApi(account, hostname).project.create<Project>({ folderId, procedureId, lib: LibraryEnum.COURSE, ...author }).then(res => {
            res.data.account = account
            res.data.hostname = hostname
            res.data.audio = res.data.audio ? hostname + res.data.audio : ''
            res.data.fragments?.forEach(fragment => {
              fragment.audio = hostname + fragment.audio
            })
            resolve(res.data)
          }).catch(err => reject(err))
        }
      })

    },
    fetchAndSet(id: string, account: string, hostname: string) {
      // console.log('fetchAndSet')
      // console.log([id, account, hostname])
      return new Promise<Project>((resolve, reject) => {
        // console.log('fetchAndset')
        const index = this.data.findIndex(i => i.id === id)
        if (index !== -1) {
          console.log(this.data[index])
          resolve(this.data[index])
        } else {
          this.creatorApi(account, hostname).project.get(id)
            .then(res => {
              console.log(res.data)
              const newItem = this.set(res.data, account, hostname)
              resolve(newItem)
            })
            .catch(err => {
              reject(err)
            })
        }
      })
    },
    set(data: any, account: string, hostname: string) {
      const item: Project = {
        account: account || '',
        hostname: hostname || '',
        id: data.id || '',
        lib: data.lib || '',
        dirname: data.dirname || '',
        folderId: data.folderId || '',
        title: data.title || '',
        content: data.content || '',
        abbrev: data.abbrev || '',
        fragments: data.fragments?.map(fragment => {
          fragment.audio = hostname + fragment.audio
          fragment.speaker = this.fragmentSpeakerFilter(fragment.speaker, account, hostname)
          return fragment
        }) || [],
        sequence: data.sequence || [],
        removedSequence: data.removedSequence || [],
        speakerRecorder: data.speakerRecorder || [],
        speakerHistory: data.speakerHistory || { human: '', machine: '' },
        audio: data.audio ? hostname + data.audio : '',
        duration: data.duration || 0,
        promoterSequence: data.promoterSequence || [],
        keyframeSequence: data.keyframeSequence || [],
        subtitleSequence: data.subtitleSequence || [],
        subtitleKeyframeSequence: data.subtitleKeyframeSequence || [],
        sidenote: data.sidenote || '',
        annotations: data.annotations || [],
        detial: data.detial || { penname: '', email: '', homepage: '', wordage: 0, filesize: 0 },
        createAt: data.createAt || '',
        updateAt: data.updateAt || ''
      }
      console.log(item)
      this.data.push(item)
      return item
    },
    fragmentSpeakerFilter(speaker: FragmentSpeaker, account: string, hostname: string) {
      switch(speaker.type) {
        case 'human':
          if (speaker.role === 10000) {
            const namekey = `${account}&${hostname}:name`
            const avatarkey = `${account}&${hostname}:avatar`
            if (userInfoMap.has(namekey) && userInfoMap.has(avatarkey)) {
              speaker.name = userInfoMap.get(namekey)
              speaker.avatar = userInfoMap.get(avatarkey)
            } else {
              const { userListStore } = useStore()
              const user = userListStore.get(account, hostname)
              userInfoMap.set(`${account}&${hostname}:name`, user.nickname)
              userInfoMap.set(`${account}&${hostname}:avatar`, user.avatar)
              speaker.name = user.nickname
              speaker.avatar = user.avatar
            }
          } else {
            speaker.avatar = hostname + speaker.avatar
          }
          break
        case 'machine':
          if (speaker.role === 0) {
            speaker.name = '默认'
            speaker.avatar = './robot.png'
          } else {
            speaker.avatar = hostname + speaker.avatar
          }
          break
      }
      return speaker
    },
    get(id: string) {
      const index = this.data.findIndex(i => i.id === id)
      if (index !== -1) return this.data[index]
      return undefined
    },
    remove(id: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).project.remove(id).then(() => {
        this.cleanCache(id, account, hostname)
      })
    },
    restore(id: string, folderId: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).project.restore<{ updateAt: string }>(id, folderId)
    },
    delete(id: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).project.delete(id)
    },
    move(id: string, folderId: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).project.move(id, folderId).then(() => {
        // TODO 不一定要删除缓存，也可以更新，再考虑考虑
        this.cleanCache(id, account, hostname)
      })
    },
    copy(id: string, folderId: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).project.copy(id, folderId)
    },
    /** 更新标题 */
    updateTitle(params: Parameters<typeof CreatorApi.prototype.project.updateTitle>[0], savingcb: () => void, account: string, hostname: string) {
      return new Promise((resolve, reject) => {
        const index = this.data.findIndex(i => i.id === params.id)
        const account = this.data[index].account
        const hostname = this.data[index].hostname
        if (utils.isDiff(this.data[index].title, params.title)) {
          savingcb && savingcb()
          this.creatorApi(account, hostname).project
            .updateTitle<{ updateAt: string }>(params)
            .then(res => {
              if (this.data[index].id === params.id) {
                this.data[index].updateAt = res.data.updateAt
                this.data[index].title = params.title
              }
              resolve(true)
            })
            .catch(err => {
              resolve(false)
            })
        } else {
          resolve(true)
        }
      })
    },
    /** 更新内容 */
    updateContent(params: Parameters<typeof CreatorApi.prototype.project.updateContent>[0], savingcb: () => void, account: string, hostname: string) {
      return new Promise((resolve, reject) => {
        const index = this.data.findIndex(i => i.id === params.id)
        const account = this.data[index].account
        const hostname = this.data[index].hostname
        if (utils.isDiff(this.data[index].content, params.content)) {
          savingcb && savingcb()
          this.creatorApi(account, hostname).project
            .updateContent<{ updateAt: string, abbrev: string, wordage: number }>(params)
            .then(res => {
              // 有可能在异步代码执行前切换了项目，所以需要确保 id 一致才对 store 更新数据
              if (this.data[index].id === params.id) {
                this.data[index].content = params.content
                this.data[index].updateAt = res.data.updateAt
                this.data[index].detial.wordage = res.data.wordage
                this.data[index].abbrev = res.data.abbrev
              }
              resolve(true)
            })
            .catch(err => {
              resolve(false)
            })
        } else {
          resolve(true)
        }
      })
    },
    updateSidenoteContent(params: Parameters<typeof CreatorApi.prototype.project.updateSidenoteContent>[0], savingcb: () => void, account: string, hostname: string) {
      return new Promise((resolve, reject) => {
        const index = this.data.findIndex(i => i.id === params.id)
        const account = this.data[index].account
        const hostname = this.data[index].hostname
        if (utils.isDiff(this.data[index].content, params.content)) {
          savingcb && savingcb()
          this.creatorApi(account, hostname).project
            .updateSidenoteContent<{ updateAt: string }>(params)
            .then(res => {
              // 有可能在异步代码执行前切换了项目，所以需要确保 id 一致才进行 store 数据更新
              if (this.data[index].id === params.id) {
                this.data[index].updateAt = res.data.updateAt
                this.data[index].sidenote = params.content
              }
              resolve(true)
            })
            .catch(err => {
              resolve(false)
            })
        } else {
          resolve(true)
        }
      })
    },
    updateSpeakerHistory(params: Parameters<typeof CreatorApi.prototype.project.updateSpeakerHistory>[0], account: string, hostname: string) {
      const { id, speakerId, type } = params
      // console.log(params)
      this.data.some(i => {
        if (i.id === id) {
          if (type === 'human') {
            i.speakerHistory.human = speakerId
          }
          if (type === 'machine') {
            i.speakerHistory.machine = speakerId
          }
          return true
        }
      })
      return this.creatorApi(account, hostname).project.updateSpeakerHistory<{ updateAt: string }>(params).then(res => {
        this.setUpdateAt(id, res.data.updateAt)
      })
    },
    /** 清理缓存 */
    cleanCache(id: string, account: string, hostname: string) {
      const index = this.data.findIndex(i => i.id === id && i.account === account && i.hostname === hostname)
      if (index !== -1) {
        this.data.splice(index, 1)
      }
    },
    cleanCacheByFolderId(folderId: string) {
      for(let i = 0; i < this.data.length; i++) {
        const data = this.data[i]
        if (data.folderId === folderId) {
          this.data.splice(i, 1)
          i -- // 移除后数组已发生改变，回退一位
        }
      }
    },
    cleanCacheByUser(account: string, hostname: string) {
      for(let i = 0; i < this.data.length; i++) {
        const data = this.data[i]
        if (data.account === account && data.hostname === hostname) {
          this.data.splice(i, 1)
          i -- // 移除后数组已发生改变，回退一位
        }
      }
    },

    setUpdateAt(procedureId: string | undefined, updateAt: string) {
      const { folderStore } = useStore()
      if (!procedureId) return
      const index = this.data.findIndex(i => i.id === procedureId)
      if (index !== -1) {
        this.data[index].updateAt = updateAt
      }
      /** 更新卡片的时间 */
      if (this.data[index].folderId === folderStore.id) {
        folderStore.subfiles?.some((item, index, arr) => {
          if (item.id === procedureId) {
            arr[index].updateAt = updateAt
            return true
          }
          return false
        })
      }
    },
    pasteFragment(params: Parameters<typeof CreatorApi.prototype.fragment.copyFragment>[0], account: string, hostname: string) {
      console.log(params)
      return this.creatorApi(account, hostname).fragment.copyFragment<{ fragment: Fragment, updateAt: string }>(params).then(res => {
        const { fragment, updateAt } = res.data
        fragment.audio = hostname + fragment.audio
        fragment.speaker.avatar = hostname + fragment.speaker.avatar
        const { sourceFragmentId, targetFragmentId, sourceProjectId, targetProjectId, type, position } = params
        const source = this.get(sourceProjectId)!
        const target = this.get(targetProjectId)!

        // 剪切的情况
        if (type === 'cut') {
          if (sourceProjectId !== targetProjectId) {
            source.fragments.splice(
              source.fragments.findIndex(i => i.id === sourceFragmentId),
              1
            )
            source.sequence.splice(
              source.sequence.findIndex(id => id === sourceFragmentId),
              1
            )
          } else {
            // 这个情况 target 和 source 是同一个项目
            target.fragments.splice(
              target.fragments.findIndex(i => i.id === sourceFragmentId),
              1
            )
            target.sequence.splice(
              target.sequence.findIndex(id => id === sourceFragmentId),
              1
            )
          }
        }

        // 查找目标片段位置
        const index = target.sequence.findIndex(id => id === targetFragmentId)
        if (index === -1 && (targetFragmentId !== '' && position === 'insert')) return console.error('目标片段不存在')
        if (position === 'before') {
          // 在目标片段之前插入
          target.sequence.splice(index, 0, fragment.id)
        }
        if (position === 'after') {
          // 在目标片段之后插入
          target.sequence.splice(index + 1, 0, fragment.id)
        }
        if (position === 'insert') {
          target.sequence.push(fragment.id)
        }
        target.fragments.push(fragment)
        

        if (sourceProjectId === targetProjectId) {
          // 源项目与目标项目相同，只需要更新目标项目
          this.setUpdateAt(targetProjectId, updateAt)
        }
        if (sourceProjectId !== targetProjectId) {
          // 源项目与目标项目不相同，需要同时保存更新源项目与目标项目
          this.setUpdateAt(targetProjectId, updateAt)
          this.setUpdateAt(sourceProjectId, updateAt)
        }

      })
    },
    // 批量导出
    // 批量导入

    /** ------------------------------- fragment ------------------------------------------- */
    fragment(procedureId: string) {
      const sequence = this.get(procedureId)?.sequence
      const removedSequence = this.get(procedureId)?.removedSequence
      const account = this.get(procedureId)?.account
      const hostname = this.get(procedureId)?.hostname
      /** 获取片段 */
      const get = () => {
        return this.data.find(i => i.id === procedureId && i.account === account && i.hostname === hostname)?.fragments || []
      }
      /** 获取正常片段（排序） */
      const getBySort = () => {
        return (
          this.data
            .find(i => i.id === procedureId && i.account === account && i.hostname === hostname)
            ?.fragments.filter(i => i.removed === 'never')
            .sort((a, b) => {
              return sequence!.indexOf(a.id) - sequence!.indexOf(b.id)
            }) || []
        )
      }
      /** 获取被移除片段（排序） */
      const getRemovedBySort = () => {
        return (
          this.data
            .find(i => i.id === procedureId && i.account === account && i.hostname === hostname)
            ?.fragments.filter(i => i.removed !== 'never')
            .sort((a, b) => {
              return removedSequence!.indexOf(a.id) - removedSequence!.indexOf(b.id)
            }) || []
        )
      }
      /** 设置片段数据到缓存中 */
      const set = (data: Fragment[]) => {
        get()?.splice(0, get()?.length) // 清空数组
        get()?.push(...data) // 赋值
      }
      /** 通过文本创建片段 */
      const createByText = (params: Parameters<typeof CreatorApi.prototype.fragment.createByText>[0]) => {
        const { speakerStore } = useStore()
        const speaker = speakerStore.get(params.speakerId, account!, hostname!, 'machine')!
        const key = utils.randomString()
        const txt = params.txt.replace(/\s*/g, '')
        params.procedureId = procedureId
        params.key = key
        // 立即创建临时文本片段并插入到片段序列中
        const fragment: Fragment = {
          key,
          id: key,
          audio: '',
          duration: 0,
          txt: txt,
          transcript: Array.from(txt),
          tags: new Array(txt.length),
          promoters: new Array(txt.length),
          timestamps: [],
          projectId: procedureId,
          // role: params.role,
          speaker: {
            type: 'machine',
            name: speaker.name,
            avatar: speaker.avatar,
            role: speaker.role
          },
          removed: 'never'
        }
        get()?.push(fragment) // 不完全片段
        sequence?.push(key) // 用 key 占位
        return this.creatorApi(account!, hostname!).fragment.createByText<Fragment>(params).then(res => {
          const data = res.data
          data.audio = hostname + data.audio
          if (params.speakerId !== '')  data.speaker.avatar = hostname + data.speaker.avatar
          else data.speaker = fragment.speaker
          if(data.key) {
            // 用片段 id 替换排序信息中的占位 key
            sequence?.some((item, index, arr) => {
              if(item === data.key) {
                arr[index] = data.id
                return true
              }
            })
            // 替换成完整片段
            get()?.some((item, index, arr) => {
              if(item.key === data.key) {
                arr[index] = data
                delete arr[index].key // 会影响到 data, 所以放序列处理后面
                return true
              }
            })
            // 完成替换期间应禁止的操作：（如果用户完成替换期间跳出不会影响后端数据）
            // 1. 片段移动（当前的 sequence 是临时的 key 值占位）
            // 2. 片段移除（当前没有正确 id，无法完成移除操作）
            // 3. 片段更新（当前没有正确 id，无法完成更新操作, 包括启动子的添加移除等操作均无法完成）
          } else {
            console.error('异常，未读取到合成片段返回的 key 值')
          }
        }).catch(err => {
          // 片段创建失败的时候，应移除前端的临时片段
          get()?.some((item, index, arr) => {
            if(item.key === key) {
              arr.splice(index, 1)
              return true
            }
          })
          sequence?.some((item, index, arr) => {
            if(item === key) {
              arr.splice(index, 1)
              return true
            }
          })
          console.error(err)
          throw err
        })
      }
      /** 通过音频创建片段 */
      const createByAudio = (params: Parameters<typeof CreatorApi.prototype.fragment.createByAudio>[0]) => {
        const { speakerStore } = useStore()
        const speaker = speakerStore.get(params.speakerId, account!, hostname!, 'human')!
        
        const key = utils.randomString()
        params.procedureId = procedureId
        params.key = key
        // 立即创建临时文本片段并插入到片段序列中
        const fragment: Fragment = {
          key,
          id: key,
          audio: '',
          duration: 0,
          txt: '',
          transcript: ['识','别','中','...'],
          tags: [],
          promoters: [],
          timestamps: [],
          projectId: procedureId,
          speaker: {
            type: 'human',
            name: speaker.name,
            avatar: speaker.avatar,
            role: speaker.role
          },
          removed: 'never'
        }
        get()?.push(fragment) // 不完全片段
        sequence?.push(key) // 用 key 占位
        return this.creatorApi(account!, hostname!).fragment.createByAudio<Fragment>(params).then(res => {
          const data = res.data
          data.audio = hostname + data.audio
          if (params.speakerId !== '')  data.speaker.avatar = hostname + data.speaker.avatar
          else data.speaker = fragment.speaker
          if(data.key) {
            // 用片段 id 替换排序信息中的占位 key
            sequence?.some((item, index, arr) => {
              if(item === data.key) {
                arr[index] = data.id
                return true
              }
            })
            // 替换成完整片段
            get()?.some((item, index, arr) => {
              if(item.key === data.key) {
                arr[index] = data
                delete arr[index].key // 会影响到 data, 所以放序列处理后面
                return true
              }
            })
          } else {
            console.error('异常，未读取到合成片段返回的 key 值')
          }
        }).catch(err => {
          // 片段创建失败的时候，应移除前端的临时片段
          get()?.some((item, index, arr) => {
            if(item.key === key) {
              arr.splice(index, 1)
              return true
            }
          })
          sequence?.some((item, index, arr) => {
            if(item === key) {
              arr.splice(index, 1)
              return true
            }
          })
          console.error(err)
        })
      }
      /** 创建空白片段 */
      const createBlank = (params: Parameters<typeof CreatorApi.prototype.fragment.createBlank>[0]) => {
        params.procedureId = procedureId
        return this.creatorApi(account!, hostname!).fragment.createBlank<Fragment>(params).then(res => {
          const data = res.data
          data.audio = hostname + data.audio
          get()?.push(data)
          sequence?.push(data.id)
        })
      }
      /** 更新转写文字 */
      const updateTranscript = (params: Parameters<typeof CreatorApi.prototype.fragment.updateTranscript>[0]) => {
        params.procedureId = procedureId
        return this.creatorApi(account!, hostname!).fragment.updateTranscript<{ updateAt: string }>(params).then(res => {
          this.setUpdateAt(params.procedureId, res.data.updateAt) // 更新时间
        })
      }
      /** 移除片段 */
      const remove = (params: Parameters<typeof CreatorApi.prototype.fragment.remove>[0]) => {
        params.procedureId = procedureId
        return this.creatorApi(account!, hostname!).fragment.remove<{ updateAt: string }>(params).then(res => {
          get()?.some((item) => {
            if (item.id === params.fragmentId) {
              item.removed = 'active'
              item.tags.fill(null)
              item.promoters.fill(null)
              return true
            }
          })
          sequence?.some((item, index, arr) => {
            if (item === params.fragmentId) {
              arr.splice(index, 1)
              return true
            }
          })
          removedSequence?.push(params.fragmentId)
          this.setUpdateAt(params.procedureId, res.data.updateAt) // 更新时间
        })
      }
      /** 恢复片段 */
      const restore = (params: Parameters<typeof CreatorApi.prototype.fragment.restore>[0]) => {
        params.procedureId = procedureId
        return this.creatorApi(account!, hostname!).fragment.restore<{ updateAt: string }>(params).then(res => {
          get()?.some((item) => {
            if (item.id === params.fragmentId) {
              item.removed = 'never'
              return true
            }
          })
          sequence?.push(params.fragmentId)
          removedSequence?.some((item, index, arr) => {
            if (item === params.fragmentId) {
              arr.splice(index, 1)
              return true
            }
          })
          this.setUpdateAt(params.procedureId, res.data.updateAt) // 更新时间
        })
      }
      /** 彻底删除 */
      const dele = (params: Parameters<typeof CreatorApi.prototype.fragment.delete>[0]) => {
        params.procedureId = procedureId
        return this.creatorApi(account!, hostname!).fragment.delete<{ updateAt: string }>(params).then(res => {
          get()?.some((item, index, arr) => {
            if (item.id === params.fragmentId) {
              arr.splice(index, 1)
              return true
            }
          })
          removedSequence?.some((item, index, arr) => {
            if (item === params.fragmentId) {
              arr.splice(index, 1)
              return true
            }
          })
          this.setUpdateAt(procedureId, res.data.updateAt) // 更新时间
        })
      }
      /** 更新 */
      const updateFragmentsTags = () => {
        const data: Parameters<typeof CreatorApi.prototype.fragment.updateFragmentsTags>[0] = getBySort()?.map(i => {
          return {
            fragmentId: i.id,
            tags: i.tags
          }
        })
        return this.creatorApi(account!, hostname!).fragment.updateFragmentsTags<{ updateAt: string }>(data, procedureId).then(res => {
          this.setUpdateAt(procedureId, res.data.updateAt) // 更新时间
        })
      }
      const updateSequence = (params: Parameters<typeof CreatorApi.prototype.fragment.updateSequence>[0]) => {
        params.procedureId = procedureId
        return this.creatorApi(account!, hostname!).fragment.updateSequence<{ updateAt: string }>(params).then(res => {
          this.get(procedureId)?.sequence.splice(params.oldIndex, 1)
          this.get(procedureId)?.sequence.splice(params.newIndex, 0, params.fragmentId)
          this.setUpdateAt(params.procedureId, res.data.updateAt) // 更新时间
        })
      }
      const addPromoter = (params: Parameters<typeof CreatorApi.prototype.fragment.addPromoter>[0], cb?: (aniId: string) => void) => {
        getBySort()?.some((item, index, arr) => {
          if (item.id === params.fragmentId) {
            arr[index].tags[params.promoterIndex] = params.promoterSerial
            arr[index].promoters[params.promoterIndex] = params.promoterId
            // 更新至数据库
            params.procedureId = procedureId
            this.creatorApi(account!, hostname!).fragment.addPromoter<{ updateAt: string }>(params).then(res => {
              this.setUpdateAt(params.procedureId, res.data.updateAt) // 更新时间
              cb && cb(params.promoterId) // 设置动画状态的回调（确认成功后才会设置动画状态）
            })
            return true
          }
        })
      }
      const removePromoter = (params: Parameters<typeof CreatorApi.prototype.fragment.removePromoter>[0], cb?: (aniId: string) => void) => {
        getBySort()?.some((item, index, arr) => {
          if (item.id === params.fragmentId) {
            const aniId = arr[index].promoters[params.promoterIndex]
            arr[index].tags[params.promoterIndex] = null
            arr[index].promoters[params.promoterIndex] = null
            // 更新至数据库
            params.procedureId = procedureId
            return this.creatorApi(account!, hostname!).fragment.removePromoter<{ updateAt: string }>(params).then(res => {
              this.setUpdateAt(params.procedureId, res.data.updateAt) // 更新时间
              cb && aniId && cb(aniId)
            })
          }
        })
      } 
      return {
        set,
        get,
        getBySort,
        getRemovedBySort,
        createByText,
        createByAudio,
        createBlank,
        updateTranscript,
        remove,
        restore,
        dele,
        updateFragmentsTags,
        addPromoter,
        removePromoter,
        updateSequence
      }
    }
  },
  getters: {}
})

