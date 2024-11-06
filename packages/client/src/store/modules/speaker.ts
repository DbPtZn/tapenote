import { creator, CreatorApi } from '@/api'
import { defineStore } from 'pinia'
import useStore from '..'
import { VIP } from '@/enums'
import { isPaidVip } from '@/utils'
enum AsrModel {
  Local = 'local-base-asr',
  Xunfei = 'xunfei-base-asr'
}
enum TtsModel {
  Local = 'local-base-tts',
  Xunfei = 'xunfei-base-tts'
}
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
  model: string // 语音模型
  // audio: string // 快速测试音频地址 仅在 type 为 mechanic 时生效
  name: string // 角色名称
  role: number // 角色值 0~9999 为 AI 语音预留 10000~99999 为用户角色预留
  changer: number // 变声器 仅在 type 为 human 时生效
  // createAt: Date // 创建时间
  // updateAt: Date // 更新时间
}
interface State {
  account: string
  hostname: string
  data: Speaker[]
}


export const useSpeakerStore = defineStore('speakerStore', {
  state(): State {
    return {
      account: '',
      hostname: '',
      data: []
    }
  },
  actions: {
    creatorApi(account: string, hostname: string) {
      return creator.getCreatorApi(account, hostname)!
    },
    create(params: Parameters<typeof CreatorApi.prototype.speaker.create>[0], account: string, hostname: string) {
      this.creatorApi(account, hostname).speaker.create<Speaker>(params).then(res => {
        const speaker = res.data
        // console.log(speaker)
        if (speaker) {
          speaker.account = account
          speaker.hostname = hostname
          const ResourceDomain = localStorage.getItem(`ResourceDomain:${hostname}`) as string
          speaker.avatar = ResourceDomain + speaker.avatar
          this.data.push(speaker)
        }
        // console.log(this.data)
      })
    },
    fetchAndSet(account: string, hostname: string) {
      if(this.data.length === 0 || this.account !== account || this.hostname !== hostname) {
        return this.fetch<Speaker[]>(account, hostname).then(res => {
          // console.log(res.data)
          this.account = account
          this.hostname = hostname
          return this.set(res.data, account, hostname)
        })
      }
    },
    fetch<T>(account: string, hostname: string) {
      return this.creatorApi(account, hostname).speaker.getAll<T>()
    },
    set(data: Speaker[], account: string, hostname: string) {
      const ResourceDomain = localStorage.getItem(`ResourceDomain:${hostname}`) as string
      const state = data.map(speaker => {
        speaker.account = account
        speaker.hostname = hostname
        speaker.avatar = ResourceDomain + speaker.avatar
        return speaker
      })
      state.unshift(this.getDefault('human', account, hostname))
      state.unshift(this.getDefault('machine', account, hostname))
      this.data = state
      // console.log(state)
      return state
    },
    get(id: string, account: string, hostname: string, type?: 'human' | 'machine') {
      // console.log([id, account, hostname, type])
      if(id !== '') {
        const index = this.data.findIndex(i => i.id === id && i.account === account && i.hostname === hostname)
        // console.log(index)
        if (index !== -1) {
          return this.data.find(i => i.id === id && i.account === account && i.hostname === hostname)
        }
      }
      const defaultSpeaker = type === 'human' ? this.getDefault('human', account, hostname) : this.getDefault('machine', account, hostname)
      return defaultSpeaker
    },
    getDefault(type: 'human' | 'machine', account: string, hostname: string) {
      let defaultSpeaker: Speaker
      const { userListStore } = useStore()
      const user = userListStore.get(account, hostname)!
      if (type === 'human') {
        defaultSpeaker =  {
          account: account,
          hostname: hostname,
          id: '',
          type: 'human',
          model: getModel(user.role),
          avatar: user?.avatar || '',
          // audio: '',
          name: user?.nickname || '',
          role: 10000,
          changer: 0
        }
      } else {
        defaultSpeaker =  {
          account: account,
          hostname: hostname,
          id: '',
          type: 'machine',
          model: getModel(user.role),
          avatar: 'robot.png',
          // audio: '',
          name: '默认',
          role: 0,
          changer: 0
        }
      }
      function getModel(role: VIP) {
        if (isPaidVip(role)) {
          return type === 'human' ? AsrModel.Xunfei : TtsModel.Xunfei
        }
        return type === 'human' ? AsrModel.Local : TtsModel.Local
      }
      return defaultSpeaker
    },
    delete(id: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).speaker.delete(id).then(() => {
        const index = this.data.findIndex(i => i.id === id)
        if (index !== -1) {
          this.data.splice(index, 1)
        }
      })
    },
    testTts(role: number, model: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).speaker.testTts(role, model)
    },
    clearTemp(url: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).speaker.clearTemp(url)
    }
  },
  getters: {
    //
  }
})
