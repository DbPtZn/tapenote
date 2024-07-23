<script lang="ts" setup>
import MenuIcon from '../components/MenuIcon.vue'
import { useThemeVars } from 'naive-ui'
import { Subscription, fromEvent } from '@tanbo/stream'
import 'animate.css'
import type { ArticleUserInfo } from '~/types'
import { useI18n } from 'vue-i18n'
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
const emits = defineEmits<{
  outlineVisible: [boolean]
  moreClick: []
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
const isOutlineShow = ref(true)
function handleOutlineVisible() {
  isOutlineShow.value = !isOutlineShow.value
  emits('outlineVisible', isOutlineShow.value)
}
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
    fromEvent<WheelEvent>(document.body, 'wheel').subscribe(event => {
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

function handleMoreClick() {
  emits('moreClick')
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
        <div class="tools"></div>

        <div class="menu">
          <div class="outline-switch" @click="handleOutlineVisible">
            <Icon class="outline-switch-icon" :name="isOutlineShow ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'" size="24px" />
          </div>
          <n-divider class="divider" vertical />
          <div class="theme-switch" @click="handleThemeUpdate">
            <Icon :name="themeIconVar" size="24px" />
          </div>
        </div>
        <Icon class="more-btn" name="mingcute:more-1-fill" size="24px" @click="handleMoreClick" />
        <MenuIcon class="collapse-btn" :style="{ scale: 0.6 }" @click="handleMoreClick"/>
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
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
  background-color: v-bind('themeVars.cardColor');
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
    align-items: center;
    .theme-switch {
      cursor: pointer;
    }
    .outline-switch {
      cursor: pointer;
    }
  }
  .more-btn {
    display: none;
    cursor: pointer;
  }
  .tools {
    flex-grow: 1;
    padding-left: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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
    .menu {
      display: none;
    }
    .more-btn {
      display: block;
    }
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
    // .theme-switch {
    //   display: none;
    // }
    .nav-btn {
      display: none;
    }
    .collapse-btn {
      display: block;
    }
  }
}
</style>
