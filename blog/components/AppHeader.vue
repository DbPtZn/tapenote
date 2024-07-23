<script lang="ts" setup>
import Facebook from '../components/Facebook.vue'
import Github from '../components/Github.vue'
import MenuIcon from '../components/MenuIcon.vue'
import { useThemeVars } from 'naive-ui'
import { useI18n } from 'vue-i18n'
const appConfig = useAppConfig()
const router = useRouter()
const route = useRoute()
const themeVars = useThemeVars()
const { theme } = appConfig
const { t } = useI18n()
const activeKey = ref()
const navOptions = [
  {
    key: 'home',
    label: `${t('home')}`,
    onClick: () => {
      handleNavClick('')
    }
  },
  {
    key: 'column',
    label: `${t('column')}`,
    onClick: () => {
      handleNavClick('column')
    }
  },
  {
    key: 'tag',
    label: `${t('tag')}`,
    disabled: true,
    onClick: () => {
      handleNavClick('tag')
    }
  },
  {
    key: 'about',
    label: `${t('about')}`,
    disabled: true,
    onClick: () => {
      handleNavClick('about')
    }
  }
]
function handleNavClick(to: string) {
  const match = route.path.match(/^\/([a-zA-Z0-9_-]+)\/?.*/)
  const uid = match ? match[1] : ''
  router.push({ path: `/${uid}${to ? '/' + to : to}` })
}

function handleThemeUpdate(value: boolean) {
  theme.dark = value
}
function handleDblClick() {
  console.log('dbclick')
  router.push({ path: `/manage` })
}
</script>

<template>
  <div class="nav">
    <div class="nav-container">
      <div class="left">
        <div class="title">
          <!-- <n-icon class="tapenote-icon" :component="HomeFilled" :size="24" />-->
          <img class="tapenote-icon logo" src="/logo.png" alt="" @dblclick="handleDblClick" />
          <nuxt-link class="tapenote-name" to="/">{{ $t('title') }}</nuxt-link>
        </div>
      </div>
      <div class="right">
        <div class="tools">
          <!-- <n-input class="search" placeholder="搜索" disabled>
            <template #suffix>
              <n-button class="btn" text ghost>
                <n-icon :component="SearchOutlined" :size="18" />
              </n-button>
            </template>
          </n-input> -->
        </div>

        <div class="menu">
          <n-flex align="center" :size="[12, 0]">
            <n-button text v-for="(item, index) in navOptions" :key="item.key" @click="item.onClick">
              <span class="menu-btn">{{ item.label }}</span>
            </n-button>
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
        <n-divider class="divider" vertical />
        <n-switch class="theme-switch" @update:value="handleThemeUpdate" :value="theme.dark" size="medium">
          <template #icon>
            <span v-if="!theme">☀</span>
            <span v-if="theme">🌙</span>
          </template>
        </n-switch>
        <!-- 用户配置自定义外链（图标 + 超链接） -->
        <n-divider class="divider" vertical />
        <n-button text>
          <n-icon class="nav-btn" :component="Github" :size="24" />
        </n-button>
        <n-button text>
          <n-icon class="nav-btn" :component="Facebook" :size="24" />
        </n-button>
        <!-- <n-icon class="more-btn" :component="MoreHorizRound" :size="24" /> -->
        <Icon name="" />
        <MenuIcon class="collapse-btn" :style="{ scale: 0.6 }" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.nav {
  position: relative;
  display: flex;
  width: 100%;
  height: 64px;
  min-height: 64px;
  // padding: 0 32px;
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
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
  .more-btn {
    display: none;
  }
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
    .theme-switch {
      display: none;
    }
    .nav-btn {
      display: none;
    }
    .more-btn {
      display: block;
      margin-left: 12px;
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
