<script lang="ts" setup>
import { DehazeFilled, HomeFilled, SearchOutlined, MenuRound } from '@vicons/material'
import Facebook from '../components/Facebook.vue'
import Github from '../components/Github.vue'
import { useThemeVars } from 'naive-ui'
const appConfig = useAppConfig()
const router = useRouter()
const themeVars = useThemeVars()
const { theme } = appConfig
const { t } = useI18n()
const options = [
  {
    label: `${t('home')}`,
    onClick: () => {
      router.push({ path: `/` })
    }
  },
  {
    label: `${t('column')}`,
    onClick: () => {
      router.push({ path: '/column' })
    }
  },
  {
    label: `${t('tag')}`,
    disabled: true,
    onClick: () => {
      router.push({ path: `/tag` })
    }
  },
  {
    label: `${t('about')}`,
    disabled: true,
    onClick: () => {
      //
    }
  }
]

function handleThemeUpdate(value: boolean) {
  theme.dark = value
}
</script>

<template>
  <div class="nav">
    <div class="left">
      <n-button text>
        <n-icon class="tapenote-icon" :component="HomeFilled" :size="36" />
        <span class="tapenote-name" :style="{ fontSize: '32px' }">笔记映画</span>
      </n-button>
    </div>
    <div class="middle flex-auto">
      <div class="nav-list">
        <n-flex align="center" :size="[24, 0]">
          <n-button text v-for="(option, index) in options" :key="index" :disabled="option.disabled" @click="option.onClick">
            <span class="nav-btn"> {{ option.label }} </span>
          </n-button>
        </n-flex>
      </div>
      <div class="tools">
        <n-input class="search" placeholder="搜索" disabled>
          <template #suffix>
            <n-button class="btn" text ghost>
              <n-icon :component="SearchOutlined" :size="18" />
            </n-button>
          </template>
        </n-input>
      </div>
    </div>
    <div class="right">
      <n-switch class="theme-switch" @update:value="handleThemeUpdate" :value="theme.dark" size="medium">
        <template #icon>
          <span v-if="!theme">☀</span>
          <span v-if="theme">🌙</span>
        </template>
      </n-switch>
      <!-- 用户配置自定义外链（图标 + 超链接） -->
      <n-button text>
        <n-icon class="nav-btn" :component="Github" :size="24" />
      </n-button>
      <n-divider vertical />
      <n-button text>
        <n-icon class="nav-btn" :component="Facebook" :size="24" />
      </n-button>
      <n-icon class="collapse-btn" :component="MenuRound" :size="24" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.nav {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 68px;
  min-height: 68px;
  background-color: v-bind('themeVars.bodyColor');
  box-shadow: v-bind('themeVars.boxShadow1');
  .nav-container {
    height: 100%;
    padding: 0 20px;
  }
  .nav-btn {
    font-size: 16px;
  }
}
.left {
  width: 23.5%;
  display: flex;
  justify-content: end;
  padding-right: 36px;
  box-sizing: border-box;
  .tapenote-icon {
    display: none;
  }
  .tapenote-name {
    display: block;
  }
}
.middle {
  flex: 1;
  // min-width: 600px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .nav-list {
    display: flex;
  }
  .tools {
    width: 340px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.right {
  width: 21.5%;
  display: flex;
  align-items: center;
  justify-content: start;
  padding-left: 24px;
  box-sizing: border-box;

  .theme-switch {
    margin: 0 20px;
  }
  .collapse-btn {
    display: none;
  }
}

@include Desktop {
  .left {
    .tapenote-icon {
      display: none;
    }
    .tapenote-name {
      display: block;
    }
  }
}
@include Mobile {
  .left {
    .tapenote-icon {
      margin-left: 12px;
      display: block;
    }
    .tapenote-name {
      display: none;
    }
  }
  .middle {
    .nav-list {
      display: none;
    }
    .tools {
      display: none;
    }
  }
  .right {
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
