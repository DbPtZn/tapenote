<script lang="ts" setup>
import { NMessageProvider, useDialog, useThemeVars } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { VpnKeyOffOutlined, AddRound, VpnKeyOutlined, CloseRound, RemoveRound } from '@vicons/material'
import AddRole from './AddRole.vue'
import useStore from '@/store'
import { FormNumber } from '@textbus/editor'
type Timbre = ReturnType<typeof useStore>['timbreStore']['data'][0]
const props = defineProps<{
  account: string
  hostname: string
  data?: Timbre
  type: 'role' | 'robot'
  onSelect: (args: { key: number; type: 'role' | 'robot' }) => void
  onAdd: (args: { type: 'role' | 'robot'; avatar: string; name: string; role: number; changer?: number }) => void
  onRemove: (args: { type: 'role' | 'robot'; key: number }) => void
}>()
const dialog = useDialog()
const themeVars = useThemeVars()
const isShowKey = ref(false)
function handleClick(key: number, type: 'role' | 'robot') {
  props.onSelect({ key, type })
}
function handleAdd(type: 'role' | 'robot') {
  const d = dialog.create({
    title: `添加${type === 'role' ? '扮演角色' : '合成音色'}`,
    content: () =>
      h(
        NMessageProvider,
        {},
        {
          default: () =>
            h(AddRole, {
              account: props.account,
              hostname: props.hostname,
              type,
              submit: result => {
                props.onAdd(result)
                d.destroy()
              }
            })
        }
      )
  })
}
function handleRemove(key: number, type: 'role' | 'robot') {
  dialog.create({
      title: '删除',
      content: `是否删除？`,
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: () => {
        props.onRemove({ type, key })
      }
    })
}
</script>

<template>
  <div class="role-select-list">
    <n-tabs type="line" animated :default-value="type">
      <template #suffix>
        <n-button text>
          <n-icon :component="!isShowKey ? VpnKeyOutlined : VpnKeyOffOutlined" :size="24" @click="isShowKey = !isShowKey" />
        </n-button>
      </template>
      <n-tab-pane name="robot" tab="合成语音">
        <n-flex>
          <div class="role-item" v-for="role in data?.robotList" :key="role[0]">
            <div class="role-wrapper" :style="{ width: '50px' }" @click="handleClick(role[0], 'robot')">
              <n-icon v-if="role[0] !== 0" class="role-close" :component="CloseRound" @click.stop ="handleRemove(role[0], 'robot')" />
              <div class="role-avatar">
                <img
                  :src="role[1].avatar"
                  :alt="role[1].name"
                  :style="{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '3px' }"
                  @error="(e) => (e.target! as HTMLImageElement).src='./default.png'"
                />
              </div>
              <span v-if="!isShowKey" class="role-name">{{ role[1].name }}</span>
              <span v-if="isShowKey" class="role-name">{{ role[0] }}</span>
            </div>
          </div>
          <div class="role-add" @click="handleAdd('robot')">
            <n-icon :component="AddRound" :size="24" />
          </div>
        </n-flex>
      </n-tab-pane>
      <n-tab-pane name="role" tab="扮演角色">
        <n-flex>
          <div class="role-item" v-for="role in data?.roleList" :key="role[0]">
            <div class="role-wrapper" :style="{ width: '50px' }" @click="handleClick(role[0], 'role')">
              <n-icon v-if="role[0] !== 9999" class="role-close" :component="CloseRound" @click.stop ="handleRemove(role[0], 'role')" />
              <div class="role-avatar">
                <img
                  :src="role[1].avatar"
                  :alt="role[1].name"
                  :style="{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '3px' }"
                  @error="(e) => (e.target! as HTMLImageElement).src='./default.png'"
                />
              </div>
              <span v-if="!isShowKey" class="role-name">{{ role[1].name }}</span>
              <span v-if="isShowKey" class="role-name">{{ role[0] }}</span>
            </div>
          </div>
          <div class="role-add" @click="handleAdd('role')">
            <n-icon :component="AddRound" :size="24" />
          </div>
        </n-flex>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style lang="scss" scoped>
.role-select-list {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 0px;
  margin-bottom: 20px;
}
.role-wrapper {
  user-select: none;
  position: relative;
  width: 50px;
  height: 80px;
  display: flex;
  border-radius: 3px;
  padding: 5px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .role-close {
    position: absolute;
    top: 0;
    right: 0;
    color: v-bind('themeVars.textColor3');
    opacity: 0;
    transition: all 0.2s ease-in-out;
    &:hover {
      color: v-bind('themeVars.textColor1');
    }
  }
  .role-avatar {
    width: 50px;
    height: 50px;
    border-radius: 3px;
  }
  .role-name {
    font-size: 14px;
    line-height: 18px;
    margin-top: 8px;
    width: 50px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
    .role-close {
      opacity: 1;
    }
  }
}
.role-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.role-add {
  width: 50px;
  height: 80px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dotted v-bind('themeVars.borderColor');
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
  }
  &:active {
    background-color: v-bind('themeVars.buttonColor2Pressed');
  }
}
</style>
