import { creator, CreatorApi } from '@/api'
import { defineStore } from 'pinia'
import useStore, { TreeNode } from '@/store'
import { LibraryEnum } from '@/enums'
import _ from 'lodash'
import { treeNodeTranslator } from '@/formatter'

interface State {
  account: string
  hostname: string
  noteTree: TreeNode[]
  courseTree: TreeNode[]
  procedureTree: TreeNode[]
  expandedNames: LibraryEnum[]
  expandedKeys: {
    note: string[]
    course: string[]
    procedure: string[]
  }
}

export const useFolderTreeStore = defineStore('folderTreeStore', {
  state(): State {
    return {
      account: '',
      hostname: '',
      noteTree: [],
      courseTree: [],
      procedureTree: [],
      expandedNames: [],
      expandedKeys: {
        note: [],
        course: [],
        procedure: []
      }
    }
  },
  actions: {
    creatorApi() {
      const { userStore } = useStore()
      return creator.getCreatorApi(userStore.account, userStore.hostname)!
    },
    /** 将当前目录信息保存至缓存 */
    saveCache(account: string, hostname: string) {
      if (!account || !hostname) return
      const data = JSON.stringify(this.$state)
      // console.log(data)
      localStorage.setItem(`FolderTree:${account}&${hostname}`, data)
    },
    removeCache(account: string, hostname: string) {
      localStorage.removeItem(`FolderTree:${account}&${hostname}`)
    },
    /** 获取缓存 */
    getCache(account: string, hostname: string) {
      const data = localStorage.getItem(`FolderTree:${account}&${hostname}`)
      if (data) {
        const state = JSON.parse(data)
        this.$patch(state)
      } else {
        this.$reset()
      }
    },
    /** 初始化时设置第一级目录 */
    setFirstLevel(id: string, lib: LibraryEnum) {
      switch (lib) {
        case LibraryEnum.NOTE:
          if (this.noteTree.length === 0) return this.fetchFirstLevel(id, lib)
          break
        case LibraryEnum.COURSE:
          if (this.courseTree.length === 0) return this.fetchFirstLevel(id, lib)
          break
        case LibraryEnum.PROCEDURE:
          if (this.procedureTree.length === 0) return this.fetchFirstLevel(id, lib)
          break
      }
    },
    /** 初始化时获取第一级目录 */
    fetchFirstLevel(id: string, lib: LibraryEnum) {
      return this.creatorApi()
        .folder.getChildren(id)
        .then(res => {
          // console.log(res)
          const data = res.data.map(item => treeNodeTranslator(item))
          switch (lib) {
            case LibraryEnum.NOTE:
              this.noteTree = sortByCreateAt(data, true)
              break
            case LibraryEnum.COURSE:
              this.courseTree = sortByCreateAt(data, true)
              break
            case LibraryEnum.PROCEDURE:
              this.procedureTree = sortByCreateAt(data, true)
              break
          }
        })
    },
    fetchChildren(id: string) {
      return this.creatorApi()
        .folder.getChildren(id)
        .then(res => {
          // console.log(res)
          const data = res.data.map(item => treeNodeTranslator(item))
          return sortByCreateAt(data, true)
        })
    },
    set(treeData: TreeNode[], lib: LibraryEnum) {
      switch (lib) {
        case LibraryEnum.NOTE:
          this.noteTree = Array.from(treeData)
          break
        case LibraryEnum.COURSE:
          this.courseTree = Array.from(treeData)
          break
        case LibraryEnum.PROCEDURE:
          this.procedureTree = Array.from(treeData)
          break
      }
    },
    get(lib: LibraryEnum) {
      switch (lib) {
        case LibraryEnum.NOTE:
          return this.noteTree
        case LibraryEnum.COURSE:
          return this.courseTree
        case LibraryEnum.PROCEDURE:
          return this.procedureTree
      }
    },
    getWithSort(lib: LibraryEnum) {
      switch (lib) {
        case LibraryEnum.NOTE:
          return this.getNoteTree
        // return this.noteTree
        case LibraryEnum.COURSE:
          return this.getCourseTree
        // return this.courseTree
        case LibraryEnum.PROCEDURE:
          return this.getProcedureTree
        // return this.procedureTree
      }
    },
    /**
     * 注意事项：
     * 因目录数据重载的机制是判断目录是否为空
     * 当相应目录为空时，会导致恢复文件不会立即载入目录中，但重新展开折叠面板后会重载数据
     * 因为这种情况会比较少见，所以不考虑处理该bug
     * 1. 未展开，等于0--不插入; 2. 已展开，等于0--插入; 3. 未展开，大于0--插入; 4. 已展开，大于0--插入。
     * 只有第一种情况不要插入，但问题是不好判断是否已经展开
     */
    restore(node: TreeNode) {
      return this.creatorApi()
        .folder.restore<TreeNode>(node.id!, node.parentId!)
        .then(res => {
          const { userStore } = useStore()
          if (res.data.parentId === userStore.getDirByLib(res.data.lib!)) {
            const data = treeNodeTranslator(res.data)
            switch (res.data.lib) {
              case LibraryEnum.NOTE:
                if (this.noteTree.length !== 0) this.noteTree.unshift(data)
                break
              case LibraryEnum.COURSE:
                if (this.courseTree.length !== 0) this.courseTree.unshift(data)
                break
              case LibraryEnum.PROCEDURE:
                if (this.procedureTree.length !== 0) this.procedureTree.unshift(data)
                break
            }
          } else {
            // 策略一： 插入节点
            // const data = treeNodeTranslator(res.data)
            // this.insertNode(data, data.parentId!, data.lib!)
            // 策略二： 重置节点（重置节点自动重新获取数据）
            this.resetNode(node.parentId!, node.lib!)
          }
        })
    },
    /** 插入节点 */
    insertNode(sourcNode: TreeNode, targetId: string, lib: LibraryEnum) {
      const targetNode = this.findNodeById(targetId, this.getTreeByLib(lib))
      if (targetNode) {
        if (targetNode.children) {
          targetNode.children.unshift(sourcNode)
        } else {
          targetNode.children = [sourcNode]
          if (targetNode.isLeaf) targetNode.isLeaf = false
        }
      }
    },
    // 重置节点
    resetNode(targetId: string, lib: LibraryEnum) {
      if (!targetId) return
      switch (lib) {
        case LibraryEnum.NOTE:
          return resetNodeById(this.noteTree, targetId)
        case LibraryEnum.COURSE:
          return resetNodeById(this.courseTree, targetId)
        case LibraryEnum.PROCEDURE:
          return resetNodeById(this.procedureTree, targetId)
      }
    },
    /** 移除节点 */
    remove(folderId: string, lib: LibraryEnum) {
      const { folderStore, trashStore, projectStore } = useStore()
      return this.creatorApi()
        .folder.remove<string[]>(folderId)
        .then(res => {
          const removedIds = res.data
          const expandedKeys = this.getExpandedKeys(lib)
          removedIds.forEach(item => {
            // 清理 expandedKey
            if (expandedKeys.includes(item)) {
              expandedKeys.splice(
                expandedKeys.findIndex(i => i === item),
                1
              )
            }
            // 如果移除的节点包含当前打开的文件夹，则重置文件夹数据状态
            if (item === folderStore.id) {
              folderStore.$reset()
            }
            // 如果当前缓存项目包含被移除的文件夹下的项目，则要清理关联项目缓存
            projectStore.cleanCacheByFolderId(item)
          })
          const [siblings, index] = this.findSiblingsAndIndexById(folderId, this.get(lib))
          if (siblings === null || index === null) return
          const node = siblings[index]
          const parentId = node.parentId
          // 如果当前节点在打开的目录中，则应同步移除
          if (parentId === folderStore.id) {
            folderStore.removeSubfolderById(folderId)
          }
          // 从 tree 中移除节点
          siblings.splice(index, 1)
          // 如果父节点没有子节点了，则将其初始化
          if (parentId) {
            // console.log(parentId)
            const parentNode = this.findNodeById(parentId, this.get(lib))
            // console.log(parentNode)
            if (parentNode && parentNode.children?.length === 0) {
              parentNode.isLeaf = true
              parentNode.children = undefined
            }
          }
          // 将节点数据转移至回收站
          trashStore.add(trashStore.treeNodeToTrashData(node), 'folder')
          return true
        })
    },
    /** 删除节点 */
    delete(folderId: string) {
      return this.creatorApi().folder.delete(folderId)
    },
    /** 移动文件夹 */
    moveFolder(params: Parameters<typeof CreatorApi.prototype.folder.moveFolder>[0]) {
      return this.creatorApi().folder.moveFolder(params)
    },
    /** 重命名 */
    rename(newName: string, folderId: string) {
      return this.creatorApi().folder.rename(newName, folderId)
    },
    /** 查询文件夹是否存在 */
    queryExist(folderId: string) {
      return this.creatorApi().folder.queryExist(folderId).then(res => {
        return res.data
      })
    },
    queryAncestorNode(folderId: string, lib: LibraryEnum) {
      return this.creatorApi().folder.getAncestorNode<string[]>(folderId).then(res => {
        res.data.forEach(item => {
          if(!this.getExpandedKeys(lib).includes(item)) {
            this.getExpandedKeys(lib).push(item)
          }
        })
      })
    },
    /**-------------------------------- 查询功能 ----------------------------- */
    findSiblingsAndIndex(node: TreeNode, nodes?: TreeNode[]): [TreeNode[], number] | [null, null] {
      if (!nodes) return [null, null]
      for (let i = 0; i < nodes.length; ++i) {
        const siblingNode = nodes[i]
        if (siblingNode.key === node.key) return [nodes, i]
        const [siblings, index] = this.findSiblingsAndIndex(node, siblingNode.children)
        if (siblings && index !== null) return [siblings, index]
      }
      return [null, null]
    },
    findSiblingsAndIndexById(id: string, nodes?: TreeNode[]): [TreeNode[], number] | [null, null] {
      if (!nodes) return [null, null]
      for (let i = 0; i < nodes.length; ++i) {
        const siblingNode = nodes[i]
        if (siblingNode.id === id) return [nodes, i]
        const [siblings, index] = this.findSiblingsAndIndexById(id, siblingNode.children)
        if (siblings && index !== null) return [siblings, index]
      }
      return [null, null]
    },
    findNodeById(id: string, nodes: TreeNode[] | undefined): TreeNode | null {
      if (!nodes) return null
      for (let i = 0; i < nodes.length; ++i) {
        if (nodes[i].id === id) return nodes[i]
        const target = this.findNodeById(id, nodes[i].children)
        if (target) return target
      }
      return null
    },
    findNodeNameById(id: string, lib: LibraryEnum) {
      const { userStore } = useStore()
      if (userStore.getDirByLib(lib) === id) return `${lib.toLocaleUpperCase()} ROOT DIR`
      switch (lib) {
        case LibraryEnum.NOTE:
          return getNodeName(this.noteTree, id)
        case LibraryEnum.COURSE:
          return getNodeName(this.courseTree, id)
        case LibraryEnum.PROCEDURE:
          return getNodeName(this.procedureTree, id)
      }
    },
    getTreeByLib(lib: LibraryEnum) {
      switch (lib) {
        case LibraryEnum.NOTE:
          return this.noteTree
        case LibraryEnum.COURSE:
          return this.courseTree
        case LibraryEnum.PROCEDURE:
          return this.procedureTree
      }
    },
    /** 手动移入 */
    manualMoveInside(sourceId: string, targetId: string, lib: LibraryEnum) {
      const source = this.findNodeById(sourceId, this.getTreeByLib(lib))
      const target = this.findNodeById(targetId, this.getTreeByLib(lib))
      if (!source || !target || !source.parentId) return
      // 处理源节点
      const parent = this.findNodeById(source.parentId, this.getTreeByLib(lib))
      if (parent && parent.children) {
        parent.children.splice(
          parent.children.findIndex(i => i.id === source.id),
          1
        )
        if (parent.children.length === 0) {
          parent.isLeaf = true
          parent.id && this.removeExpandedKeys(parent.id, lib)
        }
      } else {
        // 处理父节点是根节点的情况（该方法可以囊括上一种情况，但会出现树未及时更新的情况，所以保留上一种情况）
        const [dragNodeSiblings, dragNodeIndex] = this.findSiblingsAndIndex(source, this.getTreeByLib(lib))
        if (dragNodeSiblings === null || dragNodeIndex === null) return
        const oldParentId = source.parentId
        dragNodeSiblings.splice(dragNodeIndex, 1)
        // console.log(dragNodeSiblings.length)
        // console.log(oldParentId)
        if (dragNodeSiblings.length === 0 && oldParentId) {
          const parentNode = this.findNodeById(oldParentId, this.getTreeByLib(lib))
          if (parentNode) {
            parentNode && (parentNode.isLeaf = true)
            parentNode.id && this.removeExpandedKeys(parentNode.id, lib)
          }
        }
      }

      // 处理目标节点
      if (target.children) {
        target.children.unshift(source)
        source.parentId = target.id
        // target.isLeaf = true
      }
      if (target.isLeaf) target.isLeaf = false
      if (target.id) {
        this.addExpandedKeys(target.id!, lib)
        // this.removeExpandedKeys(target.id, lib)
        // nextTick(() => {
        //   this.addExpandedKeys(target.id!, lib)
        // })
      }
    },

    isAncestorNode(sourceId: string, targetId: string, lib) {
      const source = this.findNodeById(sourceId, this.getTreeByLib(lib))
      const target = this.findNodeById(targetId, this.getTreeByLib(lib))
      if (!source || !target) return
      if (!target.parentId) return false
      if (!target.lib) throw '节点未设置 lib 属性'
      const { userStore } = useStore()
      const rootNodeId = userStore.getDirByLib(target.lib)
      let t = target
      while (t.parentId) {
        if (t.parentId === rootNodeId) return false
        if (t.parentId === source.id) return true
        if (!t.lib) throw '节点未设置 lib 属性'
        const last = this.findNodeById(t.parentId, this.getTreeByLib(t.lib))
        if (!last) return false
        t = last
      }
    },
    /** ------------------------------ ExpandKeys  --------------------------- */
    setExpandedKeys(expandedKeys: string[], lib: LibraryEnum) {
      // console.log('set:' + expandedKeys)
      switch (lib) {
        case LibraryEnum.NOTE:
          this.expandedKeys.note = expandedKeys
          break
        case LibraryEnum.COURSE:
          this.expandedKeys.course = expandedKeys
          break
        case LibraryEnum.PROCEDURE:
          this.expandedKeys.procedure = expandedKeys
          break
      }
    },
    removeExpandedKeys(expandedKey: string, lib: LibraryEnum) {
      // console.log('remove:' + expandedKey)
      switch (lib) {
        case LibraryEnum.NOTE:
          this.expandedKeys.note.splice(this.expandedKeys.note.indexOf(expandedKey), 1)
          break
        case LibraryEnum.COURSE:
          this.expandedKeys.course.splice(this.expandedKeys.course.indexOf(expandedKey), 1)
          break
        case LibraryEnum.PROCEDURE:
          this.expandedKeys.procedure.splice(this.expandedKeys.procedure.indexOf(expandedKey), 1)
          break
      }
    },
    addExpandedKeys(expandedKey: string, lib: LibraryEnum) {
      // console.log('add:' + expandedKey)
      switch (lib) {
        case LibraryEnum.NOTE:
          if (this.expandedKeys.note.some(key => key === expandedKey)) break
          this.expandedKeys.note.push(expandedKey)
          break
        case LibraryEnum.COURSE:
          if (this.expandedKeys.course.some(key => key === expandedKey)) break
          this.expandedKeys.course.push(expandedKey)
          break
        case LibraryEnum.PROCEDURE:
          if (this.expandedKeys.procedure.some(key => key === expandedKey)) break
          this.expandedKeys.procedure.push(expandedKey)
          break
      }
    },
    getExpandedKeys(lib: LibraryEnum) {
      switch (lib) {
        case LibraryEnum.NOTE:
          return this.expandedKeys.note
        case LibraryEnum.COURSE:
          return this.expandedKeys.course
        case LibraryEnum.PROCEDURE:
          return this.expandedKeys.procedure
      }
    }
  },
  getters: {
    getNoteTree(state) {
      return sortByCreateAt(state.noteTree, true)
    },
    getCourseTree(state) {
      return sortByCreateAt(state.courseTree, true)
    },
    getProcedureTree(state) {
      return sortByCreateAt(state.procedureTree, true)
    }
  }
})

