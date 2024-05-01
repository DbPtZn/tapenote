import { Component, markRaw } from 'vue'
import { FractalContainerConfig, InsertType, ContainerTypeEnum } from '..'
import * as Flatted from 'flatted'
interface ContainerTreeModule {
  /** 通过 id 查询节点 */
  findNodeById(id: string): FractalContainerConfig | null
  /** 通过 url 查询节点 */
  // findNodeByUrl(url: string): FractalContainerConfig | null
  /** 通过 name 找到首个 name 匹配的节点 */
  findFirstNodeByType(type: string): FractalContainerConfig | null
  /** 通过 name 找到所有 name 匹配的节点 */
  findAllNodesByType(type: string): Array<FractalContainerConfig | null>
  /** 通过 id 移除容器 */
  findNodeByIdAndRemove(id: string): FractalContainerConfig | null
  /** 通过节点删除容器 */
  removeByNode(node: FractalContainerConfig, parentNode?: FractalContainerConfig): void
  /** 在全局数据中找到空节点并移除它们 */
  findEmptyNodeAndRemove(): void
  /** 在全局数据中找到非必要嵌套节点并清理它们 */
  findUnnecessaryNestedNodeAndClean(): void
  /** 移动节点 */
  moveNode(sourceNode: FractalContainerConfig, targetNode: FractalContainerConfig, targetNodeParent: FractalContainerConfig, index: number, insertType: InsertType): void
}

export class ContainerTree implements ContainerTreeModule {
  data: FractalContainerConfig
  constructor(data: FractalContainerConfig) {
    this.data = data
  }
  // TODO 递归组件存在垃圾计算的问题，有空一并优化解决。
  findNodeById(id: string): FractalContainerConfig | null {
    function _findNodeById(id: string, data: FractalContainerConfig): FractalContainerConfig | null {
      let node: FractalContainerConfig | null = null
      if (data.id === id) {
        node = data
        return node
      }
      else if (data.children.length !== 0) {
        for (let i = 0; i < data.children.length; i++) {
          node = _findNodeById(id, data.children[i]) || node
          if (node) return node
        }
      }
      return node
    }
    return _findNodeById(id, this.data)
  }
  /** 通过 name 查询容器节点 */
  findNodeByName(name: string): FractalContainerConfig | null {
    function _findNodeByName(name: string, data: FractalContainerConfig): FractalContainerConfig | null {
      let node: FractalContainerConfig | null = null
      if (data.name && data.name === name) {
        node = data
        return node
      }
      else if (data.children.length !== 0) {
        for (let i = 0; i < data.children.length; i++) {
          node = _findNodeByName(name, data.children[i]) || node
          if (node) return node
        }
      }
      return node
    }
    return _findNodeByName(name, this.data)
  }

  // findNodeByUrl(url: string): FractalContainerConfig | null {
  //   function _findNodeByUrl(url: string, data: FractalContainerConfig) {
  //     let node: FractalContainerConfig | null = null
  //     if (data.url === url) {
  //       node = data
  //       return node
  //     }
  //     if (data.children.length !== 0) {
  //       data.children.forEach((child) => {
  //         node = _findNodeByUrl(url, child) || node
  //       })
  //     }
  //     return node
  //   }
  //   return _findNodeByUrl(url, this.data)
  // }
  
