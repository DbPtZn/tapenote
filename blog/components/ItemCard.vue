/** 文章卡片 */
<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import { computed, reactive } from 'vue'
import dayjs from 'dayjs'
interface Count {
  like: number //点赞数
  comment: number // 评论数
  collection: number // 收藏数
  read: number // 阅读数
}
const themeVars = useThemeVars()
const props = defineProps({
  mode: {
    type: String as PropType<'normal' | 'small' | 'mini'>,
    default: 'mini'
  },
  id: {
    type: String,
    require: true
  },
  msg: {
    type: String,
    require: false,
    vaildator(value: string) {
      return value.length <= 30
    }
  },
  createAt: {
    type: String,
    require: false
  },
  avatar: {
    type: String,
    require: false
  },
  penname: {
    type: String,
    require: false,
    vaildator(value: string) {
      return value.length <= 28
    }
  },
  /** 作者介绍 */
  intro: {
    type: String,
    require: false,
  },
  cover: {
    type: String,
    require: false
  },
  title: {
    type: String,
    require: false,
    vaildator(value: string) {
      return value.length <= 60
    }
  },
  abbrev: {
    type: String,
    require: false
    // vaildator(value: string) {
    //   return value.length <= 60
    // }
  },
  columnName: {
    type: String,
    require: false
  },
  wordage: {
    type: Number,
    require: false
  },
  tags: {
    type: Array as PropType<string[]>,
    require: false
  },
  count: {
    type: Object as PropType<Count>,
    require: false
  }
})
const state = reactive({
  id: props.id || undefined,
  msg: props.msg || '',
  createAt: props.createAt ? dayjs(props.createAt || null).format('YYYY-MM-DD HH:mm:ss') : '',
  avatar: props.avatar || './avatar03.png',
  penname: props.penname || '佚名',
  intro: props.intro || '',
  cover: props.cover || '',
  title: props.title || '无标题',
  abbrev: props.abbrev || '无内容',
  columnName: props.columnName || '',
  tags: props.tags || [],
  count: props.count || { like: 0, comment: 0, collection: 0, read: 0 }
})
const emits = defineEmits<{
  readMore: [id: string]
  viewAuthor: []
  toCollection: []
  toTag: [tag: string]
}>()
const config = {
  like: false,
  unlike: false,
  comment: false,
  share: false,
  collect: false,
  love: false,
  more: false
}
const methods = {
  handleError: (ev: Event) => {
    const target = ev.target as HTMLImageElement
    target.src = './error.png'
  }
}
</script>

<template>
  <div class="item-card">
    <div class="msg">{{ state.msg }}</div>
    <div class="header">
      <div class="title" @click="emits('readMore', state.id!)">
        {{ state.title }}
      </div>
    </div>
    <div v-if="mode === 'normal'" class="main">
      <n-flex>
        <div class="container">
          <div class="author-info" @click="emits('viewAuthor')">
            <n-avatar class="avatar" size="small" :src="state.avatar" fallback-src="./avatar03.png" />
            <span class="author-info-txt pen-name">{{ state.penname }}</span>
            <span v-if="state.intro" class="author-info-txt comma">，</span>
            <span class="author-info-txt detail">{{ state.intro }}</span>
          </div>
          <div class="abbrev">
            <div v-if="state.cover" class="first-image">
              <img :src="state.cover" alt="" @error="methods.handleError" />
            </div>
            <div class="text">
              {{ state.abbrev.slice(0, 100) }}
              <span>...</span>
              <a class="expand"  @click="emits('readMore', state.id!)">
                <span>阅读全文</span>
                <!-- <n-icon class="icon" :component="MoreHorizRound" :size="18" /> -->
                ...
              </a>
            </div>
          </div>
        </div>
      </n-flex>
    </div>
    <div class="footer">
      <div v-if="mode === 'normal'">
        <n-flex align="center">
          <n-button class="collection" strong secondary type="info" :size="'small'" @click="emits('toCollection')">
            {{ columnName }}
          </n-button>
          <n-tag class="tag" v-for="tag in state.tags" :key="tag" :bordered="false" @click="emits('toTag', tag)" >
            {{ tag }}
          </n-tag>
        </n-flex>
      </div>
      <div class="action">
        <div class="createAt">{{ state.createAt.toString() }}</div>
        <n-divider class="divider" vertical />
        <span>{{ wordage || 0 }} 字</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 16px 20px;
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
  .item-card-wrapper {
    display: flex;
  }
  // &:hover {
  //   .createAt {
  //     display: none;
  //   }
  //   .collection {
  //     display: block;
  //   }
  // }
}
.msg {
  color: v-bind('themeVars.textColor3');
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  .title {
    overflow: hidden;
    cursor: pointer;
    font-size: 18px;
    font-synthesis: style;
    font-weight: 600;
    margin-bottom: -4px;
    margin-top: -4px;
    word-break: break-word;

    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: pre-line;
  }
}
.main {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  .author-info {
    display: flex;
    align-items: center;
    .avatar {
      width: 22px;
      height: 22px;
    }
    .pen-name {
      margin-left: 10px;
      font-synthesis: style;
      font-weight: 600;
      cursor: pointer;
    }
    .detail {
      max-width: 300px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .author-info-txt {
      font-size: 16px;
      text-align: center;
      vertical-align: middle;
    }
  }
  .abbrev {
    display: flex;
    flex-direction: row;
    max-height: 100px;
    margin-bottom: -4px;
    margin-top: 9px;
    word-break: break-word;
    line-height: 1.67;
    font-size: 16px;
    margin-bottom: 12px;
    .first-image {
      min-width: 190px;
      height: 105px;
      margin-right: 12px;
      img {
        height: 100%;
        width: 100%;
        // object-fit: cover;
      }
    }
    .text {
      // overflow: hidden;
      display: -webkit-box;
      // text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      // -webkit-line-clamp: 2;
      word-break: break-all;
      white-space: pre-line;
    }
    .expand {
      display: inline-flex;
      cursor: pointer;
      align-items: center;
      text-align: center;
      margin-left: 5px;
      color: v-bind('themeVars.textColor3');
      &:hover {
        color: v-bind('themeVars.textColor2');
      }
    }
  }
}
.footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn {
    display: flex;
    align-items: center;
    padding: 0;
    span {
      line-height: 32px;
    }
  }
  .tag {
    cursor: pointer;
    &:hover {
      background-color: v-bind('themeVars.buttonColor2');
    }
  }
  .collection {
    color: v-bind('themeVars.textColor1');
  }
  .interact {
    padding-left: 24px;
    flex: 1;
    display: flex;
    flex-direction: row;
    opacity: 0.8;
  }
  .action {
    display: flex;
    align-items: center;
  }
  .like {
    .like-btn {
      padding: 0;
      padding-right: 8px;
    }
    .unlike-btn {
      margin-left: 6px;
      padding: 0 6px;
    }
  }

  .comment {
    // margin-left: 36px;
    .comment-txt {
      margin-left: 6px;
    }
  }
  .more {
    transition: opacity 0.3s ease-in-out;
    // opacity: 0;
  }
  .createAt {
    opacity: 0.5;
  }
  // .collection {
  //   display: none;
  //   cursor: pointer;
  // }
}