/** 递归查询节点名称 */
function getNodeName(tree: TreeNode[] | undefined, targetId: string): string | undefined {
  if (!tree) return
  for (const node of tree) {
    if (node.id === targetId) {
      return node.label // 找到匹配的节点，返回名称
    }

    if (node.children && node.children.length > 0) {
      const childResult = getNodeName(node.children, targetId)
      if (childResult) {
        return childResult // 在子树中找到匹配的节点，返回名称
      }
    }
  }

  return // 未找到匹配的节点
}

/** 重置节点 */
function resetNodeById(tree: TreeNode[] | undefined, targetId: string) {
  if (!tree) return
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === targetId) {
      return tree[i].children ? ((tree[i].children = undefined), (tree[i].isLeaf = false)) : (tree[i].isLeaf = false)
    } else {
      tree[i].children && resetNodeById(tree[i].children, targetId)
    }
  }
}

function sortByCreateAt(data: TreeNode[], inverse = false) {
  return _.sortBy(data, item => {
    // 按最新创建时间排序
    return inverse ? -new Date(item.createAt!) : new Date(item.createAt!)
    // 按名称顺序
    // return item.label
  })
}

function sortByLabel(data: TreeNode[], inverse = false) {
  return _.sortBy(data, item => {
    // 按名称排序
    return inverse ? -item.label! : item.label
  })
}

/** ------------------------ 同步方案 (弃用) --------------------------- */
// reFecth(lib: LibraryEnum) {
//   this.fetch(lib)
// },
// set(lib: LibraryEnum) {
//   switch (lib) {
//     case LibraryEnum.NOTE:
//       if (this.noteTree.length === 0) this.fetch(lib)
//       break
//     case LibraryEnum.COURSE:
//       if (this.courseTree.length === 0) this.fetch(lib)
//       break
//     case LibraryEnum.PROCEDURE:
//       if (this.procedureTree.length === 0) this.fetch(lib)
//       break
//   }
// },
// fetch(lib: LibraryEnum) {
//   return creatorApi.folder.getTree<TreeNode[]>(lib).then(data => {
//     switch (lib) {
//       case LibraryEnum.NOTE:
//         this.noteTree = data
//         break
//       case LibraryEnum.COURSE:
//         this.courseTree = data
//         break
//       case LibraryEnum.PROCEDURE:
//         this.procedureTree = data
//         break
//     }
//   })
// }
