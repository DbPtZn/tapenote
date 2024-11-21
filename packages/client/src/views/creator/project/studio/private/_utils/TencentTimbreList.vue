<script lang="ts" setup>
import { DataTableColumns } from 'naive-ui'
import { tencentTimbreList } from './tencentTimbreList'
interface TimbreItem {
  id: number
  name: string
  type: string
  tone: string
  language: string
  sampling_rate: string
  emotion: string
}

function createColumns(): DataTableColumns<TimbreItem> {
  return [
    {
      title: '音色 ID',
      key: 'id'
    },
    {
      title: '音色名称',
      key: 'name'
    },
    {
      title: '推荐场景',
      key: 'type'
    },
    // {
    //   title: '音色类型',
    //   key: 'tone'
    // },
    {
      title: '支持语言',
      key: 'language'
    },
    // {
    //   title: '采样率',
    //   key: 'sampling_rate'
    // },
    {
      title: '音色情感',
      key: 'emotion'
    }
  ]
}
const columns = createColumns()
const data = tencentTimbreList
</script>

<template>
  <div>
    <h2>当前支持的音色</h2>
    <n-data-table :columns="columns" :data="data" />
  </div>
</template>
