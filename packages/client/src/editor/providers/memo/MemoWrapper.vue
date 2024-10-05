<script lang="ts" setup>
import { inject } from 'vue'
import { Injector } from '@textbus/core'
import MemoVue from './Memo.vue'
import { MemoService } from '../..'
import { Memo } from './memo.provider'

const injector = inject('injector') as Injector
const props = defineProps<{ 
  memos: Memo[]
}>()
const memoService = injector.get(MemoService)

const methods = {
  handleResizeMemo(id: string, width: number, height: number) {
    memoService.onResize.next({ id, width, height })
  },
  handleMoveMemo(id: string, x: number, y: number) {
    memoService.onMove.next({ id, x, y })
  },
  handleUpdateMemoBgColor(id: string, bgColor: 'yellow' | 'green' | 'pink' | 'purple' | 'blue' | 'white' | 'gray') {
    memoService.onUpdateBgColor.next({ id, bgColor })
  },

  handleExpandMemo(id: string, isExpanded: boolean) {
    memoService.onExpand.next({ id, isExpanded })
  },
  handleDeleteMemo(id: string) {
    memoService.onDelete.next({ id })
  },
  handleSaveMemo(id: string, content: string) {
    memoService.onSave.next({ id, content })
  }
}

</script>

<template>
  <MemoVue
    v-for="item in memos"
    :key="item.id"
    :id="item.id"
    :content="item.content"
    :is-expanded="item.isExpanded"
    :x="item.x"
    :y="item.y"
    :width="item.width"
    :height="item.height"
    :bgcolor="item.bgColor"
    @resize="methods.handleResizeMemo"
    @move="methods.handleMoveMemo"
    @update-color="methods.handleUpdateMemoBgColor"
    @expand="methods.handleExpandMemo"
    @delete="methods.handleDeleteMemo"
    @save="methods.handleSaveMemo"
  />
</template>

<style lang="scss" scoped>

</style>
