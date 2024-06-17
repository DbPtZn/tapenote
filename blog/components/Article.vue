<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import { TimerOutlined } from '@vicons/material'
import UserAvatar from './icons/UserAvatar.vue'
const themeVars = useThemeVars()
</script>

<template>
  <div class="article">
    <div class="wrapper">
      <div class="header">
        <div class="title">标题{{ $route.params.id }}</div>
        <div class="intro">一段介绍的话</div>
        <div class="tags">
          <n-tag :bordered="false">标签</n-tag>
        </div>
        <div class="detail">
          <div class="author">
            <n-icon :component="UserAvatar" />
            <span>作者</span>
          </div>
          <div class="time">
            <n-icon :component="TimerOutlined" />
            <span>2022-01-01</span>
          </div>
          <div class="wordage">
            <n-icon :component="TimerOutlined" />
            <span>字数</span>
          </div>
          <div class="duration">
            <n-icon :component="TimerOutlined" />
            <span>12:04</span>
          </div>
        </div>
        <n-divider />
      </div>
      <div class="main">
        <div class="content">
          <h1>SSR（Server-Side Render）</h1>
          <p>{{ `Vue是一个SPA框架，网页的内容完全在客户端完成渲染，如果你有看过请求Vue项目时，返回的第一个html文件，文件中有很多的<script>标签和一个<div id=app></div>之后，vue会使用请求到的js文件从这个div开始渲染页面。这导致了SPA项目对于SEO的优化不是很好。使用SSR时，完整的html文件会在服务端完成渲染，第一次请求时会返回完整的内容，搜索引擎可以捕捉这些内容，从而对搜索关键词、搜索结果进行优化。` }}</p>
          <p>{{ `除此之外，SSR还具有以下优点：` }}</p>
          <p>{{ `更快的初始页面加载时间: Nuxt将完全呈现的HTML页面发送到浏览器，可以立即显示。这可以提供更快的感知页面加载时间和更好的用户体验 (UX)，尤其是在较慢的网络或设备上。` }}</p>
          <p>{{ `在低功率设备上更好的性能: 它减少了需要在客户端下载和执行的JavaScript的数量，这对于可能难以处理繁重的JavaScript应用程序的低功率设备是有益的。` }}</p>
          <p>{{ `更好的可访问性: 内容在初始页面加载时立即可用，从而改善依赖屏幕阅读器或其他辅助技术的用户的可访问性。` }}</p>
          <p>{{ `更容易缓存: 页面可以在服务器端缓存，这可以通过减少生成内容并将内容发送到客户端所花费的时间来进一步提高性能。` }}</p>
        </div>
        <div class="outliner">
          SSR（Server-Side Render）
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.article {
  width: 100%;
}
.wrapper {
  width: 100%;
  margin: 0 auto;
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
