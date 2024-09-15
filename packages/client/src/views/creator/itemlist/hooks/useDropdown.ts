import { EditorLocation } from '@/components'
import useStore, { Subfile, Subfolder, TreeNode } from '@/store'
import { Ref, nextTick, ref, h, reactive, computed, Component } from 'vue'
// import * as UUID from 'uuid'
import { LibraryEnum } from '@/enums'
import { NButton, NIcon, NInput, NTree, useDialog, useMessage, useNotification } from 'naive-ui'
import { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { FolderForm } from '../../form'
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
// import { FolderTreeSelect } from '../../_common'
import CreateAdvancedForm  from './utils/CreateAdvancedForm.vue'
import { useShell } from '@/renderer'
import { CreatorShell } from '../..'
import { CreateNewFolderFilled, DriveFileMoveRtlFilled, DriveFileRenameOutlineFilled, ShareFilled } from '@vicons/material'
import dayjs from 'dayjs'

// type Target<T extends Subfolder | Subfile> = T

export function useItemListDropDown() {
  const { projectStore, folderStore, folderTreeStore, trashStore, clipboardStore, userStore } = useStore()
  const dialog = useDialog()
  const message = useMessage()
  const notification = useNotification()
  const account = computed(() => userStore.account)
  const hostname = computed(() => userStore.hostname)
  const shell = useShell<CreatorShell>()
  const dropdownState = reactive({
    lib: ref<LibraryEnum>(),
    type: ref<'file' | 'folder' | 'list'>(),
    target: ref<Subfolder | Subfile>(),
    xRef: ref<number>(0),
    yRef: ref<number>(0),
    showDropdownRef: ref<boolean>(false),
    showArrowRef: ref<boolean>(false),
    placementRef: ref<'bottom' | 'bottom-start'>('bottom-start')
  })
  const options = computed<DropdownMixedOption[]>(() => {
    let folderId = ''
    switch (dropdownState.type) {
      case 'file':
        folderId = (dropdownState.target as Subfile).folderId
        break
      case 'folder':
        folderId = (dropdownState.target as Subfolder).id
        break
      case 'list':
        folderId = folderStore.id
        break
    }
    const lib = dropdownState.lib

    const pastable = clipboardStore.file || clipboardStore.folder ? true : false

    if (folderStore.id === 'recently' && lib) {
      folderId = userStore.dir[lib]
    }

    return [
      // 新建
      {
        label: '新建',
        key: 'new-project',
        children: [
          {
            label: '文档',
            key: 'new-file',
            show: dropdownState.lib !== LibraryEnum.COURSE,
            props: {
              onClick: () => {
                // console.log([folderId, lib])
                if (!folderId || !lib) return
                createNewFile(folderId, lib, account.value, hostname.value)
              }
            }
          },
          {
            label: '文件夹',
            key: 'new-folder',
            show: folderStore.id !== 'recently',
            props: {
              onClick: () => {
                // console.log([folderId, lib])
                if (!folderId || !lib) return
                createNewFolder(folderId, lib)
              }
            }
          }
        ]
      },
      // 移动
      {
        label: '移动到',
        key: 'move',
        show: dropdownState.type && dropdownState.type !== 'list',
        props: {
          onClick: () => {
            if (dropdownState.type === 'file' && dropdownState.lib) moveFile(dropdownState.target as Subfile, dropdownState.lib)
            if (dropdownState.type === 'folder' && dropdownState.lib) moveFolder(dropdownState.target as Subfolder, dropdownState.lib)
          }
        }
      },
      // 复制
      {
        label: '复制',
        key: 'copy',
        show: dropdownState.type === 'file',
        props: {
          onClick: () => {
            if (dropdownState.type === 'file' && dropdownState.lib) {
              copyFile(dropdownState.target as Subfile, dropdownState.lib, false)
            }
          }
        }
      },

      // 剪切 (现有【移动】功能已经满足基本剪切功能，所以暂不实现剪切功能)
      // {
      //   label: '剪切',
      //   key: UUID.v4(),
      //   show: dropdownState.type === 'file',
      //   props: {
      //     onClick: () => {
      //       if (dropdownState.type === 'file' && dropdownState.lib) {
      //         copyFile(dropdownState.target as Subfile, dropdownState.lib, true)
      //       }
      //     }
      //   }
      // },
      // 粘贴
      {
        label: '粘贴',
        key: 'paste',
        disabled: !pastable,
        props: {
          onClick: () => {
            const folderId = dropdownState.type === 'folder' ? (dropdownState.target as Subfolder).id : undefined
            const folderName = dropdownState.type === 'folder'? (dropdownState.target as Subfolder).name : undefined
            if (dropdownState.lib) pasteFile(dropdownState.lib, folderId, folderName)
          }
        }
      },
      // 重命名
      {
        label: '重命名',
        key: 'rename',
        show: dropdownState.type && dropdownState.type === 'folder',
        props: {
          onClick: () => {
            if (dropdownState.type === 'folder' && dropdownState.lib) renameFolder(dropdownState.target as Subfolder, dropdownState.lib)
          }
        }
      },
      // 生成微课
      // {
      //   label: '生成课程项目',
      //   key: 'create-course',
      //   show: dropdownState.lib && dropdownState.lib === LibraryEnum.PROCEDURE && dropdownState.type === 'file',
      //   props: {
      //     onClick: () => {
      //       const file = dropdownState.target as Subfile
      //       createAdvancedProject(file.title, file.id, dropdownState.lib!)
      //     }
      //   }
      // },
      // 创建微课编辑文件
      {
        label: '创建工程项目',
        key: 'create-procedure',
        show: dropdownState.lib && dropdownState.lib === LibraryEnum.NOTE && dropdownState.type === 'file',
        props: {
          onClick: () => {
            const file = dropdownState.target as Subfile
            createAdvancedProject(file.title, file.id, dropdownState.lib!)
          }
        }
      },
      {
        label: '创建版本快照',
        key: 'create-snapshot',
        show: dropdownState.lib && dropdownState.lib !== LibraryEnum.COURSE  && dropdownState.type === 'file',
        props: {
          onClick: () => {
            const file = dropdownState.target as Subfile
            createSnapshot(file.id)
          }
        }
      },
      // 移除
      {
        label: '移除',
        key: 'remove',
        show: dropdownState.type && dropdownState.type !== 'list',
        props: {
          onClick: () => {
            if (dropdownState.type === 'file' && dropdownState.lib) removeFile(dropdownState.target as Subfile, dropdownState.lib)
            if (dropdownState.type === 'folder' && dropdownState.lib) removeFolder(dropdownState.target as Subfolder, dropdownState.lib)
          }
        }
      }
    ]
  })

  /** --------------------------------------------------------------------------------------------------- */
  const renderIcon = (component: Component) => {
    return h(NIcon, { component: component, size: 24 })
  }
  function handleContextmenu(ev: MouseEvent, type: 'folder' | 'file' | 'list', target?: Subfolder | Subfile) {
    const { folderStore } = useStore()
    dropdownState.lib = folderStore.lib
    dropdownState.type = type
    dropdownState.target = target
    ev.preventDefault()
    ev.stopPropagation()
    dropdownState.showDropdownRef = false
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = ev.clientX
      dropdownState.yRef = ev.clientY
      dropdownState.showArrowRef = false
      dropdownState.placementRef = 'bottom-start'
    })
  }

  function handleMoreAction(ev: MouseEvent, type: 'folder' | 'file', target?: Subfolder | Subfile) {
    const { folderStore } = useStore()
    dropdownState.lib = folderStore.lib
    dropdownState.type = type
    dropdownState.target = target
    ev.preventDefault()
    ev.stopPropagation()
    dropdownState.showDropdownRef = false
    const el = ev.target as HTMLElement
    const rect = el.getBoundingClientRect()
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = rect.x + 9
      dropdownState.yRef = rect.y + 15
      dropdownState.showArrowRef = true
      dropdownState.placementRef = 'bottom'
    })
  }

  function handleClickoutside() {
    dropdownState.showDropdownRef = false
  }
  function handleSelect() {
    dropdownState.showDropdownRef = false
  }

  /** 创建新文件（列表） */
  function createNewFile(folderId: string, lib: LibraryEnum, account: string, hostname: string) {
    projectStore.create(folderId, lib, account, hostname).then(newFile => {
      folderStore.addSubFile(newFile, folderId!, lib)
    })
    // 在文件夹上新建文档或文件夹时，会跳转到该文件夹内
    if (![folderId, 'recently'].includes(folderStore.id)) folderStore.fetchAndSet(folderId)
  }

  /** 创建新文件夹（列表） */
  function createNewFolder(folderId: string, lib: LibraryEnum, isCloud?: boolean) {
    const node = folderTreeStore.findNodeById(folderId, folderTreeStore.get(lib))
    dialog.create({
      icon: () => h(NIcon, { component: CreateNewFolderFilled, size: 24 }),
      title: '新建分支',
      content: () =>
        h(FolderForm, {
          belong: node?.label,
          lib: lib,
          submit: res => {
            if (node) {
              folderStore
                .createAndSet({
                  name: res.name,
                  desc: res.desc,
                  lib: res.lib,
                  parentId: node.id
                })
                .then(newNode => {
                  // 文件夹创建成功后会跳入文件夹内，并更新当前的文件夹树
                  if (node.isLeaf) {
                    node.isLeaf = false
                    node.children = undefined
                  } else {
                    folderTreeStore
                      .fetchChildren(node.id!)
                      .then(data => {
                        node.children = data
                      })
                      .catch(err => {
                        console.log(err)
                        message.error('新建文件夹分支失败！')
                      })
                  }
                })
                .catch(() => message.error('新建文件夹失败！'))
            }
            dialog.destroyAll()
          }
        }),
      maskClosable: true,
      action: () => ''
    })
  }

  /** 创建进阶项目 */
  function createAdvancedProject(title: string, projectId: string, lib: LibraryEnum) {
    if (lib === LibraryEnum.COURSE) return
    const advancedLib = lib === LibraryEnum.NOTE ? LibraryEnum.PROCEDURE : LibraryEnum.COURSE
    dialog.create({
      icon: () => renderIcon(EditorLocation),
      title: `${lib === LibraryEnum.NOTE ? '创建工程项目' : '创建课程项目'}`,
      content: () =>
        h(CreateAdvancedForm, {
          lib: advancedLib,
          title: title,
          onSubmit: folderId => {
            dialog.destroyAll()
            const msg = message.info('正在创建，请稍后...', { duration: 0 })
            projectStore.createBy({
              folderId,
              sourceId: projectId,
              lib: lib,
              account: account.value,
              hostname: hostname.value
            }).then(res => {
              msg.destroy()
              if(!res.account) res.account = account.value
              if(!res.hostname) res.hostname = hostname.value
              const n = notification.success({
                title: `创建${lib === LibraryEnum.NOTE ? '工程项目' : '课程动画'}成功！`,
                duration: 10000,
                meta: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                action: () => h(
                  NButton,
                  {
                    text: true,
                    type: 'primary',
                    onClick: () => {
                      shell.useWorkbench()
                      shell.workbench.setById({ id: res.id, lib: advancedLib, account: res.account, hostname: res.hostname })
                      n.destroy()
                    }
                  },
                  {
                    default: () => '跳转'
                  }
                ),
              })
              
            }).catch(err => {
              msg.destroy()
              message.error('创建失败')
            })
          }
        }),
      maskClosable: true,
      action: () => ''
    })
  }

  function createSnapshot(projectId: string) {
    projectStore.createSnapshot(projectId, account.value, hostname.value).then(res => {
      message.success('快照创建成功！')
    }).catch(err => {
      message.error('快照创建失败！')
    })
  }

  /** 修改文件夹名称 */
  function renameFolder(folder: Subfolder, lib: LibraryEnum) {
    const { folderTreeStore } = useStore()
    const folderNameVal = ref(folder.name)
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
        if (folderNameVal.value === folder.name) return
        if (folderNameVal.value === '') message.error('文件夹名称不能为空！')
        if (folderNameVal.value && folder.id) {
          folderTreeStore.rename(folderNameVal.value, folder.id).then(() => {
            folder.name = folderNameVal.value
            const node = folderTreeStore.findNodeById(folder.id, folderTreeStore.get(lib))
            if (node) node.label = folderNameVal.value
          })
        }
      }
    })
  }

  /** 移动文件夹 */
  function moveFolder(folder: Subfolder, lib: LibraryEnum) {
    const selectKey = ref('')
    dialog.create({
      icon: () => h(NIcon, { component: DriveFileMoveRtlFilled, size: 24 }),
      title: '移动文件夹',
      content: () =>
        h(NTree, {
          blockLine: true,
          data: folderTreeStore.getWithSort(lib),
          onLoad: (node: TreeNode) => {
            return new Promise<void>((resolve, reject) => {
              folderTreeStore
                .fetchChildren(node.id!)
                .then(data => {
                  node.children = data
                  resolve()
                })
                .catch(err => {
                  reject(err)
                })
            })
          },
          onUpdateSelectedKeys: (keys: Array<string>) => {
            selectKey.value = keys[0]
          }
        }),
      positiveText: '确定',
      negativeText: '取消',
      maskClosable: true,
      onPositiveClick: () => {
        if (selectKey.value === '' || selectKey.value === folder.parentId) return
        const sourceId = folder.id
        const targetId = selectKey.value
        // 不能移动到自身内部
        if (sourceId === targetId) return message.warning('不能将文件夹移动到其自己内部！')
        // 不能移动到子节点中
        const isAncestor = folderTreeStore.isAncestorNode(sourceId, targetId, lib)
        if (isAncestor) {
          message.warning('不能将节点移动到子节点中')
          return
        }
        const dropPosition = 'inside'
        folderTreeStore.moveFolder({ sourceId, targetId, dropPosition }).then(() => {
          folderStore.removeSubfolderById(folder.id)
          folderTreeStore.manualMoveInside(sourceId, targetId, lib)
        })
      }
    })
  }
  /** 移动文件 */
  function moveFile(file: Subfile, lib: LibraryEnum) {
    const selectKey = ref('')
    dialog.create({
      icon: () => h(NIcon, { component: DriveFileMoveRtlFilled, size: 24 }),
      title: '移动文件',
      content: () =>
        h(NTree, {
          blockLine: true,
          data: folderTreeStore.getWithSort(lib),
          onLoad: (node: TreeNode) => {
            return new Promise<void>((resolve, reject) => {
              folderTreeStore
                .fetchChildren(node.id!)
                .then(data => {
                  node.children = data
                  resolve()
                })
                .catch(err => {
                  reject(err)
                })
            })
          },
          onUpdateSelectedKeys: (keys: Array<string>) => {
            selectKey.value = keys[0]
          }
        }),
      positiveText: '确定',
      negativeText: '取消',
      maskClosable: true,
      onPositiveClick: () => {
        if (selectKey.value === '' || selectKey.value === file.folderId) return
        projectStore.move(file.id, selectKey.value, account.value, hostname.value).then(() => {
          folderStore.removeSubfileById(file.id)
        })
      }
    })
  }

  /** 复制文件 */
  function copyFile(file: Subfile, lib: LibraryEnum, isCut: boolean) {
    clipboardStore.copyFile(file.id, lib, isCut, account.value, hostname.value)
  }

  /** 粘贴文件 */
  function pasteFile(lib: LibraryEnum, folderId?: string, folderName?: string) {
    clipboardStore.pasteFile(folderId || folderStore.id, lib, account.value, hostname.value)?.then(() => {
      if (!folderId) {
        folderStore.fetchAndSet(folderStore.id)
      } else {
        message.success(`已将文件粘贴至 ${folderName} 中！`)
      }
    }).catch(err => {
      message.error(err)
    })
  }


  /** 移除文件夹 */
  function removeFolder(folder: Subfolder, lib: LibraryEnum) {
    folderTreeStore.remove(folder.id, lib)
  }
  /** 移除文件 */
  function removeFile(file: Subfile, lib: LibraryEnum) {
    projectStore.remove(file.id, account.value, hostname.value).then(() => {
      folderStore.removeSubfileById(file.id) // 1. 项目列表移除被移除项目
      file && trashStore.add(trashStore.subFileToTrashData(file), lib) // 2. 回收站列表增加被移除项目
    })
  }

  // /** 发布作品 */
  // function submitCreation(title: string, penName?: string, email?: string, website?: string) {
  //   dialog.create({
  //     icon: () => h(NIcon, { component: ShareFilled, size: 24 }),
  //     title: '推送',
  //     content: () => h(SubmissionForm, {
  //       penName,
  //       title,
  //       email,
  //       website,
  //       submit: (res) => {
  //         //
  //       } 
  //     })
  //   })
  // }

  return {
    dropdownState,
    options,
    handleContextmenu,
    handleMoreAction,
    handleClickoutside,
    handleSelect
  }
}
