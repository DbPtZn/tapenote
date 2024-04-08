import { DropdownMixedOption } from "naive-ui/es/dropdown/src/interface"
import { nextTick, reactive, ref, h } from "vue"
import { UserOption } from "../types"
import useStore from "@/store"
// import { useShell } from "@/renderer"
// import { CreatorShell } from "../../shell"
import { useMessage, useDialog } from "naive-ui"
import LoginInfo from './utils/LoginInfo.vue'

export function useDropdown() {
  const { userStore, userListStore, folderTreeStore } = useStore()
  const message = useMessage()
  const dialog = useDialog()
  // const shell = useShell<CreatorShell>()
  const dropdownState = reactive({
    option: ref<UserOption>(),
    xRef: ref<number>(0),
    yRef: ref<number>(0),
    showDropdownRef: ref<boolean>(false),
  })
  const dropdownMenu = ref<DropdownMixedOption[]>([
    {
      key: 'details',
      label: '查看登录信息',
      props: {
        onClick: () => {
          dialog.create({
            title: '用户登录状态信息',
            content: () => h(LoginInfo, {
              account: dropdownState.option?.account || '',
              hostname: dropdownState.option?.hostname || ''
            })
          })
        }
      }
    },
    {
      key: 'refresh',
      label: '刷新',
      props: {
        onClick: () => {
          // 重新获取用户信息
          const account = dropdownState.option?.account || ''
          const hostname = dropdownState.option?.hostname || ''
          if (account && hostname) {
            // 确保成功获取用户信息后再清理缓存，重置用户
            userListStore.fetch(account, hostname).then(state => {
              if (!state) return message.error('刷新用户信息失败！')
              // 如果刷新的是当前用户：
              if (account === userStore.account && hostname === userStore.hostname) {
                userListStore.removeCache(account, hostname) // 清除缓存
                userStore.$reset() // 重置状态
                userStore.$patch(state) // 设置数据状态
                folderTreeStore.removeCache(account, hostname) // 移除文件夹目录缓存
                folderTreeStore.$reset()  // 重置文件夹目录缓存
              } else {
                userListStore.removeCache(account, hostname) // 清除缓存
                userListStore.setCache(state) // 设置新缓存
                folderTreeStore.removeCache(account, hostname) // 移除文件夹目录缓存
              }
              message.success('刷新用户信息成功！')
            })
          }
        }
      }
    },
    {
      key: 'logout',
      label: '登出',
      props: {
        onClick: () => {
          const account = dropdownState.option?.account || ''
          const hostname = dropdownState.option?.hostname || ''
          if (account && hostname) {
            userListStore.logout(account, hostname)
          }
        }
      }
    }
  ])
  function handleContextMenu(ev, option: UserOption) {
    if (option.key === 'add') return
    dropdownState.option = option
    ev.preventDefault()
    ev.stopPropagation()
    dropdownState.showDropdownRef = false
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = ev.clientX
      dropdownState.yRef = ev.clientY
    })
  }

  function handleClickoutside(ev: MouseEvent) {
    dropdownState.showDropdownRef = false
  }

  function handleSelect(option?: UserOption) {
    dropdownState.showDropdownRef = false
  }
  
  return {
    dropdownState,
    dropdownMenu,
    handleContextMenu,
    handleClickoutside,
    handleSelect
  }
}