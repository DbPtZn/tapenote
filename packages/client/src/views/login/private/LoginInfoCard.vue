<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { Icon } from '@iconify/vue'
// import { CloseRound } from '@vicons/material'
import { onMounted, ref } from 'vue'
const props = defineProps<{
  avatar: string,
  account: string,
  hostname: string
}>()
const emits = defineEmits<{
  selected: [ account: string, hostname: string ]
  close: [ account: string, hostname: string ]
}>()
const themeVars = useThemeVars()
const imgurl = ref(props.avatar)
function handleError() {
  imgurl.value = './avatar03.png'
}
function handleSelected() {
  emits('selected', props.account, props.hostname)
}
function handleClose() {
  emits('close', props.account, props.hostname)
}
</script>

<template>
  <div class="login-info-card" @click="handleSelected">
    <n-avatar class="avatar" :src="imgurl" @error="handleError" />
    <n-flex :vertical="true">
      <n-text class="account">{{ account }}</n-text>
      <n-text class="hostname">{{ hostname }}</n-text>
    </n-flex>
    <!-- <n-icon class="close" :component="CloseRound" @click.stop.prevent="handleClose" /> -->
    <Icon class="close" icon="mdi:close" height="24" @click.stop.prevent="handleClose" /> />
  </div>
</template>

<style lang="scss" scoped>
.login-info-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px;
  background-color: v-bind('themeVars.cardColor');
  cursor: default;
}
.avatar {
  margin: 3px;
  margin-right: 9px;
  height: 48px;
  width: 48px;
}
.hostname {
  font-size: 12px;
}
.close {
  position: absolute;
  right: 6px;
  color: v-bind('themeVars.iconColor');
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
</style>
