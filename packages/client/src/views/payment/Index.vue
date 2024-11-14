<script lang="ts" setup>
import { useMessage, useThemeVars } from 'naive-ui'
import { Icon } from '@iconify/vue'
import FilingsFooter from '../_common/FilingsFooter.vue'
import useStore from '@/store'
const props = defineProps<{
  account: string
}>()
const themeVars = useThemeVars()
const message = useMessage()
const { userStore } = useStore()

function handleClick() {
  userStore
    .addVip()
    .then(() => {
      message.success('订阅成功, 请重新登录')
    })
    .catch(err => {
      console.error(err)
      message.error('订阅失败')
      if(typeof err?.response?.data === 'string') {
        message.error(err.response.data)
      }
    })
}
</script>

<template>
  <div class="payment">
    <div class="header">
      <div class="account">{{ account }}</div>
      <div class="title">选择最适合您的计划</div>
    </div>
    <div class="main">
      <div class="content">
        <!-- 月付 -->
        <div class="option vip-month">
          <div class="option-title">免费</div>
          <div class="option-price">
            <span class="price-yuan">¥</span>
            <span>0</span>
          </div>
          <div class="option-desc">
            <div class="desc-title">基础服务</div>
            <div class="desc-content">
              <div class="desc-item">
                <Icon icon="mingcute:check-2-fill" height="18" />
                基础语音识别
              </div>
              <div class="desc-item">
                <Icon icon="mingcute:check-2-fill" height="18" />
                基础语音合成
              </div>
            </div>
          </div>
          <div class="option-button">
            <n-button class="button" block disabled>默认服务</n-button>
          </div>
        </div>
        <!-- 季付 -->
        <div class="option vip-quarter">
          <div class="option-title">月付 (正在提供免费试用)</div>
          <div class="option-price">
            <span class="price-yuan">¥</span>
            <del>8</del>
          </div>
          <div class="option-desc">
            <div class="desc-title">增值服务</div>
            <div class="desc-content">
              <div class="desc-item">
                <Icon icon="mingcute:check-2-fill" height="18" />
                云端语音识别 (更快,更精准)
              </div>
              <div class="desc-item">
                <Icon icon="mingcute:check-2-fill" height="18" />
                云端语音合成 (更快,更富有情感)
              </div>
            </div>
          </div>
          <div class="option-button">
            <n-button class="button" block @click="handleClick">立即订阅</n-button>
          </div>
        </div>
        <!-- 年付 -->
        <div class="option vip-year">
          <div class="option-title">年付</div>
          <div class="option-price">
            <span class="price-yuan">¥</span>
            <span>64</span>
          </div>
          <div class="option-desc">
            <div class="desc-title">增值服务</div>
            <div class="desc-content">
              <div class="desc-item">
                <Icon icon="mingcute:check-2-fill" height="18" />
                云端语音识别 (更快,更精准)
              </div>
              <div class="desc-item">
                <Icon icon="mingcute:check-2-fill" height="18" />
                云端语音合成 (更快,更富有情感)
              </div>
            </div>
          </div>
          <div class="option-button">
            <n-button class="button" block disabled>立即订阅</n-button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <!-- <FilingsFooter /> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.payment {
  height: 80vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  height: 120px;
  .account {
    font-size: 18px;
  }
  .title {
    font-size: 32px;
    font-weight: 600;
    // color: #e6e6e6;
  }
}
.main {
  flex: 1;
  .content {
    padding: 36px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin: 0 auto;
    .option {
      width: 294px;
      height: 544px;
      border: 1px solid hsla(0, 0%, 49%, 0.1);
      padding: 12px;
      display: flex;
      flex-direction: column;
      &:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }
      &:nth-child(2) {
        border-left: none;
        border-right: none;
      }
      &:last-child {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }

      .option-title {
        height: 48px;
        font-size: 24px;
      }
      .option-price {
        font-size: 48px;
        display: flex;
        .price-yuan {
          padding-top: 12px;
          margin-right: 3px;
          font-size: 24px;
          opacity: 0.8;
        }
      }
      .option-desc {
        flex: 1;
        padding-top: 24px;
        .desc-title {
          font-size: 24px;
        }
        .desc-content {
          padding-top: 12px;
          .desc-item {
            display: flex;
            align-items: center;
            font-size: 18px;
            .iconify {
              margin-right: 5px;
            }
          }
        }
      }
      .option-button {
        .button {
          height: 48px;
          border-radius: 6px;
          // background-color: #cac9c9;
        }
      }
    }

    .vip-year {
      color: hsla(0, 0%, 100%, 0.1);
    }
  }
}
.footer {
  height: 120px;
}
</style>
