<script setup lang="ts">
import TrashFragment from './TrashFragment.vue'
import useStore from '@/store'
import { HeadsetOutlined, RestoreOutlined, DeleteOutlined } from '@vicons/material'
type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]
const props = defineProps<{
  data: Fragment[]
  onRestore: (fragmentId: string) => void
  onDelete: (fragmentId: string) => void
  onExit: () => void
}>()
const handleError = (ev: Event) => {
  const target = ev.target as HTMLImageElement
  target.src = './image-error.png'
}
function handlePlay(audio: string) {
  const aud = new Audio(audio)
  aud.play()
  aud.onended = () => {
    aud.remove()
  }
}
</script>

<template>
  <div class="fragment-trash">
    <!-- <Header :height="50" :border-bottom="true">
      <span style="fontSize: 18px">片段回收站</span>
    </Header> -->
    <Main class="main">
      <n-scrollbar style="max-height: 300px">
        <TrashFragment v-for="item in data" :key="item.id" :role="item.speaker.role">
          <template #avatar>
            <img :src="item.speaker.avatar || './empty.png'" @error="handleError" />
          </template>
          <template #txt>
            <span>{{ item.transcript.join('') }}</span>
          </template>
          <template #play>
            <n-icon :component="HeadsetOutlined" :size="18" @click="handlePlay(item.audio)" />
          </template>
          <template #restore>
            <n-icon :component="RestoreOutlined" :size="18" @click="onRestore(item.id)" />
          </template>
          <template #delete>
            <n-icon :component="DeleteOutlined" :size="18" @click="onDelete(item.id)" />
          </template>
        </TrashFragment>
      </n-scrollbar>
    </Main>
    <Footer class="footer">
      <!-- <el-button class="btn" type="primary" @click="cancelCallback(1)"> 确定 </el-button> -->
      <n-button class="btn" type="primary" @click="onExit"> 退出 </n-button>
    </Footer>
  </div>
</template>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 12px;
}
.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  .btn {
    margin-right: 12px;
  }
}
.fragment-trash {
  display: flex;
  flex-direction: column;
}
</style>
