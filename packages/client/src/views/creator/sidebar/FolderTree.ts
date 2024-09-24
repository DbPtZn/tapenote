import { CoffeeMaker, Notebook, PlayLesson } from '@/components'
import { LibraryEnum, RouteNameEnum } from '@/enums'
import { TreeDropInfo, NText, NButton, NDropdown, useDialog, useMessage, NInput, NIcon } from 'naive-ui'
import { Component, VNodeChild, h, ref } from 'vue'
// import * as UUID from 'uuid'
import { FolderForm } from '../form'
import { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import useStore, { TreeNode } from '@/store'
import { Subject, Observable } from '@tanbo/stream'
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import { useShell } from '@/renderer'
import { CreatorShell } from '../shell'
import { CreateNewFolderFilled, DriveFileRenameOutlineFilled, MoreHorizFilled } from '@vicons/material'
import router from '@/router'
import { useI18n } from 'vue-i18n'
interface CustomTreeDropInfo extends TreeDropInfo {
  node: TreeNode
  dragNode: TreeNode
}
export class FolderTree {
  private dialog: DialogApiInjection
  private message: MessageApiInjection
  private t: any
  collapseOptions: { id: string; icon: () => VNodeChild; label: string; name: LibraryEnum }[]
  private createFolderEvent!: Subject<any>
  onCreateFolder!: Observable<TreeNode>

  constructor() {
    this.createFolderEvent = new Subject()
    this.onCreateFolder = this.createFolderEvent.asObservable()

    const { userStore } = useStore()
    const { t } = useI18n()
    this.t = t
    this.dialog = useDialog()
    this.message = useMessage()
    this.collapseOptions = [
      {
        id: userStore.dir.note || '',
        label: `${t('note')}`,
        icon: () => this.renderIcon(Notebook),
        name: LibraryEnum.NOTE
      },
      {
        id: userStore.dir.course || '',
        label: `${t('course')}`,
        icon: () => this.renderIcon(PlayLesson),
        name: LibraryEnum.COURSE
      },
      {
        id: userStore.dir.procedure || '',
        label: `${t('procedure')}`,
        icon: () => this.renderIcon(CoffeeMaker),
        name: LibraryEnum.PROCEDURE
      }
    ]
  }
  private renderIcon(component: Component) {
    return h(NIcon, { component: component, size: 24 })
  }
  getTreeData(lib: LibraryEnum): TreeNode[] {
    const { folderTreeStore } = useStore()
    return folderTreeStore.get(lib)
  }
  setTreeData(treeData: TreeNode[], lib: LibraryEnum) {
    const { folderTreeStore } = useStore()
    folderTreeStore.set(treeData, lib)
  }
  private moveNode(sourceId: string, targetId: string, dropPosition: 'inside' | 'before' | 'after') {
    const { folderTreeStore } = useStore()
    return folderTreeStore.moveFolder({ sourceId, targetId, dropPosition })
  }
  private findSiblingsAndIndex(node: TreeNode, nodes?: TreeNode[]): [TreeNode[], number] | [null, null] {
    const { folderTreeStore } = useStore()
    return folderTreeStore.findSiblingsAndIndex(node, nodes)
  }
  private findNodeById(id: string, nodes?: TreeNode[]) {
    const { folderTreeStore } = useStore()
    return folderTreeStore.findNodeById(id, nodes)
  }
  /** 放置 */
  handleDrop({ node: target, dragNode: source, dropPosition, event }: CustomTreeDropInfo, lib: LibraryEnum) {
    const { folderTreeStore } = useStore()
    const [dragNodeSiblings, dragNodeIndex] = this.findSiblingsAndIndex(source, this.getTreeData(lib))
    if (dragNodeSiblings === null || dragNodeIndex === null) return
    const oldParentId = source.parentId
    dragNodeSiblings.splice(dragNodeIndex, 1)
    if (dragNodeSiblings.length === 0 && oldParentId) {
      const parentNode = this.findNodeById(oldParentId, this.getTreeData(lib))
      if (parentNode) {
        parentNode.isLeaf = true
        // 需将 expandedKeys 去掉，否则会出现重复的 expandedKeys，产生 bug
        parentNode.id && folderTreeStore.removeExpandedKeys(parentNode.id, lib)
      }
    }
    if (dropPosition === 'inside') {
      if (target.children) {
        target.children.unshift(source)
        source.parentId = target.id
      }
      if (target.isLeaf) target.isLeaf = false
    } else if (dropPosition === 'before') {
      const [nodeSiblings, nodeIndex] = this.findSiblingsAndIndex(target, this.getTreeData(lib))
      if (nodeSiblings === null || nodeIndex === null) return
      nodeSiblings.splice(nodeIndex, 0, source)
      source.parentId = target.parentId
    } else if (dropPosition === 'after') {
      const [nodeSiblings, nodeIndex] = this.findSiblingsAndIndex(target, this.getTreeData(lib))
      if (nodeSiblings === null || nodeIndex === null) return
      nodeSiblings.splice(nodeIndex + 1, 0, source)
      source.parentId = target.parentId
    }
    this.moveNode(source.id!, target.id!, dropPosition).then(() => {
      const { folderStore } = useStore()
      if (folderStore.id === source.parentId) {
        folderStore.fetchAndSet(source.parentId)
      } else if (folderStore.id === oldParentId) {
        folderStore.fetchAndSet(oldParentId)
      }
    })
    // this.setTreeData(this.getTreeData(lib), lib)
  }
  /** 节点标签名 */
  renderLabel({ option }: { option: TreeNode }) {
    return h(
      NText,
      {
        class: 'tree-label',
        style: {
          pointerEvents: 'none'
        },
        depth: 2
      },
      { default: () => `${option.label}` }
    )
  }
  /** 节点按钮 */
  renderSuffix({ option }: { option: TreeNode }, slotName: LibraryEnum) {
    return h(
      NButton,
      {
        text: true,
        type: 'primary',
        onClick: ev => {
          ev.stopPropagation()
        }
      },
      {
        default: () =>
          h(
            NDropdown,
            {
              trigger: 'click',
              showArrow: true,
              options: this.treeNodeDropDownOptions(slotName, option)
            },
            { default: () => h(NIcon, { class: 'tree-suffix', component: MoreHorizFilled, size: '24' }) }
          )
      }
    )
  }
  /** 节点下拉列表选项 */
  private treeNodeDropDownOptions(lib: LibraryEnum, node: TreeNode) {
    return this.createDropDownOptions(lib, node, this.dialog)
  }
  private createFolder(config: any, node: TreeNode) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const { folderStore, folderTreeStore } = useStore()
    folderStore
      .createAndSet({
        name: config.name,
        desc: config.desc,
        lib: config.lib,
        // isCloud: config.isCloud,
        parentId: node.id
      })
      .then(newNode => {
        if (node.isLeaf) {
          node.isLeaf = false
          node.children = undefined
        } else {
          folderTreeStore
            .fetchChildren(node.id!)
            .then(data => {
              node.children = data
              that.createFolderEvent.next(node)
              this.message.success(that.t('sidebar.create_folder_success'))
            })
            .catch(err => {
              console.log(err)
              this.message.error(that.t('sidebar.create_folder_fail'))
            })
        }
      })
  }

  private handleCreateFile(file: any, folderId: string, lib: LibraryEnum) {
    const { folderStore, settingStore, userStore } = useStore()
    const shell = useShell<CreatorShell>()
    // 更新项目列表
    folderStore.addSubFile(file, folderId!, lib)
    router.push({ name: RouteNameEnum.HOME }).then(() => {
      // 在工作区打开文件
      shell.useWorkbench()
      shell.workbench.setById(
        {
          id: file.id,
          lib,
          account: userStore.account,
          hostname: userStore.hostname
        }
      )
    })
    // 打开对应文件夹
    if (!folderStore.id) {
      folderStore.fetchAndSet(folderId)
    }
  }

  createDropDownOptions = (lib: LibraryEnum, node: TreeNode, dialog: DialogApiInjection) => {
    // const that = this
    const folderId = node.id!
    const { projectStore, folderStore, folderTreeStore, userStore, } = useStore()
    return [
      {
        label: '新建文档',
        key: 'create-new-file',
        show: lib !== LibraryEnum.COURSE,
        props: {
          onClick: () => {
            console.log('新建文档'+lib)
            projectStore.create(node.id!, lib, userStore.account, userStore.hostname).then(newFile => {
              this.handleCreateFile(newFile, folderId, lib)
            })
          }
        }
      },
      {
        label: '新建文件夹',
        key: 'create-new-folder',
        props: {
          onClick: () => {
            dialog.create({
              icon: () => h(NIcon, { component: CreateNewFolderFilled, size: 24 }),
              title: '新建分支',
              content: () =>
                h(FolderForm, {
                  belong: node.label,
                  lib: lib,
                  isCloud: node.isCloud,
                  submit: (res) => {
                    this.createFolder(res, node)
                    dialog.destroyAll()
                  }
                }),
              positiveText: '确定',
              negativeText: '不确定',
              maskClosable: true,
              action: () => ''
            })
          }
        }
      },
      {
        label: '移动',
        key: 'move',
        show: false,
        props: {
          onClick: () => {
            // 暂不实现
          }
        }
      },
      {
        label: '重命名',
        key: 'rename',
        props: {
          onClick: () => {
            const folderNameVal = ref(node.label)
            dialog.create({
              icon: () => h(NIcon, { component: DriveFileRenameOutlineFilled, size: 24 }),
              title: '文件夹重命名',
              content: () =>
                h(NInput, {
                  type: 'text',
                  placeholder: '输入新名称',
                  maxlength: 32,
                  showCount: true,
                  value: folderNameVal.value,
                  onInput: value => {
                    folderNameVal.value = value
                  }
                }),
              positiveText: '确定',
              negativeText: '取消',
              maskClosable: true,
              onPositiveClick: () => {
                if (folderNameVal.value === node.label) return
                if (folderNameVal.value === '') this.message.error('文件夹名称不能为空！')
                if (folderNameVal.value && node.id) {
                  folderTreeStore.rename(folderNameVal.value, node.id).then(() => {
                    node.label = folderNameVal.value
                    if (folderStore.id === node.id) {
                      folderStore.name = folderNameVal.value!
                    } else if (folderStore.id === node.parentId && folderStore.subfolders) {
                      folderStore.subfolders[folderStore.subfolders.findIndex(item => item.id === node.id)].name = folderNameVal.value!
                    }
                  })
                }
              }
            })
          }
        }
      },
      {
        label: '移除',
        key: 'remove',
        props: {
          onClick: () => {
            this.removeNode(node, lib)
          }
        }
      }
    ]
  }

  private removeNode(node: TreeNode, lib: LibraryEnum) {
    const folderId = node.id!
    const { folderTreeStore } = useStore()
    folderTreeStore.remove(folderId, lib)
  }
}























  // /** 笔记库下拉列表选项配置 */
  // private noteDropDownOptions(lib: LibraryEnum, node: TreeNode, dialog: DialogApiInjection) {
  //   // eslint-disable-next-line @typescript-eslint/no-this-alias
  //   const that = this
  //   const folderId = node.id!
  //   const { noteStore, folderStore, folderTreeStore, userStore, trashStore } = useStore()
  //   return [
  //     {
  //       label: '新建文档',
  //       key: UUID.v4(),
  //       props: {
  //         onClick: () => {
  //           noteStore.create(node.id!, userStore.account, userStore.hostname).then(newFile => {
  //             this.handleCreateFile(newFile, folderId, LibraryEnum.NOTE)
  //           })
  //         }
  //       }
  //     },
  //     {
  //       label: '新建文件夹',
  //       key: UUID.v4(),
  //       props: {
  //         onClick: () => {
  //           dialog.create({
  //             icon: () => h(DpzIcon, { icon: `${MaterialTypeEnum.FILLED}create_new_folder`, size: 24 }),
  //             title: '新建分支',
  //             content: () =>
  //               h(FolderForm, {
  //                 lib: lib,
  //                 isCloud: node.isCloud,
  //                 submit(res) {
  //                   that.createFolder(res, node)
  //                   dialog.destroyAll()
  //                 }
  //               }),
  //             positiveText: '确定',
  //             negativeText: '不确定',
  //             maskClosable: true,
  //             action: () => ''
  //           })
  //         }
  //       }
  //     },
  //     {
  //       label: '移动',
  //       key: UUID.v4(),
  //       show: false,
  //       props: {
  //         onClick: () => {
  //           //
  //         }
  //       }
  //     },
  //     {
  //       label: '重命名',
  //       key: UUID.v4(),
  //       props: {
  //         onClick: () => {
  //           const folderNameVal = ref(node.label)
  //           dialog.create({
  //             icon: () => h(DpzIcon, { icon: `${MaterialTypeEnum.FILLED}drive_file_rename_outline`, size: 24 }),
  //             title: '文件夹重命名',
  //             content: () =>
  //               h(NInput, {
  //                 type: 'text',
  //                 placeholder: '输入新名称',
  //                 maxlength: 32,
  //                 showCount: true,
  //                 value: folderNameVal.value,
  //                 onInput: value => {
  //                   folderNameVal.value = value
  //                 }
  //               }),
  //             positiveText: '确定',
  //             negativeText: '取消',
  //             maskClosable: true,
  //             onPositiveClick: () => {
  //               if (folderNameVal.value === node.label) return
  //               if (folderNameVal.value === '') this.message.error('文件夹名称不能为空！')
  //               if (folderNameVal.value && node.id) {
  //                 folderTreeStore.rename(folderNameVal.value, node.id).then(() => {
  //                   node.label = folderNameVal.value
  //                   if (folderStore.id === node.id) {
  //                     folderStore.name = folderNameVal.value!
  //                   } else if (folderStore.id === node.parentId && folderStore.subfolders) {
  //                     folderStore.subfolders[folderStore.subfolders.findIndex(item => item.id === node.id)].name = folderNameVal.value!
  //                   }
  //                 })
  //               }
  //             }
  //           })
  //         }
  //       }
  //     },
  //     {
  //       label: '移除',
  //       key: UUID.v4(),
  //       props: {
  //         onClick: () => {
  //           this.removeNode(node, lib)
  //         }
  //       }
  //     }
  //   ]
  // }

  // /** 微课库下拉列表选项配置 */
  // private courseDropDownOptions(lib: LibraryEnum, node: TreeNode, dialog: DialogApiInjection) {
  //   // eslint-disable-next-line @typescript-eslint/no-this-alias
  //   const that = this
  //   return [
  //     {
  //       label: '新建文件夹',
  //       key: UUID.v4(),
  //       props: {
  //         onClick: () => {
  //           dialog.create({
  //             icon: () => h(DpzIcon, { icon: `${MaterialTypeEnum.FILLED}create_new_folder`, size: 24 }),
  //             title: '新建分支',
  //             content: () =>
  //               h(FolderForm, {
  //                 lib: lib,
  //                 isCloud: node.isCloud,
  //                 submit(res) {
  //                   that.createFolder(res, node)
  //                   dialog.destroyAll()
  //                 }
  //               }),
  //             positiveText: '确定',
  //             negativeText: '不确定',
  //             maskClosable: true,
  //             action: () => ''
  //           })
  //         }
  //       }
  //     },
  //     {
  //       label: '移除',
  //       key: UUID.v4(),
  //       props: {
  //         onClick: () => {
  //           console.log('456')
  //         }
  //       }
  //     }
  //   ]
  // }

  // /** 工程项目库下拉列表选项配置 */
  // private procedureDropDownOptions(lib: LibraryEnum, node: TreeNode, dialog: DialogApiInjection) {
  //   // eslint-disable-next-line @typescript-eslint/no-this-alias
  //   const that = this
  //   const folderId = node.id!
  //   const { procedureStore, folderStore, folderTreeStore, userStore, trashStore } = useStore()
  //   return [
  //     {
  //       label: '新建',
  //       key: UUID.v4(),
  //       props: {
  //         onClick: () => {
  //           procedureStore.create(node.id!, userStore.account, userStore.hostname).then(newFile => {
  //             this.handleCreateFile(newFile, folderId, LibraryEnum.PROCEDURE)
  //           })
  //         }
  //       }
  //     },
  //     {
  //       label: '新建文件夹',
  //       key: UUID.v4(),
  //       props: {
  //         onClick: () => {
  //           dialog.create({
  //             icon: () => h(DpzIcon, { icon: `${MaterialTypeEnum.FILLED}create_new_folder`, size: 24 }),
  //             title: '新建分支',
  //             content: () =>
  //               h(FolderForm, {
  //                 lib: lib,
  //                 submit(res) {
  //                   that.createFolder(res, node)
  //                   dialog.destroyAll()
  //                 }
  //               }),
  //             positiveText: '确定',
  //             negativeText: '不确定',
  //             maskClosable: true,
  //             action: () => ''
  //           })
  //         }
  //       }
  //     },
  //     {
  //       label: '移动',
  //       key: UUID.v4(),
  //       props: {
  //         onClick: () => {
  //           console.log('456')
  //         }
  //       }
  //     },
  //     {
  //       label: '移除',
  //       key: UUID.v4(),
  //       props: {
  //         onClick: () => {
  //           this.removeNode(node, lib)
  //         }
  //       }
  //     }
  //   ]
  // }