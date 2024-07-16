<script setup lang="ts">
import { useMessage, useThemeVars } from 'naive-ui'
import { TimerOutlined } from '@vicons/material'
import UserAvatar from './icons/UserAvatar.vue'
import type { PublicArticleType } from '~/types'
import dayjs from 'dayjs'
import { usePlayer } from './hooks/usePlayer'
import type { Editor } from '@textbus/editor'
import '~/editor/style.css'
import 'material-icons/iconfont/material-icons.css'
import { fromEvent, type Subscription } from '@tanbo/stream'
const themeVars = useThemeVars()
const props = defineProps<{
  id: string
}>()
const message = useMessage()
const appConfig = useAppConfig()
const scrollerRef = ref()
const controllerRef = ref()
const editorRef = ref()
const outlineRef = ref()
const rootRef = ref()
const navRef = ref()
const state = ref<PublicArticleType>({
  UID: '',
  user: {
    UID: '',
    nickname: '',
    avatar: ''
  },
  editionId: '',
  fromEditionId: '',
  type: 'note',
  isParsed: false,
  msg: '',
  editorVersion: '',
  cover: '',
  title: '',
  content: '',
  abbrev: '',
  audio: '',
  promoterSequence: [],
  keyframeSequence: [],
  subtitleSequence: [],
  subtitleKeyframeSequence: [],
  tags: [],
  isPublish: false,
  author: {
    penname: '',
    avatar: '',
    email: '',
    blog: ''
  },
  detail: {
    wordage: 0,
    duration: 0,
    fileSize: 0
  },
  meta: {
    views: 0,
    likes: 0,
    collections: 0,
    comments: 0
  },
  _id: '',
  columnId: '',
  createAt: '',
  updateAt: ''
})

let player: Editor
let pck: typeof import('~/editor')
const subs: Array<Subscription> = []
let headings: NodeListOf<HTMLElement>
const outlineData: { tagName: string; text: string; offsetTop: number }[] = []
const activeIndex = ref(0)
onMounted(async () => {
  scrollerRef.value = document.body
  pck = await import('~/editor')
  $fetch<PublicArticleType>(`/api/article/${props.id}`).then(res => {
    state.value = res
    usePlayer({
      rootRef,
      editorRef,
      scrollerRef,
      controllerRef,
      outlineRef,
      data: state.value
    }).then(res => {
      player = res
      // console.log(player)
      const controller = player.get(pck.Player)
      subs.push(
        controller.onStateUpdate.subscribe(() => {
          if(controller.isPlaying) {
            navRef.value.setNavVisible(false)
          }
        }),
        /** 编辑器准备完成后，获取目录信息，生成目录数据 */
        player.onReady.subscribe(() => {
          headings = editorRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
          headings.forEach(heading => {
            outlineData.push({
              tagName: heading.tagName.toLocaleLowerCase(),
              text: heading.textContent || '',
              offsetTop: heading.offsetTop
            })
          })
        })
      )
    })
  }).catch(err => {
    message.error('获取文章失败!')
    navigateTo('/')
  })

  /** 监听 scroll 事件，设置目录焦点 */
  subs.push(
    fromEvent(document.body, 'scroll').subscribe(() => {
      activeIndex.value = outlineData.findIndex(item => item.offsetTop > document.body.scrollTop)
    })
  )
})

/** 销毁 */
onUnmounted(() => {
  try {
    console.log('销毁依赖')
    subs.forEach(sub => sub.unsubscribe())
    player.get(pck.Player).destory()
    player.get(pck.OutlineService).destory()
    player.get(pck.DialogProvider).destory()
    player.get(pck.AnimeProvider).destory()
    player.get(pck.Structurer).destory()
    player.get(pck.ThemeProvider).destory()
    player.get(pck.RootEventService).destory()
    player.get(pck.AnimeEventService).destory()
    player.destroy()
    console.log('编辑器是否已经销毁：' + player.destroyed)
  } catch (error) {
    console.log(error)
    console.error('编辑器销毁失败！')
  }
})

/** 目录显示/隐藏 */
const isOutlineShow = ref(true)
function handleOutlineVisible() {
  isOutlineShow.value = !isOutlineShow.value
}

/** 侧边抽屉显示/隐藏 */
const drawerActive = ref(false)
function handleMoreClick() {
  drawerActive.value = true
}

/** 侧边抽屉滚动控制 */
function handleScrollTo(offsetTop: number) {
  document.body.scrollTo({
    top: offsetTop - 10, // 滚动到指定位置( - 10px 偏移修正)
    behavior: 'smooth'
  })
}

</script>

