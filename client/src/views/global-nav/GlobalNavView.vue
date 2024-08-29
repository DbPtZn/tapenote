<script lang="ts" setup>
import { RoutePathEnum } from '@/enums'
import { useDialog, useMessage, useThemeVars } from 'naive-ui'
import { h, nextTick, onErrorCaptured, onMounted, onUnmounted,  reactive,  ref, watch } from 'vue'
import useStore from '@/store'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { useShell } from '@/renderer'
import { CreatorShell } from '../creator'
import { UserOption } from './types'
import { useDropdown } from './hooks/_index'
import { SettingsRound, LocalLibraryRound,  History, Blogger } from '@/components'
import { AddFilled, FaceFilled } from '@vicons/material'
import Draggable from 'vuedraggable'
import { useRouter } from 'vue-router'
import Container from './private/Container.vue'
import BloggerOption from './private/BloggerOption.vue'
import AddBlogger from './private/AddBlogger.vue'
import { markRaw } from 'vue'
const emits = defineEmits<{
  collapse: [number]
}>()
const themeVars = useThemeVars()
const message = useMessage()
const dialog = useDialog()
const router = useRouter()
const footerRef = ref()
const { userStore, userListStore, folderTreeStore, folderStore, settingStore } = useStore()
const state = reactive({
  userOption: true,
  blogOption: import.meta.env.VITE_VIEW_BLOG === 'true',
  managerOption: import.meta.env.VITE_VIEW_MANAGER === 'true'
})
// 移除 sessionStorage 以外的所有缓存（刷新页面等意外退出时，无法及时保存缓存，会导致缓存与实际数据不一致）
// FIXME  不建议在这里清理所有 localStorage ，这会导致刷新以后的所有 localStorage 都被清理掉。
// 这不是优雅的解决方案，如果后续有其它地方需要用到 localstorage,会导致那些缓存也失效
localStorage.clear()

onMounted(() => {
  // 1.初始化时，先根据 sessionStorage 填充用户信息
  userListStore.fillInfo().then(() => {
    // 2.无用户登录时跳转至登录页面
    if (userListStore.getData.length === 0) {
      // const shell = useShell<CreatorShell>()
      // return shell.useLogin() // 必须在 onMounted 后使用
      return router.push(RoutePathEnum.LOGIN)
    }
    // 4. 有用户登录的时候，自动补位
    userListStore.autoFilling()
  })
  // console.log('初始化')
})

onUnmounted(() => {
  console.log('卸载')
})

/** 订阅登录状态改变的事件 */
userListStore.onloginStateChange().subscribe(operate => {
  // console.log('用户登录状态改变：', operate.type)
  // console.log(userListStore.getData.length)
  // const shell = useShell<CreatorShell>()
  if (userListStore.getData.length === 0) {
    console.log('无登录用户，跳转至登录页面')
    router.push('/login')
  }
  if (operate.type === 'login') {
    message.success('登录成功')
  }
  if (operate.type === 'logout') {
    message.create('已登出')
  }
})

/** 用户列表 */
const userOptions = ref<UserOption[]>(getUserOptions())
watch(
  () => userListStore.getData,
  () => {
    userOptions.value = getUserOptions()
  }
)
function getUserOptions() {
  return userListStore.getData.map(option => {
    return {
      ...option,
      defaultIcon: markRaw(FaceFilled),
      onClick(opt) {
        router.push(RoutePathEnum.HOME).then(() => {
          const shell = useShell<CreatorShell>()
          shell.useUserPanel()
        })
        const account = userStore.account
        const hostname = userStore.hostname
        if (opt.account === account && opt.hostname === hostname) return
        folderTreeStore.saveCache(account, hostname)
        folderStore.saveCache(account, hostname)
        userListStore.fetchAndSet(opt.account, opt.hostname).then(state => {
          userStore.$patch(state)
          folderTreeStore.getCache(opt.account, opt.hostname)
          folderStore.getCache(opt.account, opt.hostname)
        })
      }
    }
  })
}

/** 博客选项 */
const blogsStr = localStorage.getItem('blogs')
const blogsJson = blogsStr ? JSON.parse(blogsStr) as { name: string; site: string }[] : []
const blogsCache = ref<{ name: string; site: string }[]>(blogsJson)
const showBloggerDropdownRef = ref(false)
function handleShowBloggerDropdown(value: boolean) {
  showBloggerDropdownRef.value = value
}
function getBloggerOptions() {
  const options = userStore.subscriptionConfig.map(config => {
    return {
      key: config.id,
      type: 'render',
      render: () => h(BloggerOption, {
        name: config.name,
        site: config.site,
        desc: config.desc
      }),
      props: {
        onClick: () => {
          showBloggerDropdownRef.value = false
        }
      }
    }
  })
  // console.log(options)
  return [
    {
      key: 'add-blog',
      label: '添加',
      props: {
        onClick: () => {
          dialog.create({
            title: '添加博客',
            content: () => h(AddBlogger, {
              onConfirm: (name, site) => {
                // console.log([name, site])
                blogsCache.value.push({
                  name,
                  site
                })
                const str = JSON.stringify(blogsCache.value)
                localStorage.setItem('blogs', str)

                dialog.destroyAll()
              }
            })
          })
          showBloggerDropdownRef.value = false
        }
      }
    },
    ...blogsCache.value.map(blog => {
      return {
        key: blog.site,
        label: blog.name,
        props: {
          onClick: () => {
            showBloggerDropdownRef.value = false
          }
        }
      }
    }),
    ...options
  ]
}
// const bloggerOptions = computed<DropdownMixedOption[]>(() => userStore.subscriptionConfig.map(config => {
//   console.log(config)
//   return {
//     key: config.id,
//     type: 'render',
//     render: () => h(BloggerOption, {
//       name: config.name,
//       site: config.site,
//       desc: config.desc
//     }),
//     props: {
//       onClick: () => {
//         showBloggerDropdownRef.value = false
//       }
//     }
//   }
// }))



