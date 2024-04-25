import { creator, CreatorApi } from '@/api'
import { defineStore } from 'pinia'
import useStore from '..'

/**
 * 扮演角色列表：由真人真声录制，可以选择变声器改变音色
 * 合成语音列表：由服务商提供的语音合成的音色
 */

interface Data {
  role: number
  robot: number
  roleList: {
    key: number
    value: { name: string; avatar: string; changer: number }
  }[] // 扮演角色列表
  robotList: {
    key: number
    value: { name: string; avatar: string }
  }[] // 合成语音列表
}

interface Timbre {
  id: string
  role: number
  robot: number
  roleList: Map<number, { name: string; avatar: string; changer: number }> // 扮演角色列表
  robotList: Map<number, { name: string; avatar: string }> // 合成语音列表
}

interface State {
  data: Timbre[]
}

export const useTimbreStore = defineStore('timbreStore', {
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
      return new Promise<Timbre>((resolve, reject) => {
        const index = this.data.findIndex(i => i.id === `${account}&${hostname}`)
        if (index !== -1) {
          resolve(this.data[index])
        } else {
          this.fetch<Data>(account, hostname).then(res => {
            const timbre = this.set(res.data, account, hostname)
            // console.log(timbre)
            resolve(timbre)
          })
        }
      })
    },
    fetch<T>(account: string, hostname: string) {
      return this.creatorApi(account, hostname).timbre.getAll<T>()
    },
    set(data: Data, account: string, hostname: string) {
      const { userListStore } = useStore()
      const timbre: Timbre = {
        id: `${account}&${hostname}`,
        role: data.role,
        robot: data.robot,
        roleList: new Map(),
        robotList: new Map()
      }
      const user = userListStore.get(account, hostname)
      timbre.roleList.set(9999, { name: '本尊', avatar: user.avatar, changer: 0 })
      timbre.robotList.set(0, { name: '默认', avatar: './robot.png' })
      data.roleList.forEach(item => {
        item.value.avatar = `${hostname}${item.value.avatar}`
        // console.log(item.value)
        timbre.roleList.set(item.key, item.value)
      })
      data.robotList.forEach(item => {
        item.value.avatar = `${hostname}${item.value.avatar}`
        // console.log(item.value)
        timbre.robotList.set(item.key, item.value)
      })
      this.data.push(timbre)
      return timbre
    },
    get(account: string, hostname: string) {
      return this.data.find(i => i.id === `${account}&${hostname}`)
    },
    getCurrent(type: 'role' | 'robot',account: string, hostname: string) {
      const state = this.get(account, hostname)
      if (type === 'role') {
        return state?.roleList?.get(state.role)
      }
      if (type === 'robot') {
        return state?.robotList?.get(state.robot)
      }
    },
    selected(key: number, type: 'role' | 'robot', account: string, hostname: string) {
      if (type === 'role') {
        this.get(account, hostname)!.role = key
      }
      if (type === 'robot') {
        this.get(account, hostname)!.robot = key
      }
    },
    /** 添加新角色 */
    addRole<T>(params: Parameters<typeof CreatorApi.prototype.timbre.addRole>[0], account: string, hostname: string) {
      return this.creatorApi(account, hostname).timbre.addRole<T>(params).then(() => {
        this.get(account, hostname)!.roleList.set(params.role, {
          name: params.name,
          avatar: params.avatar,
          changer: params.changer || 0
        })
      })
    },
    /** 添加新合成语音 */
    addRobot<T>(params: Parameters<typeof CreatorApi.prototype.timbre.addRobot>[0], account: string, hostname: string) {
      return this.creatorApi(account, hostname).timbre.addRobot<T>(params).then(() => {
        this.get(account, hostname)!.robotList.set(params.role, {
          name: params.name,
          avatar: params.avatar
        })
      })
    },
    remove(role: number, type: 'role' | 'robot', account: string, hostname: string) {
      return this.creatorApi(account, hostname).timbre.delete(role, type).then(() => {
        if (type === 'role') {
          this.get(account, hostname)!.roleList.delete(role)
        }
        if (type === 'robot') {
          this.get(account, hostname)!.robotList.delete(role)
        }
      })
    },
    testRobot(role: number, account: string, hostname: string) {
      return this.creatorApi(account, hostname).timbre.testRobot(role)
    },
    clearTemp(url: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).timbre.clearTemp(url)
    }
    // getChangerList() {},
  },
  getters: {
    //
  }
})
