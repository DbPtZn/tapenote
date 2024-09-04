<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import {
  CreateFilled,
  HomeFilled,
  MapFilled,
  FolderFilled,
  AccountCircleFilled,
  EmergencyShareFilled,
  CreateOutlined,
  HomeOutlined,
  MapOutlined,
  FolderOutlined,
  AccountCircleOutlined,
  EmergencyShareOutlined
} from '@vicons/material'
import { ref } from 'vue'
import useStore from '@/store'
import router from '@/router';
import { RouteNameEnum } from '@/enums'
const { microStore } = useStore()
const themeVars = useThemeVars()
const tabname = ref(RouteNameEnum.RECENT)
function handleClick(tab: RouteNameEnum) {
  router.push({ name: tab })
  tabname.value = tab
}
</script>

<template>
  <div class="footer">
    <div class="footer-item" @click="handleClick(RouteNameEnum.RECENT)">
      <n-icon :component="tabname === RouteNameEnum.RECENT ? CreateFilled : CreateOutlined" :size="24" />
    </div>
    <div class="footer-item" @click="handleClick(RouteNameEnum.FOLDER)">
      <n-icon :component="tabname === RouteNameEnum.FOLDER ? FolderFilled : FolderOutlined" :size="24" />
    </div>
    <div class="footer-item" @click="handleClick(RouteNameEnum.SHARE)">
      <n-icon :component="tabname === RouteNameEnum.SHARE ? EmergencyShareFilled : EmergencyShareOutlined" :size="24" />
    </div>
    <div class="footer-item" @click="handleClick(RouteNameEnum.ADMIN)">
      <n-icon :component="tabname === RouteNameEnum.ADMIN ? AccountCircleFilled : AccountCircleOutlined" :size="24" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  height: 63px;
  min-height: 63px;
  background-color: v-bind('themeVars.cardColor');
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
</style>