  findFirstNodeByType(type: ContainerTypeEnum): FractalContainerConfig | null {
    function _findFirstNodeByType(type: string, data: FractalContainerConfig) {
      let node: FractalContainerConfig | null = null
      if (data.type === type) {
        node = data
        return node
      }
      if (data.children.length !== 0) {
        data.children.forEach((child) => {
          node = _findFirstNodeByType(type, child) || node
        })
      }
      return node
    }
    return _findFirstNodeByType(type, this.data)
  }
  /** 该代码未测试 */
  findAllNodesByType(type: ContainerTypeEnum): (FractalContainerConfig | null)[] {
    const arr: Array<FractalContainerConfig | null> = []
    function _findAllNodesByType(type: string, data: FractalContainerConfig) {
      if (data.type === type) {
        arr.push(data)
      }
      if (data.children.length !== 0) {
        data.children.forEach((child) => {
          _findAllNodesByType(type, child)
        })
      }
      return arr
    }
    return _findAllNodesByType(type, this.data)
  }
  /** 通过 id 查询父容器 */
  findParentNodeById(id: string) {
    function _findParentNodeById(id: string, data: FractalContainerConfig): FractalContainerConfig | null {
      let node: FractalContainerConfig | null = null
      if (data.children.length !== 0) {
        data.children.forEach((child) => {
          if (child.id === id) {
            node = data
          } else {
            node = _findParentNodeById(id, child) || node
          }
        })
      }
      return node
    }
    return _findParentNodeById(id, this.data)
  }
  findNodeByIdAndRemove(id: string): FractalContainerConfig | null {
    let node: FractalContainerConfig | null = null
    const parent = this.findParentNodeById(id)
    if (parent) {
      parent.children.forEach((child, index, arr) => {
        if (child.id === id) {
          node = child
          arr.splice(index, 1)
          return
        }
      })
    }
    return node
  }
  removeByNode(node: FractalContainerConfig, parentNode?: FractalContainerConfig): void {
    const parent = parentNode || node.parent || this.findParentNodeById(node.id)
    if (parent) {
      parent.children.forEach((child, index, arr) => {
        if (child.id === node.id) {
          arr.splice(index, 1)
          return
        }
      })
    }
  }
  /** 现采用组件内的自检测实现清除空容器，该方法可能不会用到 */
  findEmptyNodeAndRemove(): void {
    function _findEmptyNodeAndRemove(data: FractalContainerConfig) {
      if (data.children && data.children.length > 0) {
        data.children.forEach((child, index) => {
          if (child.type === ContainerTypeEnum.SIMPLE && child.children.length === 0) {
            data.children.splice(index, 1)
            index-- // 处理后，需要回退一个索引位置，否则会有遗漏
          } else {
            _findEmptyNodeAndRemove(child)
          }
        })
      }
      return // 跳出递归循环
    }
    _findEmptyNodeAndRemove(this.data)
  }
  findUnnecessaryNestedNodeAndClean(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    function _findUnnecessaryNestedNodeAndClean(node: FractalContainerConfig) {
      if (node.type === ContainerTypeEnum.SIMPLE) {
        if (node.children.length === 1) {
          const parentNode = that.findParentNodeById(node.id)
          if (parentNode) {
            parentNode.children.forEach((item, index, arr) => {
              if (item.id === node.id) {
                arr.splice(index, 1, ...node.children)
                return
              }
            })
          }
        } else {
          node.children.forEach((child) => {
            _findUnnecessaryNestedNodeAndClean(child)
          })
          return // 跳出递归循环
        }
      } else {
        node.children.forEach((child, index) => {
          _findUnnecessaryNestedNodeAndClean(child)
        })
      }
      return
    }
    _findUnnecessaryNestedNodeAndClean(this.data)
  }
  moveNode(sourceNode: FractalContainerConfig, targetNode: FractalContainerConfig, targetNodeParent: FractalContainerConfig, index: number, insertType: InsertType): void {
    if (!sourceNode || sourceNode.id === targetNode.id) return
    const parent = targetNodeParent
    // const sourceNode = findNodeById(sourceId, containerData)
    // const newNode = sourceNode! newNode 这样写也可以
    // 这里应该等于重新拷贝了一份组件，与原组件断开联系。（如果不这样处理，会报错，具体原因暂时不明确）
    const newNode = Flatted.parse(Flatted.stringify(sourceNode))
    newNode.cmpt = sourceNode.cmpt
    const oldNode = Flatted.parse(Flatted.stringify(targetNode))
    oldNode.cmpt = targetNode.cmpt
    if (sourceNode) {
      const sourceId = sourceNode.id
      const targetId = targetNode.id
      // let sourceUrl = ''
      // let targetUrl = ''
      let sourceCmpt: Component | null = null
      let targetCmpt: Component | null = null
      let sourceName = ''
      let targetName = ''
      sourceNode.cmpt && (sourceCmpt = markRaw(sourceNode.cmpt))
      targetNode.cmpt && (targetCmpt = markRaw(targetNode.cmpt))
      // sourceNode.url && (sourceUrl = sourceNode.url)
      // targetNode.url && (targetUrl = targetNode.url)
      sourceNode.name && (sourceName = sourceNode.name)
      targetNode.name && (targetName = targetNode.name)
      let emptyId = ''
      switch (insertType) {
        case InsertType.MIDDLE:
          // 注意： 现在这里只替换了渲染内容，容器并没有发生替换
          // targetNode.url = sourceUrl
          // sourceNode.url = targetUrl
          sourceNode.cmpt = targetCmpt
          targetNode.cmpt = sourceCmpt
          sourceNode.name = targetName
          targetNode.name = sourceName
          targetNode.id = sourceId
          sourceNode.id = targetId
          // console.log('交换')
          // 可以进一步对 id、name、radio、min 等参数进行替换
          break
        case InsertType.LEFT:
          // 可以进一步判断源节点是否在目标节点的同级中，否则直接移除源节点也应该不会影响排序
          emptyId = this.replaceEmptyNode(sourceNode)
          if (parent.isRow) {
            parent.children.splice(index, 0, newNode)
          } else {
            if (parent.children.length === 2 && parent.children.some((item) => item.type === ContainerTypeEnum.EMPTY)) {
              parent.isRow = true
              parent.children.splice(0, 0, newNode)
              this.checkSimpleNodeAndClean(parent, false)
            } else {
              // 构造新容器
              targetNode.id = generateLongUUID()
              targetNode.name = ''
              targetNode.type = ContainerTypeEnum.SIMPLE
              targetNode.isRow = true
              targetNode.allowDrag = false
              targetNode.allowDrop = false
              targetNode.useControl = false
              // targetNode.url = ''
              targetNode.cmpt = null
              targetNode.children = [newNode, oldNode]
            }
          }
          this.removeEmptyNode(emptyId)
          this.findUnnecessaryNestedNodeAndClean()
          break
        case InsertType.RIGHT:
          emptyId = this.replaceEmptyNode(sourceNode)
          if (parent.isRow) {
            parent.children.splice(index + 1, 0, newNode)
          } else {
            if (parent.children.length === 2 && parent.children.some((item) => item.type === ContainerTypeEnum.EMPTY)) {
              parent.isRow = true
              parent.children.splice(index + 1, 0, newNode)
              this.checkSimpleNodeAndClean(parent, false)
            } else {
              // 构造新容器
              targetNode.id = generateLongUUID()
              targetNode.name = ''
              targetNode.type = ContainerTypeEnum.SIMPLE
              targetNode.isRow = true
              targetNode.allowDrag = false
              targetNode.allowDrop = false
              targetNode.useControl = false
              // targetNode.url = ''
              targetNode.cmpt = null
              targetNode.children = [oldNode, newNode]
            }
          }
          this.removeEmptyNode(emptyId)
          this.findUnnecessaryNestedNodeAndClean()
          break
        case InsertType.TOP:
          emptyId = this.replaceEmptyNode(sourceNode)
          if (parent.isRow) {
            // 如果父容器是水平分布且只有一个元素，就将父容器改成垂直分布，否则就要构造一个新的父容器
            if (parent.children.length === 2 && parent.children.some((item) => item.type === 'empty')) {
              parent.isRow = false
              parent.children.splice(0, 0, newNode)
              this.checkSimpleNodeAndClean(parent, false)
            } else {
              // 构造新容器
              targetNode.id = generateLongUUID()
              targetNode.name = ''
              targetNode.type = ContainerTypeEnum.SIMPLE
              targetNode.isRow = false
              targetNode.allowDrag = false
              targetNode.allowDrop = false
              targetNode.useControl = false
              // targetNode.url = ''
              targetNode.cmpt = null
              // node.isChangeAllow = false
              targetNode.children = [newNode, oldNode]
            }
          } else {
            parent.children.splice(index, 0, newNode)
          }
          this.removeEmptyNode(emptyId)
          this.findUnnecessaryNestedNodeAndClean()
          break
        case InsertType.BOTTOM:
          emptyId = this.replaceEmptyNode(sourceNode)
          if (parent.isRow) {
            if (parent.children.length === 2 && parent.children.some((item) => item.type === 'empty')) {
              parent.isRow = false
              parent.children.splice(index + 1, 0, newNode)
              this.checkSimpleNodeAndClean(parent, false)
            } else {
              // 构造新容器
              targetNode.id = generateLongUUID()
              targetNode.name = ''
              targetNode.type = ContainerTypeEnum.SIMPLE
              targetNode.isRow = false
              targetNode.allowDrag = false
              targetNode.allowDrop = false
              targetNode.useControl = false
              // targetNode.url = ''
              targetNode.cmpt = null
              targetNode.children = [oldNode, newNode]
            }
          } else {
            parent.children.splice(index + 1, 0, newNode)
          }
          this.removeEmptyNode(emptyId)
          this.findUnnecessaryNestedNodeAndClean()
          break
        default:
          return
      }
    }
  }
  /** 用一个空节点替换一个渲染节点 */
  private replaceEmptyNode(node: FractalContainerConfig) {
    // 当我们移动节点时，要先移除的被移动节点，这会导致该节点所在的层级中的各节点位置发生变化。
    // 空节点用在移动节点的时候临时替代被移除的节点，以保证节点的顺序、位置不变。
    const emptyNode: FractalContainerConfig = {
      id: generateLongUUID(),
      name: '',
      type: ContainerTypeEnum.EMPTY,
      // url: '',
      cmpt: null,
      ratio: 0,
      min: 0,
      isRow: false,
      children: []
    }
    const parent = this.findParentNodeById(node.id)
    parent?.children.forEach((item, index, arr) => {
      if (item.id === node.id) {
        arr.splice(index, 1, emptyNode)
        return
      }
    })
    // console.log('插入空占位节点')
    return emptyNode.id
  }
  /** 移除空节点 */
  private removeEmptyNode(id: string) {
    const emptyNode = this.findNodeByIdAndRemove(id)
    // console.log('移除空占位节点')
  }
  /** 
   * 检测纯容器节点并清理非必要节点
   * 如果 simple 容器节点与其父节点的 isRow 相同，则清理该节点（用其子节点将其覆盖）
   */
  private checkSimpleNodeAndClean(parentNode: FractalContainerConfig, isReverse: boolean) {
    if (parentNode.type !== 'simple') return
    const ancestor = parentNode.parent || this.findParentNodeById(parentNode.id)
    if (ancestor && ancestor.isRow === parentNode.isRow) {
      ancestor.children.forEach((item, idx, arr) => {
        if (item.id === parentNode.id && parentNode.type === 'simple') {
          isReverse ? arr.splice(idx, 1, ...parentNode.children.reverse()) : arr.splice(idx, 1, ...parentNode.children)
        }
      })
    }
  }
  /** 插入节点 */
  insertNode(newNode: FractalContainerConfig, node: FractalContainerConfig, parent: FractalContainerConfig, index: number, insertType: InsertType) {
    // console.log(insertType)
    const oldNode = Flatted.parse(Flatted.stringify(node))
    oldNode.cmpt = node.cmpt
    // const oldNode = {
    //   id:  node.id,
    //   name: node.name,
    //   type: node.type,
    //   isRow: node.isRow,
    //   allowDrag: node.allowDrag,
    //   allowDrop: node.allowDrop,
    //   useControl: node.useControl,
    //   url: node.url,
    //   cmpt: node.cmpt,
    //   children: []
    // }
    // console.log(oldNode)
    switch (insertType) {
      case InsertType.MIDDLE:
        // node.url = url // 替换节点的 url
        parent.children.splice(index, 1, newNode)
        break
      case InsertType.LEFT:
        if (parent.isRow) {
          parent.children.splice(index, 0, newNode)
        } else {
          if (parent.children.length === 1) {
            parent.isRow = true
            parent.children.splice(index, 0, newNode)
          } else {
            // 构造新容器
            node.id = generateLongUUID()
            node.name = ''
            node.type = ContainerTypeEnum.SIMPLE
            node.isRow = true
            node.allowDrag = false
            node.allowDrop = false
            node.useControl = false
            // node.url = undefined
            node.cmpt = null
            node.children = [newNode, oldNode]
          }
        }
        break
      case InsertType.RIGHT:
        if (parent.isRow) {
          parent.children.splice(index + 1, 0, newNode)
        } else {
          if (parent.children.length === 1) {
            parent.isRow = true
            parent.children.splice(index, 0, newNode)
          } else {
            // 构造新容器
            node.id = generateLongUUID()
            node.name = ''
            node.type = ContainerTypeEnum.SIMPLE
            node.isRow = true
            node.allowDrag = false
            node.allowDrop = false
            node.useControl = false
            // node.url = undefined
            node.cmpt = null
            node.children = [oldNode, newNode]
          }
        }
        break
      case InsertType.TOP:
        if (parent.isRow) {
          if (parent.children.length === 1) {
            parent.isRow = false
            parent.children.splice(index, 0, newNode)
          } else {
            node.id = generateLongUUID()
            node.name = ''
            node.type = ContainerTypeEnum.SIMPLE
            node.isRow = false
            node.allowDrag = false
            node.allowDrop = false
            node.useControl = false
            // node.url = undefined
            node.cmpt = null
            node.children = [newNode, oldNode]
          }
        } else {
          parent.children.splice(index, 0, newNode)
        }
        break
      case InsertType.BOTTOM:
        if (parent.isRow) {
          if (parent.children.length === 1) {
            parent.isRow = false
            parent.children.splice(index + 1, 0, newNode)
          } else {
            node.id = generateLongUUID()
            node.name = ''
            node.type = ContainerTypeEnum.SIMPLE
            node.isRow = false
            node.allowDrag = false
            node.allowDrop = false
            node.useControl = false
            // node.url = undefined
            node.cmpt = null
            node.children = [oldNode, newNode]
          }
        } else {
          parent.children.splice(index + 1, 0, newNode)
        }
        break
      default:
        return
    }
  }
  // createIframeNode(url: string) {
  //   const iframe: FractalContainerConfig = {
  //     id: generateLongUUID(),
  //     type: ContainerTypeEnum.IFRAME,
  //     url,
  //     isRow: true,
  //     isSplitterRender: true,
  //     useControl: true,
  //     allowDrag: true,
  //     allowDrop: true,
  //     children: []
  //   }
  //   return iframe
  // }
  // createCmptNode(cmpt: Component) {
  //   const component: FractalContainerConfig = {
  //     id: generateLongUUID(),
  //     type: ContainerTypeEnum.CMPT,
  //     cmpt,
  //     isRow: true,
  //     isSplitterRender: true,
  //     useControl: true,
  //     allowDrag: true,
  //     allowDrop: true,
  //     children: []
  //   }
  //   return component
  // }
}

/**
 * UUID（通用唯一标识符）是一种全局唯一的标识符，通常由一组 32 个十六进制数字组成
 * 如：55dc815c-5911-4f49-8e0f-5f9a0a02cfcb
 */
export function generateLongUUID() {
  let d = new Date().getTime()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now() //use high-precision timer if available
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}
