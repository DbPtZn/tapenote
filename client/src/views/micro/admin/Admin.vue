<script lang="ts" setup>
import useStore from '@/store'
import { Footer } from '../layout'
import { LibraryEnum } from '@/enums';
const { userStore, userListStore, recentStore, folderStore, folderTreeStore } = useStore()

function handleLogout() {
  const account = userStore.account
  const hostname = userStore.hostname
  userListStore.logout(account, hostname)
  userStore.$reset()
  recentStore.$reset()
  folderStore.$reset()
  folderTreeStore.$reset()
  localStorage.removeItem(`${LibraryEnum.NOTE}-folder`)
  localStorage.removeItem(`${LibraryEnum.COURSE}-folder`)
  localStorage.removeItem(`${LibraryEnum.PROCEDURE}-folder`)
  localStorage.removeItem(`currentFolderLib`)
}

</script>

<template>
  <div class="admin">
    <div class="main">
      <n-avatar :src="userStore.avatar" :size="64" />
      <div class="info">
        <div class="name">{{ userStore.nickname }}</div>
        <div class="account">{{ userStore.account }}</div>
      </div>
    </div>
    <div class="logout">
      <n-button block @click="handleLogout">退出登录</n-button>
    </div>
  </div>
  <Footer />
</template>

<style lang="scss" scoped>
.admin {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 24px;
  padding-bottom: 63px; // 底部导航栏预留空间
}
.main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: auto;
  .info {
    margin-top: 12px;
    .name {
      text-align: center;
    }
  }
}
.logout {
  width: 100%;
  height: fit-content;
  padding-bottom: 24px;
}
</style>
