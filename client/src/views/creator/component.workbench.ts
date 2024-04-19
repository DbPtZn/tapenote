import { LibraryEnum } from '@/enums'
import { ContainerTree, ContainerTypeEnum, FractalContainerConfig } from '@/renderer'
import * as UUID from 'uuid'
import { DefaultView, _400View, _403View, _404View } from './default'
import { h, markRaw } from 'vue'
import { ProjectView } from './project'
export interface CreatePageProps {
  id: string
  lib: LibraryEnum
  account: string
  hostname: string
}

export class ComponentWorkbench extends ContainerTree {
  default: FractalContainerConfig
  itemId: string  // 聚焦的项目 id (项目列表中的聚焦状态)
  focusId: string // 聚焦的容器 id
  constructor() {
    super({
      id: UUID.v4(),
      type: 'wrapper',
      name: 'workbench',
      cmpt: null,
      isRow: true,
      children: []
    })
    this.focusId = ''
    this.itemId = ''
    this.default = {
      id: UUID.v4(),
      type: 'component',
      name: 'default',
      cmpt: markRaw(DefaultView),
      useControl: true,
      isSplitterRender: true, // default 也要渲染分隔条，否则替换它的组件也会缺少这项属性
      allowDrag: true,
      allowDrop: true,
      isRow: true,
      children: []
    }
    this.data.children.push(this.default)
    this.focusId = this.default.id
  }
  /**
   * 设置容器和列表项目的聚焦对象 （只填一个即可）
   * 该方法仅适用于项目组件
  */
  setFocus(args: { itemId?: string, containerId?: string, node?: FractalContainerConfig }) {
    const { itemId, containerId, node } = args
    if (!itemId && !containerId && !node) return
    // 设置容器的聚焦状态
    if (containerId) {
      this.focusId = containerId
    }
    else if (node && node.id) {
      this.focusId = node.id
    }
    else if (itemId) {
      const target = this.findNodeByName(itemId)
      if(target) this.focusId = target.id
    }
    // 设置列表项目的聚焦状态
    if (itemId) {
      this.itemId = itemId
    }
    else if (node && node.name) {
      this.itemId = node.name
    }
    else if (containerId) {
      const target = this.findNodeById(containerId)
      if(target && target.name) this.itemId = target.name
    }
    // console.log([this.focusId, this.itemId])
  }
  /** 清理聚焦对象 */
  clearFocus() {
    this.focusId = ''
    this.itemId = ''
  }
  /** 通过项目 id 设置页面内容 */
  setById(args: CreatePageProps) {
    // console.log([itemId,lib])
    const itemId = args.id
    // 1. 创建虚拟项目组件
    const cmpt = markRaw(h(ProjectView, { ...args }))
    // const cmpt = markRaw(h(this.getCmpt(lib), { id: itemId }))
    // 2. 查询项目是否已经实例化（根据 id 查询）
    const instanceNode = this.findNodeByName(itemId)
    // console.log(instanceNode)
    // console.log(this.data)
    // 3. 如果节点已经开启，聚焦到目标窗口上
    if (instanceNode) {
      this.setFocus({ node: instanceNode })
      return
    }
    // 4. 如果当前已聚焦，直接对该 id 容器进行替换
    // console.log(this.focusId)
    if (this.focusId) {
      const existNode = this.findNodeById(this.focusId)
      if (existNode) {
        existNode.name = itemId
        existNode.cmpt = cmpt
        existNode.id = UUID.v4()
        this.setFocus({ itemId: itemId })
        return
      }
    }
    // 工作区不存在容器的时候，创建一个新的
    if (this.data.children.length === 0) {
      // TODO 似乎并不能将项目id 设置为容器 id，因为在容器拖拽的事件中，我们并没有对容器 id 进行交换！！！
      const id =  UUID.v4()
      const newCmpt: FractalContainerConfig = {
        id: id, 
        name: itemId, // 可以将项目 id 设置为容器 name
        type: ContainerTypeEnum.CMPT,
        cmpt: cmpt,
        isRow: true,
        isSplitterRender: true,
        useControl: true,
        allowDrag: true,
        allowDrop: true,
        // min: 8,
        children: []
      }
      this.data.children.push(newCmpt)
      this.setFocus({ node: newCmpt })
    }
  }
  /** 查询实例 */
  queryInstance(itemId: string, lib?: LibraryEnum) {
    const instance = this.findNodeByName(itemId)
    return instance
  }
  createCmptNode(args: CreatePageProps) {
    const cmpt = markRaw(h(ProjectView, { ...args }))
    const component: FractalContainerConfig = {
      id: UUID.v4(),
      name: args.id,
      type: ContainerTypeEnum.CMPT,
      cmpt,
      isRow: true,
      isSplitterRender: true,
      useControl: true,
      allowDrag: true,
      allowDrop: true,
      children: []
    }
    return component
  }
  findNodeByNameAndRemove(name: string) {
    const node = this.findNodeByName(name)
    node && this.removeByNode(node)
  }
  // private createVPage(args: CreatePageProps) {
  //   const cmpt = markRaw(h(ProjectView, { ...args }))
  //   return cmpt
  // }
  // TODO 这个配置组件的位置不太显眼，待优化
  /** 配置组件 */
  // private getCmpt(lib: LibraryEnum): Component {
  //   switch(lib) {
  //     case LibraryEnum.NOTE:
  //       return NoteView
  //     case LibraryEnum.COURSE:
  //       return CourseView
  //     case LibraryEnum.PROCEDURE:
  //       return ProcedureView
  //   }
  // }

