import { FolderOpenFilled, CoffeeMaker, Notebook, PlayLesson } from '@/components'
import { LibraryEnum } from '@/enums'
import { DeleteRound, LockClockRound } from '@vicons/material'
import useStore from '@/store'
import { NIcon, NText, useDialog, useMessage } from 'naive-ui'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { Component, h, nextTick, reactive, ref } from 'vue'
import { CreatorShell } from '../../shell'
import { useShell } from '@/renderer'
import { FolderForm } from '../../form'
import { Subject } from '@tanbo/stream'
import { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import { SettingsFilled, BrowserUpdatedFilled, LogOutFilled, FolderRound, NoteRound, CreateNewFolderFilled  } from '@vicons/material'

const createFolderEvent = new Subject<LibraryEnum>()
const onCreateFolder = createFolderEvent.asObservable()
export function useSidebarDropDown() {
  const { userListStore, userStore, folderStore } = useStore()
  const dialog = useDialog()
  const message = useMessage()
  const shell = useShell<CreatorShell>()
  let current: HTMLElement | null = null
  const dropdownState = reactive({
    lib: ref<LibraryEnum>(),
    type: ref<'file' | 'folder' | 'list'>(),
    xRef: ref<number>(0),
    yRef: ref<number>(0),
    showDropdownRef: ref<boolean>(false),
    showArrowRef: ref<boolean>(false),
    widthRef: ref<number | 'trigger' | undefined>('trigger'),
    placementRef: ref<'bottom' | 'bottom-start' | 'right'>('bottom-start')
  })
  const options = ref<DropdownMixedOption[]>([])

  /** 用户按钮 */
  function handleUserDropdown(ev: MouseEvent) {
    const target = ev.target as HTMLElement
    if (current === target)  {
      dropdownState.showArrowRef = false
      current = null
      return 
    }
    current = target
    const rect = target.getBoundingClientRect()
    dropdownState.showDropdownRef = false
    dropdownState.widthRef = rect.width
    dropdownState.placementRef = 'bottom'
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = rect.x
      dropdownState.yRef = rect.y + rect.height
    })
    options.value = [
      {
        type: 'render',
        render: renderCustomHeader
      },
      {
        type: 'divider'
      },
      {
        label: '账户配置',
        key: 'settings',
        icon: () => h(NIcon, { component: SettingsFilled, size: 24 }),
        props: {
          onClick: () => {
            shell.useAdmin()
          }
        }
      },
      {
        label: '统计',
        key: 'count',
        show: false,
        icon: () => h(NIcon, { component: SettingsFilled, size: 24 }),
        props: {
          onClick: () => {
            shell.workbench.useDefault()
          }
        }
      },
      {
        label: '检查与更新',
        disabled: true,
        show: false,
        key: 'checkAndUpdate',
        icon: () => h(NIcon, { component: BrowserUpdatedFilled, size: 24 }),
        props: {
          onClick: () => {
            //
          }
        }
      },
      {
        label: '登出',
        key: 'logout',
        icon: () => h(NIcon, { component: LogOutFilled, size: 24 }),
        props: {
          onClick: () => {
            userListStore.logout(userStore.account, userStore.hostname)
          }
        }
      }
    ]
  }
  /** 主按钮 */
  function handleMasterDropdown(ev: MouseEvent) {
    const target = ev.target as HTMLElement
    if (current === target)  {
      dropdownState.showArrowRef = false
      current = null
      return 
    }
    current = target
    const rect = target.getBoundingClientRect()
    dropdownState.showDropdownRef = false
    dropdownState.widthRef = undefined
    dropdownState.placementRef = 'bottom'
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = rect.x + rect.width / 2
      dropdownState.yRef = rect.y + rect.height
    })
    options.value = [
      {
        key: 'create-new-folder',
        icon: () => h(NIcon, { component: FolderRound, size: 24 }),
        label: '新建文件夹',
        props: {
          onClick: () => {
            createNewFolder(dialog)
          }
        }
      },
      {
        key: 'create-new-map',
        disabled: true,
        icon: () => h(NIcon, { component: NoteRound, size: 24 }),
        label: '新建知识图谱',
        props: {
          onClick: () => {
            //
          }
        }
      }
    ]
  }

  /** 最近编辑 */
  function handleRecentContextmenu(ev: MouseEvent) {
    const target = ev.target as HTMLElement
    if (current === target)  {
      dropdownState.showArrowRef = false
      current = null
      return 
    }
    current = target
    // const rect = target.getBoundingClientRect()
    dropdownState.showDropdownRef = false
    dropdownState.widthRef = undefined
    dropdownState.placementRef = 'right'
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = ev.x
      dropdownState.yRef = ev.y
    })
    options.value = [
      {
        key: LibraryEnum.NOTE,
        icon: () => h(NIcon, { component: Notebook, size: 24 }),
        label: '笔记',
        props: {
          onClick: () => {
            if (folderStore.id !== 'recently' || folderStore.lib !== LibraryEnum.NOTE) {
              folderStore.fetchRecentlyAndSet({
                lib: LibraryEnum.NOTE,
                skip: 0,
                take: 8
              })
            }
          }
        }
      },
      {
        key: LibraryEnum.COURSE,
        icon: () => h(NIcon, { component: PlayLesson, size: 24 }),
        label: '课程',
        props: {
          onClick: () => {
            if (folderStore.id !== 'recently' || folderStore.lib !== LibraryEnum.COURSE) {
              folderStore.fetchRecentlyAndSet({
                lib: LibraryEnum.COURSE,
                skip: 0,
                take: 8
              })
            }
          }
        }
      },
      {
        key: LibraryEnum.PROCEDURE,
        icon: () => h(NIcon, { component: CoffeeMaker, size: 24 }),
        label: '工程',
        props: {
          onClick: () => {
            if (folderStore.id !== 'recently' || folderStore.lib !== LibraryEnum.PROCEDURE) {
              folderStore.fetchRecentlyAndSet({
                lib: LibraryEnum.PROCEDURE,
                skip: 0,
                take: 8
              })
            }
          }
        }
      }
    ]
  }

  /** 更多 */
  function handleMoreDropdown(ev: MouseEvent) {
    const target = ev.target as HTMLElement
    if (current === target)  {
      dropdownState.showArrowRef = false
      current = null
      return 
    }
    current = target
    const rect = target.getBoundingClientRect()
    dropdownState.showDropdownRef = false
    dropdownState.widthRef = undefined
    dropdownState.placementRef = 'bottom'
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = rect.x + rect.width / 2
      dropdownState.yRef = rect.y + rect.height
    })
    options.value = [
      {
        key: 'trash',
        icon: () => h(NIcon, { component: DeleteRound, size: 24 }),
        label: '回收站',
        props: {
          onClick: () => {
            shell.useBin()
          }
        }
      },
      {
        key: 'secret',
        disabled: true,
        icon: () => h(NIcon, { component: LockClockRound, size: 24 }),
        label: '加密文档',
        props: {
          onClick: () => {
            //
          }
        }
      }
    ]
  }

  /** 折叠面板按钮 */
  function handleCollapseDropdown(ev: MouseEvent, lib: LibraryEnum) {
    const target = ev.target as HTMLElement
    if (current === target)  {
      dropdownState.showArrowRef = false
      current = null
      return 
    }
    current = target
    const rect = target.getBoundingClientRect()
    dropdownState.showDropdownRef = false
    dropdownState.widthRef = undefined
    dropdownState.placementRef = 'bottom'
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = rect.x + rect.width / 2
      dropdownState.yRef = rect.y + rect.height
    })
    options.value = [
      {
        key: 'read-more',
        label: '打开',
        icon: renderIcon(FolderOpenFilled),
        props: {
          onClick: () => {
            folderStore.fetchAndSet(userStore.getDirByLib(lib))
          }
        }
      },
      {
        key: 'create-new-folder',
        icon: () => h(NIcon, { component: FolderRound, size: 24 }),
        label: '新建文件夹',
        props: {
          onClick: () => {
            createNewFolder(dialog, lib)
          }
        }
      },
      // {
      //   key: 'count',
      //   label: '统计',
      //   disabled: true,
      //   props: {
      //     onClick: () => {}
      //   }
      // },
    ]
  }

  /** 树形节点按钮 */
  // 绑定在树形组件内部，暂不抽离处理



  function renderIcon(component: Component) {
    return () => h(NIcon, { component: component, size: 24 })
  }
  function handleClickoutside() {
    dropdownState.showDropdownRef = false
    setTimeout(() => {
      // current 用于判断是否重复点击当前元素，在 dropdown 关闭后应该置为 null
      // 不能同步设置为 null，因为 dropdown 关闭时，需要 current 判断是否重复点击
      current = null
    }, 0)
  }
  function handleSelect() {
    dropdownState.showDropdownRef = false
    setTimeout(() => {
      current = null
    }, 0)
  }

  return {
    dropdownState,
    options,
    // handleContextmenu,
    handleUserDropdown,
    handleMasterDropdown,
    handleRecentContextmenu,
    handleMoreDropdown,
    handleCollapseDropdown,
    handleClickoutside,
    handleSelect,
    onCreateFolder
  }
}

function createNewFolder(dialog: DialogApiInjection, lib?: LibraryEnum) {
  const { userStore, folderStore } = useStore()
  dialog.create({
    icon: () => h(NIcon, { component: CreateNewFolderFilled, size: 24 }),
    title: '新建文件夹',
    content: () =>
      h(FolderForm, {
        lib,
        submit(res) {
          dialog.destroyAll()
          folderStore
            .createAndSet({
              name: res.name,
              desc: res.desc,
              lib: res.lib,
              parentId: userStore.getDirByLib(res.lib)
            })
            .then(() => {
              createFolderEvent.next(res.lib)
            })
        }
      }),
    maskClosable: true
  })
}

function renderCustomHeader() {
  const { userStore } = useStore()
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; padding: 8px 12px;'
    },
    [
      h('div', null, [
        h('div', null, [
          h(
            NText,
            { depth: 2, style: { display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
            { default: () => userStore.account || '' } // 用户账号
          )
        ]),
        h('div', { style: 'font-size: 12px;' }, [
          h(
            NText,
            { depth: 3, style: { display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
            { default: () => userStore.desc } // 用户简介
          )
        ])
      ])
    ]
  )
}
