import * as UUID from 'uuid'
import { markRaw, watch } from 'vue'
import useStore from '@/store'
import { ShellModule, ContainerTypeEnum, FractalContainerConfig } from '@/renderer'
import SidebarView from './sidebar/SidebarView.vue'
import ItemListView from './itemlist/ItemListView.vue'
import { TrashView } from './trash'
import { ComponentWorkbench } from './component.workbench'
import { AdminView } from './admin'

export class CreatorShell implements ShellModule {
  height: string | number
  width: string | number
  useAuxLines?: string | undefined
  itemlistVisible: boolean
  layout: {
    wrapper: FractalContainerConfig | undefined
    admin: FractalContainerConfig | undefined
    sidebar: FractalContainerConfig | undefined
    itemlist: FractalContainerConfig | undefined
    bin: FractalContainerConfig | undefined
    workbenchWrapper: FractalContainerConfig | undefined
  }
  workbench: ComponentWorkbench
  constructor() {
    this.height = '100%'
    this.width = '100%'
    this.itemlistVisible = false
    // this.useAuxLines = '#b6b6b6' // '#b6b6b6'
    this.workbench = new ComponentWorkbench()
    this.layout = {
      wrapper: undefined,
      admin: {
        id: UUID.v4(),
        type: ContainerTypeEnum.LAYOUT,
        name:'register',
        cmpt: markRaw(AdminView),
        isRow: false,
        children: []
      },
      sidebar: {
        id: UUID.v4(),
        type: ContainerTypeEnum.LAYOUT,
        name: 'sidebar',
        cmpt: markRaw(SidebarView),
        isRow: false,
        ratio: '240px',
        min: '240px',
        children: []
      },
      itemlist: {
        id: UUID.v4(),
        type: ContainerTypeEnum.LAYOUT,
        name: 'itemlist',
        cmpt: markRaw(ItemListView),
        isRow: true,
        ratio: '280px',
        // min: '280px',
        isSplitterRender: true,
        children: []
      },
      bin: {
        id: UUID.v4(),
        type: ContainerTypeEnum.LAYOUT,
        name: 'bin',
        cmpt: markRaw(TrashView),
        isRow: true,
        isSplitterRender: true,
        children: []
      },
      workbenchWrapper: {
        id: UUID.v4(),
        type: ContainerTypeEnum.LAYOUT,
        name: 'workbench-wrapper',
        isSplitterRender: true,
        isRow: true,
        children: [
          this.workbench.data
        ]
      },
    }
    
  }

  setup() {
    const { settingStore } = useStore()
    watch(
      () => settingStore.theme,
      () => {
        this.layout.wrapper!.useBgcolor = settingStore.theme === null ? '#f7f7f7' : ''
      }
    )
    const module = <FractalContainerConfig>(this.layout.wrapper = {
      id: UUID.v4(),
      type: ContainerTypeEnum.WRAPPER,
      name: 'shell',
      isRow: true,
      ratio: 100,
      useBgcolor: settingStore.theme === null ? '#f7f7f7' : '',
      children: [
        this.layout.sidebar!,
        this.layout.workbenchWrapper! 
      ]
    })
    return module
  }
  /** 用户面板 */
  useUserPanel() {
    const { folderStore } = useStore()
    if(folderStore.id) {
      this.layout.wrapper!.children = [
        this.layout.sidebar!,
        this.layout.itemlist!,
        this.layout.workbenchWrapper!
      ]
    } else {
      this.layout.wrapper!.children = [
        this.layout.sidebar!,
        this.layout.workbenchWrapper!
      ]
    }
  }

  /** 项目列表激活场景 */
  useItemlist() {
    const { folderStore } = useStore()
    if (this.layout.wrapper?.children.includes(this.layout.itemlist!)) {
      if (!folderStore.id) {
        const index = this.layout.wrapper!.children.indexOf(this.layout.itemlist!)
        if (index !== -1) this.layout.wrapper?.children.splice(index, 1)
      }
    } else {
      if (folderStore.id) {
        const index = this.layout.wrapper!.children.indexOf(this.layout.sidebar!)
        if (index !== -1) this.layout.wrapper?.children.splice(index + 1, 0, this.layout.itemlist!)
      }
      if (this.layout.itemlist?.ratio === 0) {
        this.expandItemlist()
      }
    }
  }
  /** 工作区场景 */
  useWorkbench() {
    if (!this.layout.wrapper?.children.includes(this.layout.workbenchWrapper!)) {
      // 工作区始终在最后
      this.layout.wrapper?.children.splice(this.layout.wrapper?.children.length - 1, 1, this.layout.workbenchWrapper!)
    }
  }
  /** 回收站场景 */
  useBin() {
    if (!this.layout.wrapper?.children.includes(this.layout.bin!)) {
      // 工作区始终在最后
      this.layout.wrapper?.children.splice(this.layout.wrapper?.children.length - 1, 1, this.layout.bin!)
    } 
  }

  useAdmin() {
    if (!this.layout.wrapper?.children.includes(this.layout.admin!)) {
      // 工作区始终在最后
      this.layout.wrapper?.children.splice(this.layout.wrapper?.children.length - 1, 1, this.layout.admin!)
    } 
  }

  /** 侧边栏折叠场景 */
  collapseSidebar() {
    const { settingStore } = useStore()
    settingStore.isSidebarCollapse = true
    this.layout.sidebar!.ratio = 0
    // this.layout.sidebar!.min = 0
  }
  /** 侧边栏展开场景 */
  expandSidebar() {
    const { settingStore } = useStore()
    settingStore.isSidebarCollapse = false
    this.layout.sidebar!.ratio = '240px'
    // this.layout.sidebar!.min = '240px'
  }

  /** 项目列表折叠场景 */
  collapseItemlist() {
    const { settingStore } = useStore()
    settingStore.isItemListCollapse = true
    this.layout.itemlist!.ratio = 0
    // this.layout.sidebar!.min = 0
  }

  /** 项目列表展开场景 */
  expandItemlist() {
    const { settingStore } = useStore()
    settingStore.isItemListCollapse = false
    this.layout.itemlist!.ratio = '280px'
    // this.layout.sidebar!.min = '240px'
  }
}

export const creatorShell = new CreatorShell()