  private getErrorCmpt(code: 404 | 403 | 400, id: string) {
    switch(code) {
      case 400:
        return h(_400View, { onClose: () => this.findNodeByIdAndRemove(id) })
      case 403:
        return _403View
      case 404:
        return h(_404View, { onClose: () => this.findNodeByIdAndRemove(id) })
    }
  } 

  useDefault() {
    this.data.children.push({
      id: UUID.v4(),
      type: 'component',
      name: 'default',
      cmpt: markRaw(DefaultView),
      useControl: true,
      isSplitterRender: true, // default 也要渲染分隔条，否则替换它的组件也会缺少这项属性
      allowDrag: true,
      allowDrop: true,
      isRow: true,
      children: []
    })
  }

  useError(code: 404 | 403 | 400) {
    if (this.focusId) {
      const existNode = this.findNodeById(this.focusId)
      if (existNode) {
        const id = UUID.v4()
        existNode.name = code.toString()
        existNode.cmpt = markRaw(this.getErrorCmpt(code, id))
        existNode.id = id
        this.focusId = id
        this.itemId = ''
        return
      }
    }
  }
}



// 问题：vue 组件的持久化存在渲染问题，暂不考虑实现
// /** 设置持久化： 配置持久化，应该在所有可能导致页面改变的地方配置函数 */
// setPersist(state: FractalContainerConfig) {
//   const json = this.serializer(state)
//   // console.log(json)
//   localStorage.setItem('persist', json)
// }
// private getPersist() {
//   const res = localStorage.getItem('persist')
//   // console.log(res)
//   if (res) {
//     const parse = this.deserialize(res!)
//     return parse
//   }
//   return null
// }
// private serializer(state: FractalContainerConfig) {
//   const cache = new WeakSet()
//   const placeholder = '[Circular]'
//   // function replacer(key: any, value: object | null) {
//   //   if (key === 'cmpt') {
//   //     // state.cmpt!.toJson()
//   //   }
//   //   // if (typeof value === 'object' && value !== null) {
//   //   //   if (cache.has(value)) {
//   //   //     return placeholder
//   //   //   }
//   //   //   cache.add(value)
//   //   // }
//   //   return value
//   // }
//   const jsonString = CircularJSON.stringify(state)
//   return jsonString
// }
// private deserialize(value: string): FractalContainerConfig {
//   return JSON.parse(value)
// }