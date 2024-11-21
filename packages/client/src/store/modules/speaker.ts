import { creator, CreatorApi } from '@/api'
import { defineStore } from 'pinia'
import useStore from '..'
enum AsrModel {
  Local = 'local-base-asr',
  // Xunfei = 'xunfei-base-asr',
  Tencent = 'tencent-base-asr'
}
enum TtsModel {
  Local = 'local-base-tts',
  // Xunfei = 'xunfei-base-tts',
  Tencent = 'tencent-base-tts'
}
/**
 * human ：由真人真声录制，可以选择变声器改变音色
 * machine ：由服务商提供的语音合成的音色
 */
interface Speaker {
  account: string
  hostname: string
  id: string
  type: 'human' | 'machine' // 角色类型
  language: string[]
  speed: number
  avatar: string // 头像地址
  model: string // 语音模型
  // audio: string // 快速测试音频地址 仅在 type 为 mechanic 时生效
  name: string // 角色名称
  role: number // 角色值 0~9999 为 AI 语音预留 10000~99999 为用户角色预留
  changer: number // 变声器 仅在 type 为 human 时生效 (暂未实现)
}
// 语音模型选项应该由后端提供，这样才能保持前后端的一致性
interface ModelOption {
  label: string
  value: string
  msg: string
}

interface State {
  account: string
  hostname: string
  data: Speaker[]
  ttsOptions: ModelOption[]
  asrOptions: ModelOption[]
}

export const useSpeakerStore = defineStore('speakerStore', {
  state(): State {
    return {
      account: '',
      hostname: '',
      data: [],
      ttsOptions: [],
      asrOptions: []
    }
  },
  actions: {
    creatorApi(account: string, hostname: string) {
      return creator.getCreatorApi(account, hostname)!
    },
    create(params: Parameters<typeof CreatorApi.prototype.speaker.create>[0], account: string, hostname: string) {
      this.creatorApi(account, hostname)
        .speaker.create<Speaker>(params)
        .then(res => {
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
      if (this.data.length === 0 || this.account !== account || this.hostname !== hostname) {
        return this.fetch<{
          speakers: Speaker[],
          ttsOptions: ModelOption[],
          asrOptions: ModelOption[]
        }>(account, hostname).then(res => {
          const { speakers, ttsOptions, asrOptions } = res.data
          // console.log(res.data)
          this.account = account
          this.hostname = hostname
          this.ttsOptions = ttsOptions || []
          this.asrOptions = asrOptions || []
          return this.set(speakers || [], account, hostname)
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
      if (id !== '') {
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
        defaultSpeaker = {
          account: account,
          hostname: hostname,
          id: '',
          type: 'human',
          speed: 1,  // 无影响
          language: ['zh-CN', 'en-US'], // 无影响
          model: getModel(user.isVip),
          avatar: user?.avatar || '',
          // audio: '',
          name: user?.nickname || '',
          role: 0, // 无影响
          changer: 0
        }
      } else {
        defaultSpeaker = {
          account: account,
          hostname: hostname,
          id: '',
          type: 'machine',
          speed: 1,
          language: ['zh-CN'], // 当前默认只支持中文
          model: getModel(user.isVip),
          avatar: 'robot.png',
          // audio: '',
          name: '默认',
          role: 0,
          changer: 0
        }
      }
      function getModel(isVip: boolean) {
        if (isVip) {
          return type === 'human' ? AsrModel.Tencent : TtsModel.Tencent
        }
        return type === 'human' ? AsrModel.Local : TtsModel.Local
      }
      return defaultSpeaker
    },
    delete(id: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname)
        .speaker.delete(id)
        .then(() => {
          const index = this.data.findIndex(i => i.id === id)
          if (index !== -1) {
            this.data.splice(index, 1)
          }
        })
    },
    testTts(role: number, model: string, speed: number, account: string, hostname: string) {
      return this.creatorApi(account, hostname).speaker.testTts(role, model, speed)
    },
    clearTemp(url: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).speaker.clearTemp(url)
    }
  },
  getters: {
    //
  }
})
