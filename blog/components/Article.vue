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
const themeVars = useThemeVars()
const props = defineProps<{
  id: string
}>()
const message = useMessage()
const scrollerRef = ref()
const controllerRef = ref()
const editorRef = ref()
const rootRef = ref()
const state = ref<PublicArticleType>({
  UID: '',
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
// const { data, execute } = await useLazyFetch<PublicArticleType>('/api/article/' + props.id)
// .then((res) => {
//   if(res.error.value) {
//     message.error('获取文章失败!')
//     navigateTo('/')
//   }
//   if(res.data.value) data.value = res.data.value
//   console.log('获取文章数据成功!')
// })
let player: Editor
let pck: typeof import('~/editor')
onMounted(async () => {
  // console.log('onMounted')
  // execute().then(res => {
  //   console.log('获取数据')
  //   console.log(res)
  //   console.log(data.value)
  // })
  scrollerRef.value = document.body
  pck = await import('~/editor')
  $fetch<PublicArticleType>(`/api/article/${props.id}`).then(res => {
    console.log('use fetch')
    // console.log(res)
    state.value = res
    usePlayer({
      rootRef,
      editorRef,
      scrollerRef,
      controllerRef,
      data: state.value
    }).then(res => {
      player = res
      // console.log(player)
    })
  }).catch(err => {
    message.error('获取文章失败!')
    navigateTo('/')
  })
})
onUnmounted(() => {
  try {
    console.log('销毁依赖')
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
</script>

<template>
  <div ref="rootRef" class="article">
    <div class="wrapper">
      <div class="header">
        <div class="title">{{ state.title }}</div>
        <!-- <div class="intro">一段介绍的话</div> -->
        <div class="tags">
          <n-tag v-for="tag in state.tags" :bordered="false">{{ tag }}</n-tag>
        </div>
        <div class="detail">
          <div class="author">
            <n-icon :component="UserAvatar" />
            <span>{{ state.author.penname }}</span>
          </div>
          <div class="time">
            <n-icon :component="TimerOutlined" />
            <span>{{ dayjs(state.createAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
          <div class="wordage">
            <n-icon :component="TimerOutlined" />
            <span>{{ state.detail.wordage }}</span>
          </div>
          <div v-if="state.detail.duration" class="duration">
            <n-icon :component="TimerOutlined" />
            <span>{{ dayjs().minute(Math.floor(state.detail.duration/60)).second(state.detail.duration%60).format('mm:ss') }}</span>
          </div>
        </div>
        <n-divider />
      </div>
      <div class="main">
        <div ref="editorRef" class="content editor" />
        <div class="outliner">
          SSR（Server-Side Render）
        </div>
      </div>
    </div>
    <div v-show="state.type === 'course'" ref="controllerRef" :class="['controller']"></div>
  </div>
</template>
<style scoped lang="scss">
.article {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.wrapper {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.controller {
  position: fixed;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  z-index: 1;
  word-wrap: break-word;
}

.header {
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
      .n-icon {
        margin-right: 0.25rem;
      }
      span {
        color: v-bind('themeVars.infoColor');
      }
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
    max-width: 760px;
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
        background-color: v-bind('themeVars.cardColor');
      }
    }
  }
  .outliner {
    width: 100%;
    max-width: 240px;
    margin-top: 2rem;
    padding-left: 1.5rem;
    padding: .5rem;
  }
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
}
</style>
