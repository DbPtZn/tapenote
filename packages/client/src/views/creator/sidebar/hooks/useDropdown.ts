import { FolderOpenFilled, CoffeeMaker, Notebook, PlayLesson } from '@/components'
import { LibraryEnum } from '@/enums'
// import { DeleteRound, LockClockRound } from '@vicons/material'
import useStore from '@/store'
import { DropdownOption, NIcon, NLog, NText, useDialog, useMessage, useModal } from 'naive-ui'
import { Component, computed, h, nextTick, reactive, ref } from 'vue'
import { CreatorShell } from '../../shell'
import { useShell } from '@/renderer'
import { FolderForm } from '../../form'
import { Subject } from '@tanbo/stream'
import { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
// import { SettingsFilled, OutputFilled, BrowserUpdatedFilled, LogOutFilled, FolderRound, NoteRound, CreateNewFolderFilled } from '@vicons/material'
import { pack } from '../../_utils'
import iconv from 'iconv-lite'
import JSZip from 'jszip'
import dayjs from 'dayjs'
import { Icon } from '@iconify/vue'
import { useParser } from '../../_utils/parse'
import { useI18n } from 'vue-i18n'
import { PaymentView } from '@/views'
import { NConfig } from '../../_common'
type Folder = ReturnType<typeof useStore>['folderStore']['$state']
const createFolderEvent = new Subject<LibraryEnum>()
const onCreateFolder = createFolderEvent.asObservable()
function convertFlatToTree(flatStructure) {
  const treeStructure = {}

  for (const key in flatStructure) {
    const path = key.split('/')
    let currentNode = treeStructure

    for (let i = 0; i < path.length - 1; i++) {
      const folder = path[i]
      if (!currentNode[folder]) {
        // 如果当前节点下没有该文件夹，则创建一个空对象
        currentNode[folder] = {}
      }
      currentNode = currentNode[folder] // 移动到下一级目录
    }

    const filename = path[path.length - 1]
    currentNode[filename] = flatStructure[key]
  }

  return treeStructure
}
export function useSidebarDropDown() {
  const { userListStore, userStore, folderStore, folderTreeStore, projectStore } = useStore()
  const dialog = useDialog()
  const modal = useModal()
  const message = useMessage()
  const { t } = useI18n()
  const shell = useShell<CreatorShell>()
  let current: HTMLElement | null = null
  const dropdownState = reactive({
    lib: ref<LibraryEnum>(),
    target: '' as 'user' | 'master' | 'recently' | 'more' | 'collapse',
    xRef: ref<number>(0),
    yRef: ref<number>(0),
    showDropdownRef: ref<boolean>(false),
    showArrowRef: ref<boolean>(false),
    widthRef: ref<number | 'trigger' | undefined>('trigger'),
    placementRef: ref<'bottom' | 'bottom-start' | 'right'>('bottom-start')
  })
  const options = computed<DropdownOption[]>(() => {
    switch (dropdownState.target) {
      case 'user':
        return [
          {
            type: 'render',
            render: renderCustomHeader
          },
          {
            type: 'divider'
          },
          {
            label: t('sidebar.settings'),
            key: 'settings',
            icon: () => h(Icon, { icon: 'ic:outline-settings', height: 24 }),
            props: {
              onClick: () => {
                shell.useAdmin()
              }
            }
          },
          {
            label: '升级订阅',
            key: 'vip',
            icon: () => h(Icon, { icon: 'icon-park-outline:vip-one', height: 24 }),
            props: {
              onClick: () => {
                dialog.create({
                  icon: () => h(Icon, { icon: 'icon-park-outline:vip-one', height: 24 }),
                  title: '升级订阅',
                  style: { width: '60vw', boxSizing: 'border-box' },
                  content: () => h(NConfig, {}, {
                    default: () => h(PaymentView, {
                      account: userStore.account,
                    })
                  })
                })
              }
            }
          },
          {
            label: '统计',
            key: 'count',
            show: false,
            icon: () => h(Icon, { icon: 'mingcute:counter-2-line', height: 24 }),
            props: {
              onClick: () => {
                shell.workbench.useDefault()
              }
            }
          },
          {
            label: t('sidebar.input'),
            key: 'input',
            icon: () => h(Icon, { icon: 'material-symbols:input-circle', height: 24 }),
            props: {
              onClick: () => {
                const targetFolderId = userStore.dir.note // 设置导入的根目录
                const jszip = new JSZip()
                const regex = /[^/]+(?=\/(?:[^/]+)*$)/ // 提取目录名正则
                const { parseContent } = useParser(userStore.account, userStore.hostname)
                const input = document.createElement('input')
                input.type = 'file'
                input.click()
                input.oninput = e => {
                  if (!input.files || input.files.length === 0) {
                    alert('请先选择一个文件。')
                    return
                  }
                  const logRef = ref()
                  const log = ref<string[]>([])
                  function addLog(txt: string) {
                    log.value.push(txt)
                    logRef.value?.scrollTo({ position: 'bottom', silent: true })
                  }
                  modal.create({
                    maskClosable: false,
                    title: '正在导入文件,请不要关闭该窗口...',
                    preset: 'dialog',
                    content: () => h(NLog, { ref: logRef, rows: 10, trim: true, log: log.value.join('\n') })
                  })
                  // default: () => tip.value.map(txt => h(NText, null, { default: () => txt || '' }))
                  const file = input.files[0]

                  const reader = new FileReader()
                  // const decoder = new TextDecoder("gbk")
                  // , { 
                  //   decodeFileName: (bytes) => {
                  //     return iconv.decode(bytes as Buffer, 'UTF-8')
                  //   }
                  // }
                  reader.onload = e => {
                    const arrayBuffer = e.target?.result as string
                    jszip
                      .loadAsync(arrayBuffer)
                      .then(async zip => {
                        // console.log(zip)
                        // zip.files 是扁平化的结构，通过 convertFlatToTree 转换为树形结构
                        const tree = convertFlatToTree(zip.files)
                        // console.log(tree)
                        /** 递归解析文件树 */
                        async function traverseZipEntries(tree: JSZip.JSZipFileOptions, folderId: string) {
                          const entries = Object.keys(tree)
                          for (const entry of entries) {
                            if (!entry) continue
                            const file = tree[entry]
                            const relativePath = entry // 目录/文件的名称
                            const isFolder = file['']?.dir || false
                            const isJsonFile = /\.json$/i.test(relativePath)
                            if (isFolder) {
                              let foldername = relativePath ? relativePath : '未命名'
                              // 创建文件夹
                              addLog(`正在创建目录 ${foldername}`)
                              const { data } = await folderStore.create({
                                name: foldername,
                                lib: LibraryEnum.NOTE,
                                desc: '',
                                parentId: folderId
                              })
                              await traverseZipEntries(file, data.id)
                            } else if (isJsonFile) {
                              addLog(`正在解析文件 ${relativePath}`)

                              await file.async('string').then(async jsonStr => {
                                try {
                                  console.log('jsonStr', jsonStr)
                                  const jsonObj = JSON.parse(jsonStr)
                                  // console.log('JSON对象:', jsonObj)
                                  addLog(`正在转换文本 :::`)
                                  const { content, cover } = await parseContent(jsonObj.content)
                                  const data = {
                                    folderId,
                                    lib: jsonObj.lib,
                                    title: jsonObj.title,
                                    content,
                                    cover
                                  }
                                  addLog(`正在创建文件 ${data.title}`)
                                  await projectStore.input(data, userStore.account, userStore.hostname)
                                } catch (error) {
                                  console.log('jsonStr', jsonStr)
                                  console.error('解析 JSON 时出错:', error)
                                }
                              })
                            } else {
                              console.log('其它类型文件')
                            }
                          }
                        }

                        await traverseZipEntries(tree, targetFolderId).then(() => {
                          message.success('导入成功！')
                          addLog('导入完成！')
                          // modal.destroyAll()
                        })
                      })
                      .catch(error => {
                        console.error('解析 ZIP 文件时出错:', error.message)
                        dialog.error({
                          title: '导入失败',
                          content: '无法正确解析目标文件！'
                        })
                      })
                  }

                  reader.readAsArrayBuffer(file)
                }
              }
            }
          },
          {
            label: t('sidebar.output'),
            key: 'output',
            icon: () => h(Icon, { icon: 'material-symbols:output-rounded', height: 24 }),
            // show: false,
            props: {
              onClick: () => {
                let checkedKeys: Array<string> = []
                dialog.create({
                  title: '导出',
                  content: '确定导出全部笔记吗？(目前只提供笔记导出功能)',
                  // content: () =>
                  //   h(FolderTreeCheck, {
                  //     lib: LibraryEnum.NOTE,
                  //     onChecked: value => {
                  //       checkedKeys = value
                  //     }
                  //   }),
                  positiveText: '确定',
                  negativeText: '取消',
                  onPositiveClick: async () => {
                    const zip = new JSZip()
                    // console.log(userStore.dir)
                    const treenodes = await folderTreeStore.fetchFirstLevel(userStore.dir.note, LibraryEnum.NOTE)
                    const folders: Folder[] = []
                    for (let i = 0; i < treenodes.length; i++) {
                      if (treenodes[i].id) {
                        await folderStore.fetch(treenodes[i].id!).then(res => {
                          folders[i] = res.data
                        })
                      }
                    }
                    // console.log(folders)
                    async function traverseOutput(folders: Folder[], basePath: string) {
                      for (let i = 0; i < folders.length; i++) {
                        const fullPath = basePath + folders[i].name
                        console.log(fullPath)
                        if (typeof folders[i].subfiles === 'object') {
                          for (let j = 0; j < folders[i].subfiles!.length; j++) {
                            try {
                              const subfile = folders[i].subfiles![j]
                              const project = await projectStore.fetch(subfile.id, userStore.account, userStore.hostname).then(res => res.data)
                              const content = (await pack.getContent(project.content)).content
                              // console.log(content)
                              const data = {
                                lib: project.lib,
                                title: project.title,
                                content: content
                              }
                              const jsonString = JSON.stringify(data)
                              zip.folder(basePath)?.file(`${folders[i].name}/${subfile.title}.json`, jsonString, { binary: false }) // 注意 json 数据不能用二进制压缩
                            } catch (error) {
                              message.error('项目 folders[i][j] 获取失败')
                            }
                          }
                        }
                        if (typeof folders[i].subfolders === 'object') {
                          const subfolders: Folder[] = []
                          for (let j = 0; j < folders[i].subfolders!.length; j++) {
                            await folderStore.fetch(folders[i].subfolders![j].id).then(res => {
                              subfolders[j] = res.data
                            })
                          }
                          await traverseOutput(subfolders, `${fullPath}/`)
                        }
                        // return
                        // zip.file(`${basePath} + ${folders[i].name}/${}`)
                      }
                    }
                    await traverseOutput(folders, '')
                    // let folders: Folder[] = []
                    // for (let i = 0; i < checkedKeys.length; i++) {
                    //   await folderStore.fetch(checkedKeys[i]).then(res => {
                    //     folders[i] = res.data
                    //   })
                    // }
                    // console.log(folders)
                    // for (let i = 0; i < folders.length; i++) {
                    //   if (typeof folders[i].subfiles === 'object') {
                    //     for (let j = 0; j < folders[i].subfiles!.length; j++) {
                    //       try {
                    //         const id = folders[i].subfiles![j].id
                    //         const project = await projectStore.fetch(id, userStore.account, userStore.hostname).then(res => res.data)
                    //         const content = (await pack.getContent(project.content)).content
                    //         const data = {
                    //           lib: project.lib,
                    //           title: project.title,
                    //           content: content
                    //         }
                    //         const jsonString = JSON.stringify(data)
                    //         // const blob = new Blob([jsonString], { type: 'application/json' })
                    //         zip.folder(`${folders[i].name}`)?.file(`${data.title}.json`, jsonString)
                    //       } catch (error) {
                    //         message.error('项目 folders[i][j] 获取失败')
                    //       }
                    //     }
                    //   }
                    // }
                    zip
                      .generateAsync({ type: 'blob' })
                      .then(blob => {
                        // 创建 URL 对象
                        const url = URL.createObjectURL(blob)
                        // 创建 <a> 标签并设置其属性
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `${dayjs(Date.now()).format('YYMMDDHHmmss')}.zip` // 设置下载的文件名
                        // 模拟点击 <a> 标签以触发下载
                        link.click()
                        // 清理 URL 对象
                        URL.revokeObjectURL(url)
                      })
                      .catch(error => {
                        console.error('Error generating ZIP:', error)
                      })
                  },
                  onNegativeClick: () => {
                    message.create('取消')
                  }
                })
              }
            }
          },
          {
            label: '检查与更新',
            disabled: true,
            show: false,
            key: 'checkAndUpdate',
            icon: () => h(Icon, { icon: 'material-symbols:browser-updated', height: 24 }),
            props: {
              onClick: () => {
                //
              }
            }
          },
          {
            label: t('sidebar.logout'),
            key: 'logout',
            icon: () => h(Icon, { icon: 'material-symbols:logout', height: 24 }),
            props: {
              onClick: () => {
                userListStore.logout(userStore.account, userStore.hostname)
              }
            }
          }
        ]
      case 'master':
        return [
          {
            key: 'create-new-folder',
            icon: () => h(Icon, { icon: 'material-symbols:create-new-folder-outline', height: 24 }),
            label: t('newFolder'),
            props: {
              onClick: () => {
                createNewFolder()
              }
            }
          },
          {
            key: 'create-new-map',
            show: false,
            disabled: true,
            icon: () => h(Icon, { icon: 'material-symbols:add-notes-outline', height: 24 }),
            label: '新建知识图谱',
            props: {
              onClick: () => {
                //
              }
            }
          }
        ]
      case 'recently':
        return [
          {
            key: LibraryEnum.NOTE,
            icon: () => h(Icon, { icon: 'fluent:notebook-16-regular', height: 24 }),
            label: t('note'),
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
            icon: () => h(Icon, { icon: 'material-symbols:play-lesson-outline', height: 24 }),
            label: t('course'),
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
            icon: () => h(Icon, { icon: 'material-symbols:coffee-maker-outline', height: 24 }),
            label: t('procedure'),
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
      case 'more':
        return [
          {
            key: 'trash',
            icon: () => h(Icon, { icon: 'material-symbols:delete-outline', height: 24 }),
            label: t('sidebar.trash'),
            props: {
              onClick: () => {
                shell.useBin()
              }
            }
          },
          {
            key: 'secret',
            disabled: true,
            show: false,
            icon: () => h(Icon, { icon: 'material-symbols:stabilization-lock', height: 24 }),
            label: '加密文档',
            props: {
              onClick: () => {
                //
              }
            }
          }
        ]
      case 'collapse':
        return [
          {
            key: 'read-more',
            label: t('open'),
            icon: renderIcon('material-symbols:folder-open-outline'),
            props: {
              onClick: () => {
                dropdownState.lib && folderStore.fetchAndSet(userStore.getDirByLib(dropdownState.lib))
              }
            }
          },
          {
            key: 'create-new-folder',
            icon: () => h(Icon, { icon: 'material-symbols:create-new-folder-outline', height: 24 }),
            label: t('newFolder'),
            props: {
              onClick: () => {
                dropdownState.lib && createNewFolder(dropdownState.lib)
              }
            }
          }
          // {
          //   key: 'count',
          //   label: '统计',
          //   disabled: true,
          //   props: {
          //     onClick: () => {}
          //   }
          // },
        ]
      default:
        return []
    }
  })

  /** 用户按钮 */
  function handleUserDropdown(ev: MouseEvent) {
    const target = ev.target as HTMLElement
    if (current === target) {
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
      dropdownState.target = 'user'
    })
  }
  /** 主按钮 */
  function handleMasterDropdown(ev: MouseEvent) {
    const target = ev.target as HTMLElement
    if (current === target) {
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
      dropdownState.target = 'master'
    })
  }

  /** 最近编辑 */
  function handleRecentContextmenu(ev: MouseEvent) {
    const target = ev.target as HTMLElement
    if (current === target) {
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
      dropdownState.target = 'recently'
    })
  }

  /** 更多 */
  function handleMoreDropdown(ev: MouseEvent) {
    const target = ev.target as HTMLElement
    if (current === target) {
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
      dropdownState.target = 'more'
    })
  }

  /** 折叠面板按钮 */
  function handleCollapseDropdown(ev: MouseEvent, lib: LibraryEnum) {
    const target = ev.target as HTMLElement
    if (current === target) {
      dropdownState.showArrowRef = false
      current = null
      return
    }
    current = target
    const rect = target.getBoundingClientRect()
    dropdownState.showDropdownRef = false
    dropdownState.widthRef = undefined
    dropdownState.placementRef = 'bottom'
    dropdownState.lib = lib
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = rect.x + rect.width / 2
      dropdownState.yRef = rect.y + rect.height
      dropdownState.target = 'collapse'
    })
  }

  /** 树形节点按钮 */
  // 绑定在树形组件内部，暂不抽离处理

  function renderIcon(icon: string) {
    return () => h(Icon, { icon: icon, height: 24 })
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

  function createNewFolder(lib?: LibraryEnum) {
    dialog.create({
      icon: () => h(Icon, { icon: 'material-symbols:create-new-folder-outline', height: 24 }),
      title: t('newFolder'),
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


function renderCustomHeader() {
  const { userStore } = useStore()
  console.log(userStore.$state)
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
            { default: () => h('div', { style: 'display: flex; align-items: center;' }, [
              h('span', {}, { default: () => userStore.account || '', }),
              h(Icon, { icon: 'mingcute:vip-3-fill', style: { marginLeft: '4px', color: '#fbe30a', display: userStore.isVip ? 'inline-block' : 'none' } })
            ]) } // 用户账号
          )
        ]),
        h('div', { style: 'font-size: 12px;' }, [
          h(
            NText,
            { depth: 3, style: { display: userStore.vipExpirationAt ? 'block' : 'none', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
            { default: () => `VIP 至 ${dayjs(userStore.vipExpirationAt).format('YYYY-MM-DD')} 结束` } // 用户会员状态
          )
        ])
      ])
    ]
  )
}
