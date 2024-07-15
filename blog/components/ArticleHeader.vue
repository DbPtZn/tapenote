<script lang="ts" setup>
import MenuIcon from '../components/MenuIcon.vue'
import { useThemeVars } from 'naive-ui'
import { Subscription, fromEvent } from '@tanbo/stream'
import 'animate.css'
import type { ArticleUserInfo } from '~/types'
const appConfig = useAppConfig()
const router = useRouter()
const route = useRoute()
const themeVars = useThemeVars()
const device = useDevice()
const { theme } = appConfig
const { t } = useI18n()
const props = defineProps<{
  user: ArticleUserInfo
}>()
defineExpose({
  setNavVisible(value: boolean) {
    visible.value = value
  }
})

function handleNavClick(to: string) {
  const match = route.path.match(/^\/([a-zA-Z0-9_-]+)\/?.*/)
  const uid = match ? match[1] : ''
  router.push({ path: `/${uid}${to ? '/' + to : to}` })
}

function handleThemeUpdate() {
  theme.dark = !theme.dark
}
// function handleDblClick() {
//   console.log('dbclick')
//   router.push({ path: `/manage` })
// }
const themeIconVar = computed(() => {
  return theme.dark ? 'material-symbols:dark-mode' : 'material-symbols:light-mode'
})
const subs: Subscription[] = []
const visible = ref(false)
onMounted(() => {
  subs.push(
    // fromEvent(document.body, 'scroll').subscribe(() => {
    //   console.log('scro')
    // }),
    fromEvent<WheelEvent>(document.body, 'wheel').subscribe((event) => {
      // console.log(event)
      if (event.deltaY > 0) {
        // 用户向上滚动
        // console.log('向上滚动')
        visible.value = false
      } else {
        // 用户向下滚动
        // console.log('向下滚动')
        visible.value = true
      }
    })
  )
})
onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
})
function handleError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/avatar03.png'
}
</script>

<template>
  <div :class="['nav', visible && 'visible']">
    <div class="nav-container">
      <div class="left">
        <nuxt-link :to="`/${user.UID}`"> 
        <div class="title">
          <img class="tapenote-icon logo" :src="user.avatar" alt="" @error="handleError" />
          <span class="tapenote-name" :to="`/${user.UID}`">{{ user.nickname }}</span>
        </div>
        </nuxt-link>
      </div>
      <div class="right">
        <div class="tools">
        </div>

        <div class="menu">
          <n-flex align="center" :size="[12, 0]">
            <!-- <n-button text v-for="(item, index) in navOptions" :key="item.key" @click="item.onClick">
              <span class="menu-btn">{{ item.label }}</span>
            </n-button> -->
            <!-- <n-button text>
              <nuxt-link class="menu-btn" :to="'/' + uid">{{ $t('home') }}</nuxt-link>
            </n-button>
            <n-button text>
              <nuxt-link class="menu-btn" :to="uid + '/column'">{{ $t('column') }}</nuxt-link>
            </n-button>
            <n-button text>
              <nuxt-link class="menu-btn" :to="uid + '/tag'">{{ $t('tag') }}</nuxt-link>
            </n-button>
            <n-button text>
              <nuxt-link class="menu-btn" :to="uid + '/about'">{{ $t('about') }}</nuxt-link>
            </n-button> -->
          </n-flex>
        </div>
        <!-- <n-divider class="divider" vertical />
        <n-switch class="theme-switch" @update:value="handleThemeUpdate" :value="theme.dark" size="medium">
          <template #icon>
            <span v-if="!theme">☀</span>
            <span v-if="theme">🌙</span>
          </template>
        </n-switch> -->
        <div class="theme-switch" @click="handleThemeUpdate">
          <Icon :name="themeIconVar" size="24px" />
        </div>
        <!-- 用户配置自定义外链（图标 + 超链接） -->
        <!-- <n-divider class="divider" vertical /> -->
        <!-- <n-button text>
          <n-icon class="nav-btn" :component="Github" :size="24" />
        </n-button>
        <n-button text>
          <n-icon class="nav-btn" :component="Facebook" :size="24" />
        </n-button> -->
        <!-- <n-icon class="more-btn" :component="MoreHorizRound" :size="24" /> -->
        <MenuIcon class="collapse-btn" :style="{ scale: 0.6 }" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.visible {
  position: sticky;
  top: 0px;
  animation: fadeInDown 0.5s ease-in-out;
}
.nav {
  transition: all 0.3s ease-in-out;
  display: flex;
  z-index: 1;
  width: 100%;
  height: 64px;
  min-height: 64px;
  // padding: 0 32px;
  border: 1px solid v-bind('themeVars.dividerColor');
  background-color: v-bind('themeVars.bodyColor');
  box-shadow: v-bind('themeVars.boxShadow1');
  .nav-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0px auto;
    width: 100%;
    height: 100%;
  }
}
.left {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 64px;
  }
  .tapenote-icon {
    margin-right: 8px;
    max-width: 100%;
    vertical-align: middle;
    overflow-clip-margin: content-box;
    overflow: clip;
  }
  .logo {
    height: 24px;
  }
  .tapenote-name {
    display: block;
    font-size: 16px;
  }
}
.right {
  flex-grow: 1;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .menu {
    display: flex;
    .menu-btn {
      font-size: 16px;
      margin: 0 6px;
    }
  }
  .nav-btn {
    font-size: 16px;
    margin: 0 6px;
  }
  // .more-btn {
  //   display: none;
  // }
  .tools {
    flex-grow: 1;
    padding-left: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .search {
      max-width: 150px;
      height: 40px;
    }
  }
  .theme-switch {
    cursor: pointer;
  }
  .collapse-btn {
    display: none;
  }
}

@media (min-width: 1280px) {
  .nav-container {
    max-width: 1280px;
  }
}

@include Desktop {
  .nav {
    box-sizing: border-box;
    padding: 0 12px;
  }
  .left {
    .tapenote-icon {
      display: block;
    }
    .tapenote-name {
      display: block;
    }
  }
}

@include SmallDesktop {
  .nav {
    .nav-container {
      width: 100%;
      margin: 0 12px;
    }
  }
  .right {
    justify-content: end;
    .nav-list {
      display: none;
    }
    .tools {
      display: none;
    }
    .divider {
      display: none;
    }
    // .theme-switch {
    //   display: none;
    // }
    .nav-btn {
      display: none;
    }
    // .more-btn {
    //   display: block;
    //   margin-left: 12px;
    // }
    .menu-btn {
      display: block;
    }
  }
}

@include Mobile {
  .nav {
    .nav-container {
      width: 100%;
      margin: 0 12px;
      // margin: 0;
      padding: 0;
    }
  }
  .divider {
    display: none;
  }
  .left {
    .tapenote-icon {
      display: block;
    }
    .tapenote-name {
      display: none;
    }
  }
  .right {
    justify-content: end;
    .menu {
      display: none;
    }
    .tools {
      display: none;
    }
    .theme-switch {
      display: none;
    }
    .nav-btn {
      display: none;
    }
    .collapse-btn {
      display: block;
    }
  }
}
</style>
