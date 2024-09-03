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
import { ref } from 'vue';
type NavOption = 'home' | 'folder' | 'share' | 'user'
const themeVars = useThemeVars()
const selected = ref<NavOption>('home')
</script>

<template>
  <div class="footer">
    <div class="footer-item" @click="selected = 'home'">
      <n-icon :component="selected === 'home' ? CreateFilled : CreateOutlined" :size="24" />
    </div>
    <div class="footer-item" @click="selected = 'folder'">
      <n-icon :component="selected === 'folder' ? FolderFilled : FolderOutlined" :size="24" />
    </div>
    <div class="footer-item" @click="selected = 'share'">
      <n-icon :component="selected === 'share' ? EmergencyShareFilled : EmergencyShareOutlined" :size="24" />
    </div>
    <div class="footer-item" @click="selected = 'user'">
      <n-icon :component="selected === 'user' ? AccountCircleFilled : AccountCircleOutlined" :size="24" />
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
