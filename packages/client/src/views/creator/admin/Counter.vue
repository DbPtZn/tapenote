<script lang="ts" setup>
import useStore from '@/store'
import { Icon } from '@iconify/vue'
import dayjs from 'dayjs';
import { useMessage } from 'naive-ui';
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { userStore } = useStore()
const counter = computed(() => userStore.countor)
const { t } = useI18n()
const message = useMessage()

async function handleClick() {
  const info = await userStore.updateCountor()
  info && message.info(info)
}

</script>

<template>
  <div class="counter">
    <div class="refresh">
      <div class="update-date">
        <span>统计时间:</span>
        <p v-if="counter.date">{{ dayjs(counter.date).format('YY-MM-DD HH:mm:ss') }}</p>
      </div>
      <div>
        <n-button @click="handleClick" type="primary" size="small" ghost>更新统计</n-button>
      </div>
    </div>
    <n-row>
      <n-col :span="12">
        <n-statistic :label="`${$t('note')}数量`" :value="counter.noteCount">
          <template #prefix>
            <Icon icon="fluent:notebook-24-regular" height="24" />
          </template>
        </n-statistic>
      </n-col>
      <n-col :span="12">
        <n-statistic :label="`${$t('course')}数量`" :value="counter.courseCount">
          <template #prefix>
            <Icon icon="material-symbols:play-lesson-outline" height="24" />
          </template>
        </n-statistic>
      </n-col>
      <n-col :span="12">
        <n-statistic :label="`${$t('procedure')}数量`" :value="counter.procedureCount">
          <template #prefix>
            <Icon icon="material-symbols:coffee-maker-outline" height="24" />
          </template>
        </n-statistic>
      </n-col>
      <n-col :span="12">
        <n-statistic :label="`总字数`" :value="counter.wordCount">
          <template #prefix>
            <Icon icon="hugeicons:text" height="24" />
          </template>
        </n-statistic>
      </n-col>
      <n-col :span="12">
        <n-statistic :label="`存储资源用量`" :value="(counter.storageCount / 1024 / 1024).toFixed(2)">
          <template #prefix>
            <Icon icon="tdesign:hard-disk-storage" height="24" />
          </template>
          <template #suffix>
          MB
          </template>
        </n-statistic>
      </n-col>
    </n-row>
  </div>
</template>

<style lang="scss" scoped>
.counter {
  height: 100%;
  width: 40%;
  display: flex;
  // align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}
.refresh {
  position: absolute;
  right: 48px;
  .update-time {
    
  }
}
</style>