<template>
  <ArticleHeader
    ref="navRef"
    :user="state.user"
    @outline-visible="handleOutlineVisible"
    @more-click="handleMoreClick"
  />
  <div ref="rootRef" class="article">
    <div class="wrapper">
      <div class="header">
        <div class="title">{{ state.title }}</div>
        <!-- <div class="intro">一段介绍的话</div> -->
        <div class="tags">
          <n-tag v-for="tag in state.tags" :bordered="false">{{ tag }}</n-tag>
        </div>
        <div class="detail">
          <!-- @click="handleBloggerClick(state.UID)" -->
          <div class="author">
            <Icon name="clarity:avatar-solid" size="20px"/>
            <span>{{ state.author.penname }}</span>
          </div>
          <div class="time">
            <Icon name="material-symbols:calendar-clock" size="20px"/>
            <span>{{ dayjs(state.createAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
          <div class="wordage">
            <Icon name="ant-design:field-number-outlined" size="24px"/>
            <span>{{ state.detail.wordage }}</span>
          </div>
          <div v-if="state.detail.duration" class="duration">
            <Icon name="material-symbols:alarm" size="20px"/>
            <span>{{ dayjs().minute(Math.floor(state.detail.duration/60)).second(state.detail.duration%60).format('mm:ss') }}</span>
          </div>
        </div>
        <n-divider />
      </div>
      <div class="main">
        <div ref="editorRef" class="content editor" />
        <div :class="['outline-wrapper']">
          <div ref="outlineRef" :class="['outliner', isOutlineShow ? '' : 'outline-visible']"></div>
        </div>
      </div>
    </div>
    <div v-show="state.type === 'course'" ref="controllerRef" :class="['controller']"></div>
  </div>
  <n-back-top class="back-top" :right="100" :to="rootRef" />
  <n-drawer v-model:show="drawerActive" width="40%" placement="right" :to="rootRef">
    <n-drawer-content title="Menu">
      <div vertical>
        <n-flex>
          <span>主题 ：</span>
          <n-switch class="theme-switch" @update:value="val => appConfig.theme.dark = val" :value="appConfig.theme.dark" size="medium">
            <template #icon>
              <span v-if="!appConfig.theme.dark">☀</span>
              <span v-if="appConfig.theme.dark">🌙</span>
            </template>
          </n-switch>
        </n-flex>
        <n-divider class="divider"/>
        <div class="custom-outline">
          <n-flex vertical>
            目录
            <div v-for="(item, index) in outlineData" :key="index" :class="['outline-heading-item', `outline-heading-${item.tagName}`]">
              <a
                :class="['outline-heading-text', activeIndex === index ? 'outline-heading-active' : '']"
                href="javascript:;"
                @click="handleScrollTo(item.offsetTop)"
              >
                {{ item.text }}
              </a>
            </div>
          </n-flex>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
<style scoped lang="scss">

.outline-wrapper {
  position: relative;
  
  .outliner {
    position: sticky;
    top: 80px;
    width: 100%;
    height: fit-content;
    max-width: 144px;
    margin-top: 2rem;
    padding-left: 1.5rem;
    padding: .5rem;
  }
}

.outline-visible {
  display: none;
}

.article {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background-color: v-bind('themeVars.cardColor');
}
.wrapper {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.controller {
  position: fixed;
  z-index: 1;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  word-wrap: break-word;
}

.header {
  position: relative;
  .title {
    font-weight: 600;
    font-size: 2.25rem;
    line-height: 2.5rem;
    margin-bottom: 1.5rem;
    height: 40px;
  }
  .intro {
    margin-top: 2rem;
    margin-bottom: 0.25rem;
  }
  .tags {
    display: flex;
    margin-top: 0.75rem;
  }
  .detail {
    display: flex;
    flex-direction: row;
    font-size: 1rem;
    margin-top: 1.5rem;
    overflow: hidden;
    flex-wrap: wrap;
    div {
      display: flex;
      align-items: center;
      margin-right: 1rem;
      span {
        margin-left: 0.25rem;
        opacity: 0.8;
        // color: v-bind('themeVars.infoColor');
      }
    }
    .author {
      cursor: pointer;
    }
  }
  .n-divider {
    margin-top: 1rem;
  }
}

.main {
  display: flex;
  flex-direction: row;
  width: 100%;
  .content {
    width: 100%;
    // max-width: 880px;
  }
  .editor {
    height: 100%;
    :deep(.textbus-container) {
      height: 100% !important;
      margin: 0 auto;
      outline: none;
      border: none;
      border-radius: 0px;
      .textbus-ui-middle {
        border: none;
        // max-width: v-bind('state.editorWidth');
        // max-width: 880px;
        width: 100%;
        margin: 0 auto;
        // background-color: v-bind('themeVars.cardColor');
      }
    }
  }
}

.divider {
  margin-top: 1rem;
}
@media (min-width: 1280px) {
  .wrapper {
    padding-top: 4rem;
  }
}
@media (min-width: 1024px) {
  .wrapper {
    max-width: 1024px;
  }
}

@include SmallDesktop {
  .header {
    padding: 12px 8px 0px 8px;
    box-sizing: border-box;
  }
  .main {
    .content {
      max-width: 1024px;
    }
    .outliner {
      display: none;
    }
  }
}

@include Mobile {
  .header {
    padding: 12px 8px 0px 8px;
    box-sizing: border-box;
    .detail {
      justify-content: space-between;
      .wordage {
        display: none;
      }
      .duration {
        display: none;
      }
    }
  }

  .main {
    .outliner {
      display: none;
    }
  }

  .controller {
    display: none;
  }
  :deep(.back-top) {
    display: none;
  }
}


.custom-outline {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.outline-heading-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: v-bind('themeVars.textColor3');
  &:hover {
    color: v-bind('themeVars.textColor1');
  }
}
.outline-heading-active {
  color: v-bind('themeVars.textColor1');
}
.outline-heading-h1 {
  line-height: 2;
  padding-left: 0em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h2 {
  line-height: 2;
  padding-left: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h3 {
  line-height: 2;
  padding-left: 2em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h4 {
  line-height: 2;
  padding-left: 3em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h5 {
  line-height: 2;
  padding-left: 4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h6 {
  line-height: 2;
  padding-left: 5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