.left-side {
  .item-card-left {
    // width: 100px;
    img {
      height: 100%;
      width: 100%;
    }
  }
}

.middle-side {
  .item-card-middle-wrapper {
    display: flex;
    flex-direction: column;
    .item-card-middle-time {
      color: v-bind('themeVars.textColor3');
    }
    .item-card-middle-title {
      font-size: 1.5em;
      font-weight: 600;
      line-height: 2em;
    }
    .item-card-middle-content {
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>
<!-- 交互功能：去中心化的路线不考虑实现 -->
<!-- <div class="like action">
  <n-button v-if="config.like" class="btn like-btn" secondary>
    <DpzIcon class="icon" :icon="`${MaterialTypeEnum.FILLED}arrow_drop_up`" :size="24" />
    点赞
    {{ state.count.like ? state.count.like : '' }}
  </n-button>
  <n-button v-if="config.unlike" class="btn unlike-btn" secondary>
    <DpzIcon class="icon" :icon="`${MaterialTypeEnum.FILLED}arrow_drop_down`" :size="24" />
  </n-button>
</div>
<div class="interact">
  <n-flex>
    <div v-if="config.comment" class="comment action">
      <n-button class="btn" text>
        <DpzIcon class="icon" :icon="`${MaterialTypeEnum.FILLED}chat_bubble`" :size="22" />
        <span v-if="state.count.comment" class="comment-txt">{{ state.count.comment }} 条评论</span>
        <span v-if="!state.count.comment">&nbsp; 添加评论</span>
      </n-button>
    </div>
    <div v-if="config.share" class="share action">
      <n-button class="btn" text>
        <DpzIcon class="icon" :icon="`${MaterialTypeEnum.FILLED}near_me`" :size="22" />
        <span>&nbsp;分享</span>
      </n-button>
    </div>
    <div v-if="config.collect" class="collect action">
      <n-button class="btn" text>
        <DpzIcon class="icon" :icon="`${MaterialTypeEnum.FILLED}star_rate`" :size="22" />
        <span>&nbsp;收藏</span>
      </n-button>
    </div>
    <div v-if="config.love" class="love action">
      <n-button class="btn" text>
        <DpzIcon class="icon" :icon="`${MaterialTypeEnum.FILLED}mood`" :size="22" />
        <span>&nbsp;喜欢</span>
      </n-button>
    </div>
    <div v-if="config.more" class="more action">
      <n-button class="btn" text>
        <DpzIcon class="icon" :icon="`${MaterialTypeEnum.FILLED}more_horize`" :size="22" />
      </n-button>
    </div>
  </n-flex>
</div> -->