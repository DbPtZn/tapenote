<script setup lang="ts">
import useStore from '@/store'
import { DropdownOption, NCheckbox, useDialog, useMessage, useThemeVars } from 'naive-ui'
import dayjs from 'dayjs'
import { MoreVertRound } from '@vicons/material'
import { h } from 'vue'
import { LibraryEnum } from '@/enums'
type Snapshot = NonNullable<ReturnType<typeof useStore>['projectStore']['data'][0]['snapshots']>[0]
const props = defineProps<{
  lib: LibraryEnum
  data: Snapshot
  current: boolean
}>()
const emits = defineEmits<{
  detail: [Snapshot]
  apply: [data: Snapshot, isAutoSave: boolean]
  delete: [Snapshot]
}>()
const dialog = useDialog()
const message = useMessage()
const themeVars = useThemeVars()
const options: DropdownOption[] = [
  {
    label: '查看详情',
    key: 'detail',
    disabled: true,
    props: {
      onClick: () => {
        // console.log('查看详情')
        emits('detail', props.data)
      }
    }
  },
  {
    label: `${props.lib === LibraryEnum.COURSE ? '应用版本' : '应用快照'}`,
    key: 'apply',
    props: {
      onClick: () => {
        let isAutoSave = props.lib !== LibraryEnum.COURSE
        dialog.info({
          title: '确定应用快照？',
          content: () =>
            props.lib !== LibraryEnum.COURSE
              ? h('div', {}, [
                  h(
                    NCheckbox,
                    { defaultChecked: isAutoSave, onUpdateChecked: checked => (isAutoSave = checked) },
                    {
                      default: () => '自动为当前项目创建历史快照'
                    }
                  )
                ])
              : '',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            // message.success(isAutoSave ? 'true' : 'false')
            emits('apply', props.data, isAutoSave)
          },
          onNegativeClick: () => {
            message.info('已取消')
          }
        })
      }
    }
  },
  {
    label: '删除',
    key: 'delete',
    props: {
      onClick: () => {
        dialog.create({
          title: '删除',
          content: '确定删除该快照吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            emits('delete', props.data)
          },
          onNegativeClick: () => {
            message.info('已取消')
          }
        })
      }
    }
  }
]
</script>

<template>
  <n-card class="card" size="small" :bordered="false">
    <template #header>
      <n-text class="title" :depth="2"> {{ data.title }} </n-text>
    </template>
    <template #header-extra>
      <!-- @click.prevent.stop=";" -->
      <n-dropdown trigger="hover" :options="options">
        <n-button text :size="'tiny'" class="icon">
          <n-icon :component="MoreVertRound" :size="24" />
        </n-button>
      </n-dropdown>
    </template>
    <template #default>
      <n-text class="content" :depth="3"> {{ data.abbrev }} </n-text>
    </template>
    <template #footer>
      <div class="footer">
        <n-text :class="['date']" :depth="3">{{ dayjs(data.createAt).format('YY-MM-DD HH:mm:ss') }}</n-text>
        <n-text :class="['current']" :depth="3">{{ current ? '当前版本' : '' }}</n-text>
      </div>
    </template>
  </n-card>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  margin-top: 1px;
  cursor: default;
  user-select: none;
  background-color: unset;
  border-radius: 0;
  border-top: 1px solid v-bind('themeVars.dividerColor');
  border-bottom: 1px solid #ffffff00 !important;
  transition: unset;
  .icon {
    cursor: pointer;
    transition: opacity 0.1s ease-in-out;
    opacity: 0;
  }
  .button {
    color: v-bind('themeVars.textColor2');
  }
  &:hover {
    .icon {
      opacity: 1;
    }
    border-radius: v-bind('themeVars.borderRadius');
    background-color: v-bind('themeVars.cardColor');
    border-top: 1px solid #ffffff00;
    &:last-child {
      border-bottom: 1px solid #ffffff00;
    }
  }
  &:first-child {
    border-top: 1px solid #ffffff00;
  }
  &:last-child {
    border-bottom: 1px solid v-bind('themeVars.dividerColor');
  }
  &:hover + .file-card {
    border-top: 1px solid #ffffff00;
  }
  &:hover + div {
    border-top: 1px solid #ffffff00;
  }
}

.title {
  margin-right: 6px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.content {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 12px;
}
.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 12px;
}
</style>
