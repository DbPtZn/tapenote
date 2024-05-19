import { creator, CreatorApi } from '@/api'
import { defineStore } from 'pinia'
import useStore from '..'

/**
 * human ：由真人真声录制，可以选择变声器改变音色
 * machine ：由服务商提供的语音合成的音色
 */
interface Speaker {
  account: string
  hostname: string
  id: string
  // model: string // 语音模型
  type: 'human' | 'machine' // 角色类型
  avatar: string // 头像地址
  audio: string // 快速测试音频地址 仅在 type 为 mechanic 时生效
  name: string // 角色名称
  role: number // 角色值 0~9999 为 AI 语音预留 10000~99999 为用户角色预留
  changer: number // 变声器 仅在 type 为 human 时生效
  // createAt: Date // 创建时间
  // updateAt: Date // 更新时间
}
interface State {
  data: Speaker[]
}

export const useSpeakerStore = defineStore('speakerStore', {
  state(): State {
    return {
      data: []
    }
  },
  actions: {
    creatorApi(account: string, hostname: string) {
      return creator.getCreatorApi(account, hostname)!
    },
    fetchAndSet(account: string, hostname: string) {
      return this.fetch<Speaker[]>(account, hostname).then(res => {
        return this.set(res.data, account, hostname)
      })
    },
    fetch<T>(account: string, hostname: string) {
      return this.creatorApi(account, hostname).speaker.getAll<T>()
    },
    set(data: Speaker[], account: string, hostname: string) {
      // const { userListStore } = useStore()
      // const user = userListStore.get(account, hostname)
      const state = data.map(speaker => {
        speaker.account = account
        speaker.hostname = hostname
        speaker.avatar = hostname + speaker.avatar
        return speaker
      })
      this.data = state
      return state
    },
    get(id: string, account: string, hostname: string, type?: 'human' | 'machine') {
      if(id !== '') {
        const index = this.data.findIndex(i => i.id === id && i.account === account && i.hostname === hostname)
        if (index !== -1) {
          return this.data.find(i => i.id === id && i.account === account && i.hostname === hostname)
        }
      }
      let defaultSpeaker: Speaker
      if (type === 'human') {
        const { userListStore } = useStore()
        const user = userListStore.get(account, hostname)
        defaultSpeaker =  {
          account: account,
          hostname: hostname,
          id: '',
          type: 'human',
          avatar: user.avatar,
          audio: '',
          name: user.nickname,
          role: 10000,
          changer: 0
        }
      } else {
        defaultSpeaker =  {
          account: account,
          hostname: hostname,
          id: '',
          type: 'machine',
          avatar: 'robot.png',
          audio: '',
          name: '默认',
          role: 0,
          changer: 0
        }
      }
      return defaultSpeaker
    },
    // selected(key: number, type: 'role' | 'robot', account: string, hostname: string) {
    //   if (type === 'role') {
    //     this.get(account, hostname)!.role = key
    //   }
    //   if (type === 'robot') {
    //     this.get(account, hostname)!.robot = key
    //   }
    // },
    /** 添加新角色 */
    // addRole<T>(params: Parameters<typeof CreatorApi.prototype.speaker.addRole>[0], account: string, hostname: string) {
    //   return this.creatorApi(account, hostname).speaker.addRole<T>(params).then(() => {
    //     this.get(account, hostname)!.roleList.set(params.role, {
    //       name: params.name,
    //       avatar: params.avatar,
    //       changer: params.changer || 0
    //     })
    //   })
    // },
    /** 添加新合成语音 */
    // addRobot<T>(params: Parameters<typeof CreatorApi.prototype.speaker.addRobot>[0], account: string, hostname: string) {
    //   return this.creatorApi(account, hostname).speaker.addRobot<T>(params).then(() => {
    //     this.get(account, hostname)!.robotList.set(params.role, {
    //       name: params.name,
    //       avatar: params.avatar
    //     })
    //   })
    // },
    // remove(role: number, type: 'role' | 'robot', account: string, hostname: string) {
    //   return this.creatorApi(account, hostname).speaker.delete(role, type).then(() => {
    //     if (type === 'role') {
    //       this.get(account, hostname)!.roleList.delete(role)
    //     }
    //     if (type === 'robot') {
    //       this.get(account, hostname)!.robotList.delete(role)
    //     }
    //   })
    // },
    testTts(role: number, account: string, hostname: string) {
      return this.creatorApi(account, hostname).speaker.testTts(role)
    },
    clearTemp(url: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).speaker.clearTemp(url)
    }
    // getChangerList() {},
  },
  getters: {
    //
  }
})
