<script lang="ts" setup>
import { SearchOutlined, MoreHorizRound } from '@vicons/material'
import Facebook from '../components/Facebook.vue'
import Github from '../components/Github.vue'
import MenuIcon from '../components/MenuIcon.vue'
import { useThemeVars } from 'naive-ui'
const appConfig = useAppConfig()
const router = useRouter()
const themeVars = useThemeVars()
const { theme } = appConfig
const { t } = useI18n()
const activeKey = ref()
function handleThemeUpdate(value: boolean) {
  theme.dark = value
}
function handleDblClick() {
  console.log('dbclick')
  router.push({ path: `/manage` })
}
const options = [
  {
    label: '预览',
    key: '1'
  },
  {
    label: '预览',
    key: '2'
  },
  {
    label: '预览',
    key: '3'
  }
]
function handleBack() {
  //
}
</script>

<template>
  <div class="nav">
    <div class="nav-container">
      <n-page-header class="wrapper">
        <template #title>
          <nuxt-link to="/">Tapenote</nuxt-link>
        </template>
        <template #avatar>
          <img class="logo" src="/logo.png" />
        </template>
        <template #extra>
          <n-space>
            <n-button>预览</n-button>
            <n-dropdown :options="options" placement="bottom-start" :to="false">
              <n-button :bordered="false" style="padding: 0 4px;font-size: 24px;line-height: 24px;"> ··· </n-button>
            </n-dropdown>
          </n-space>
        </template>
      </n-page-header>
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
  box-sizing: border-box;
  border: 1px solid v-bind('themeVars.dividerColor');
  background-color: v-bind('themeVars.bodyColor');
  box-shadow: v-bind('themeVars.boxShadow1');
  .nav-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    // justify-content: space-between;
    // margin: 0px auto;
    width: 100%;
    height: 100%;
  }
}
.wrapper {
  width: 100%;
  :deep(.n-page-header) {
    width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
  }
}
.logo {
  height: 24px;
}
</style>