/** 全局选项 */
const globalOptions: DropdownMixedOption[] = [
  {
    key: 'theme',
    label: '主题切换',
    props: {
      onClick: () => {
        settingStore.theme ? settingStore.useLight() : settingStore.useDark()
        // electron 环境下向主进程询问本地服务的端口号
        window.electronAPI && window.electronAPI.updateTheme(settingStore.getCurrentTheme())
      }
    }
  },
  {
    key: 'remember',
    label: '快捷登录',
    show: !!window.electronAPI,
    props: {
      onClick: () => {
        
      }
    }
  }
]

const { dropdownState, dropdownMenu, handleClickoutside, handleContextMenu, handleSelect } = useDropdown()
function handleAddUser() {
  leaveUserPanel()
  router.push(RoutePathEnum.LOGIN)
}

function leaveUserPanel() {
  folderTreeStore.saveCache(userStore.account, userStore.hostname) // 离开用户页面之前保存当前目录缓存
  folderStore.saveCache(userStore.account, userStore.hostname) // 离开用户页面之前保存当前文件缓存
  userStore.$reset() // 离开用户页面时清除用户信息（这样返回用户页面的时候才不会出现重复）
}

function handleManager() {
  leaveUserPanel()
  router.push(RoutePathEnum.MANAGER)
}

function handleError(ev: Event) {
  const target = ev.target as HTMLImageElement
  target.src = './avatar03.png'
}

function handleCacheVisible() {
  settingStore.handleCacheVisible()
}
onErrorCaptured(err => {
  console.log(err)
})

</script>

<template>
  <Container @collapse="ev => emits('collapse', ev)">
    <div class="sidenav">
      <div class="header">
        <Draggable v-if="state.userOption" class="draggable" v-model="userOptions" :itemKey="'key'" @change="userListStore.moveSequence">
          <template #item="{ element }">
            <div class="btn user-option" :key="element.key" :title="element.nickname" @click="element.onClick(element)" @contextmenu="handleContextMenu($event, element)">
              <img class="avatar" v-if="element.avatar" :src="element.avatar" alt="" @error="handleError" />
              <n-icon v-if="!element.avatar" :component="element.defaultIcon" :size="24" />
            </div>
          </template>
        </Draggable>
        <!-- 添加用户按钮： 最多同时登录五个账户 -->
        <div v-if="userOptions.length < 5" class="btn user-option" :title="'添加'" @click="handleAddUser">
          <!-- <DpzIcon :icon="`${MaterialTypeEnum.FILLED}add`" :size="24" /> -->
          <n-icon  :component="AddFilled" :size="24" />
        </div>
      </div>
      <div class="footer" ref="footerRef">
        <!-- <div class="btn option" v-for="item in options" :key="item.id" :title="item.label" @click="item.onClick">
          <DpzIcon :icon="item.icon" :size="24" />
        </div> -->
        <!-- 可以查看缓存中的项目（待开发） -->
        <div class="btn option" @click="handleCacheVisible">
          <n-icon :component="History" :size="24" />
        </div>
        <n-dropdown v-if="state.blogOption" trigger="click" :placement="'right'" :to="footerRef" :show="showBloggerDropdownRef" :options="getBloggerOptions()" @update:show="handleShowBloggerDropdown">
          <div class="btn option">
            <n-icon :component="Blogger" :size="20" />
          </div>
        </n-dropdown>
        <div v-if="state.managerOption" class="btn option" @click="handleManager">
          <n-icon :component="LocalLibraryRound" :size="24" />
        </div>
        <n-dropdown trigger="click" :placement="'right'" :options="globalOptions" @select="handleSelect">
          <div class="btn option">
            <n-icon :component="SettingsRound" :size="24" />
          </div>
        </n-dropdown>
      </div>
      <n-dropdown 
        placement="bottom-start" 
        trigger="manual" 
        :x="dropdownState.xRef" 
        :y="dropdownState.yRef"
        :options="dropdownMenu" 
        :show="dropdownState.showDropdownRef" 
        :on-clickoutside="handleClickoutside"
        @select="handleSelect" 
      />
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.disabled {
  cursor: not-allowed !important;
  opacity: 0.5;
}

.sidenav {
  overflow: hidden;
  // min-width: 64px;
  // width: 64px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  box-sizing: border-box;
  border-right: 1px solid v-bind('themeVars.dividerColor');

  .layout {
    width: 100%;
  }
}
.header {
  display: flex;
  flex-direction: column;
}
.footer {
  display: flex;
  flex-direction: column;
}

.btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  margin-top: 6px;
  cursor: pointer;

  &:hover {
    color: v-bind('themeVars.textColor1');
  }

  &:active {
    color: v-bind('themeVars.primaryColor');
  }
}

.user-option {
  border: 1px dashed v-bind('themeVars.borderColor');
  color: v-bind('themeVars.textColor3');
  box-sizing: border-box;
  overflow: hidden;

  .avatar {
    width: 100%;
    height: 100%;
    overflow: hidden;

    // object-fit: cover;
    &:hover {
      cursor: pointer;
      transition: 0.3s ease-in-out;
      scale: 1.2;
    }
  }
}

.option {
  color: v-bind('themeVars.textColor3');
}
</style>
