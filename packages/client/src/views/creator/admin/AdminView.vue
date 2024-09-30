<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { NButton, NSpace, useDialog, useMessage } from 'naive-ui'
import type { DataTableColumns, FormItemRule, FormRules, UploadFileInfo } from 'naive-ui'
import { Main, Header } from '@/components'
import useStore from '@/store'
import UserInfo from './UserInfo.vue'
import UserConfig from './UserConfig.vue'
import Password from './Password.vue'
import PwdByEmail from './PwdByEmail.vue'
import SubmissionConfig from './SubmissionConfig.vue'
import SubscriptionConfig from './SubscriptionConfig.vue'
import ShortcutConfig from './ShortcutConfig.vue'
import { onMounted } from 'vue'
import { useSubmissionConfig, useSubscriptionConfig } from './hooks/_index'

const { userStore } = useStore()
const submissionConfig = useSubmissionConfig()
const subscriptionConfig = useSubscriptionConfig()
</script>

<template>
  <div class="admin">
    <!-- <Header :height="34"></Header> -->
    <div class="main">
      <n-card title="账户配置管理" style="height: 100%; margin-bottom: 16px; border-radius: 0">
        <n-tabs :placement="'left'" pane-class="pane">
          <!-- 个人信息 -->
          <n-tab-pane name="userInfo" tab="个人信息">
            <UserInfo />
          </n-tab-pane>
          <!-- 习惯配置 -->
          <n-tab-pane name="userConfig" tab="习惯配置">
            <UserConfig />
          </n-tab-pane>
          <!-- 密码安全 -->
          <n-tab-pane name="password" tab="密码安全">
            <n-tabs size="large" animated :tabs-padding="50">
              <n-tab-pane name="pwdByOld" tab="旧密码修改">
                <Password />
              </n-tab-pane>
              <n-tab-pane name="pwdByEmail" tab="邮箱修改">
                <PwdByEmail />
              </n-tab-pane>
            </n-tabs>
          </n-tab-pane>
          <!-- 投稿配置 -->
          <n-tab-pane name="submissionConfig" tab="投稿配置">
            <n-tabs
              v-model:value="submissionConfig.valueRef.value"
              type="card"
              :addable="submissionConfig.addableRef.value"
              :closable="submissionConfig.closableRef.value"
              tab-style="min-width: 80px;"
              pane-style="padding: 0px"
              @close="submissionConfig.handleClose"
              @add="submissionConfig.handleAdd"
            >
              <n-tab-pane v-for="panel in userStore.submissionConfig" :key="panel.id" :name="panel.id" :tab="panel.name || '未命名'">
                <SubmissionConfig :config="panel" />
              </n-tab-pane>
            </n-tabs>
          </n-tab-pane>
          <!-- 订阅博客 -->
          <n-tab-pane name="subscription" tab="订阅博客" disabled>
            <n-tabs
              v-model:value="subscriptionConfig.valueRef.value"
              type="card"
              :addable="subscriptionConfig.addableRef.value"
              :closable="subscriptionConfig.closableRef.value"
              tab-style="min-width: 80px;"
              pane-style="padding: 0px"
              @close="subscriptionConfig.handleClose"
              @add="subscriptionConfig.handleAdd"
            >
              <n-tab-pane v-for="panel in userStore.subscriptionConfig" :key="panel.id" :name="panel.id" :tab="panel.name || '未命名'">
                <SubscriptionConfig :config="panel" />
              </n-tab-pane>
            </n-tabs>
          </n-tab-pane>
          <!-- 快捷键 -->
          <n-tab-pane name="shortcut" tab="快捷键">
            <ShortcutConfig />
          </n-tab-pane>
          <!-- 关联账号 -->
          <n-tab-pane name="association" tab="关联账号" disabled>
            <!-- 添加关联账号，实现关联账号快速登陆功能 -->
          </n-tab-pane>
          <!-- 用户自定义语音文字互转接口（待开发） -->
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin {
  z-index: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.main {
  flex: 1;
  display: flex;
  box-sizing: border-box;
  position: relative;
}
.pane {
  height: 92vh;
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  background-color: unset;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: unset;
}

// /*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: unset;
  background-color: var(--dpz-scrollbarColor);
}
</style>
