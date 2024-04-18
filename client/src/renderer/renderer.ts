import { ContainerTypeEnum, FractalContainerConfig } from './fractal-container'
import { defineStore } from 'pinia'
import { ShellModule } from './shell'

interface State {
  data: FractalContainerConfig
  /** 实现层节点：包裹分形容器的具体实现的元素，在 Index.vue 文件下 */
  implementRef: HTMLElement | undefined
  /** 封装层节点：封装分形容器最外层的 dom 元素（设置容器宽高的元素），在 FractalContainer.vue 文件下 */
  wrapperRef: HTMLElement | undefined
  shell: ShellModule | null
  height: number | string
  width: number | string
  useAuxLines: string
}

export const useRendererStore = defineStore('rendererStore', {
  state(): State {
    return {
      data: {
        id: 'root-conatiner',
        type: ContainerTypeEnum.ROOT,
        url: '',
        cmpt: null,
        isRow: true,
        isSplitterRender: false,
        ratio: 100,
        min: 100,
        children: []
      },
      shell: null,
      implementRef: undefined,
      wrapperRef: undefined,
      height: '100vh',
      width: '100vw',
      useAuxLines: '' // '#b6b6b6'
    }
  },
  actions: {
    set<T>(shell: ShellModule): Promise<T> {
      return new Promise((resolve, reject) => {
        // console.log('333')
        try {
          // console.log('444')
          this.data.children = [shell.setup()!]
          this.shell = shell
          this.height = shell.height
          this.width = shell.width
          this.useAuxLines = shell.useAuxLines ? shell.useAuxLines : ''
          resolve(this.shell as T)
        } catch (error) {
          reject(error)
        }
      })
    },
    setImplementRef(renderRef: HTMLElement) {
      this.implementRef = renderRef
    },
    setWrapperRef(wrapperRef: HTMLElement) {
      this.wrapperRef = wrapperRef
    },
    getShell<T>() {
      return this.shell as T
    }
  },
  getters: {
    getHeight(state) {
      if (typeof state.height === 'number') return state.height + 'px'
      return state.height
    },
    getWidth(state) {
      if (typeof state.width === 'number') return state.width + 'px'
      return state.width
    }
  },
  // persist: {
  //   key: 'data',
  //   paths: ['data'],
  //   serializer: {
  //     // TODO 使用 gpt 提供的办法对存储的数据进行序列化（处理其中的循环引用），原理暂时不理解，不能确保没有bug
  //     serialize: (state: StateTree) => {
  //       console.log(state)
  //       const cache = new WeakSet()
  //       const placeholder = '[Circular]'
  //       function replacer(key: any, value: object | null) {
  //         if (typeof value === 'object' && value !== null) {
  //           if (cache.has(value)) {
  //             return placeholder
  //           }
  //           cache.add(value)
  //         }
  //         return value
  //       }
  //       const jsonString = CircularJSON.stringify(state, replacer)
  //       return jsonString
  //     },
  //     deserialize: (value: string) => {
  //       return JSON.parse(value)
  //     }
  //   }
  // }
})


// class RendererStore {
//   state: {

//   }
// }

// export const rendererStore = reactive(new RendererStore())