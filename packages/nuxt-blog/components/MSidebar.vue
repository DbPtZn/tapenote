<script lang="ts" setup>
import { NButton, NIcon, NInput, useDialog, useMessage, useThemeVars, type DropdownOption } from 'naive-ui'
// import CollectionItem from './private/CollectionItem.vue'
// import CreateCollectionForm from '../form/CreateCollectionForm.vue'
import CreateColumnForm from './MSidebar/CreateColumnForm.vue'
import { onMounted } from 'vue'
// import { DriveFileRenameOutlineFilled } from '@vicons/material'
import { Icon } from '#components'
import { VueDraggable, type SortableEvent } from 'vue-draggable-plus'
import useStore from '~/store'
import ColumnItem from './MSidebar/ColumnItem.vue'
import type { ColumnType } from '~/types'
const themeVars = useThemeVars()
const message = useMessage()
const dialog = useDialog()
const router = useRouter()
const { columnListStore, columnStore, userStore } = useStore()
onMounted(() => {
  // 获取数据
  columnListStore.get()
})

/** 折叠面板 */
const expandedNames = ref<any[]>(['1'])
function handleExpandedNamesChange(args: Array<any>) {
  expandedNames.value = args
}
/** 显示未分配管理 */
// function handleUnfiledShow() {}
/** 专栏相关方法 */
const columnMethods = {
  /** 添加专栏按钮 */
  handleAddClick(ev: PointerEvent) {
    ev.preventDefault()
    ev.stopPropagation()
    dialog.create({
      title: '新建专栏',
      icon: () => h(Icon, { name: 'material-symbols:create-new-folder-outline-rounded', style: { marginBottom: '8px' } }),
      content: () =>
        h(CreateColumnForm, {
          onSubmit(res) {
            // console.log(res)
            columnListStore.create(res)
            dialog.destroyAll()
          }
        })
    })
  },
  handleItemClick(id: string) {
    // console.log(id)
    //
  },
  handleToAuthManage() {
    router.push('./manage/auth')
  },
  /** 生成下拉列表选项 */
  generateOptions: (collection: any): DropdownOption[] => {
    return [
      {
        label: `${collection.isPublish ? '设为私密' : '设为公开'}`,
        key: 'publish',
        props: {
          onClick: () => {
            //
          }
        }
      },
      {
        key: 'header-divider',
        type: 'divider'
      },
      {
        label: '设置',
        key: 'settings',
        disabled: true,
        props: {
          onClick: () => {
            //
          }
        }
      },
      {
        label: '重命名',
        key: 'rename',
        props: {
          onClick: () => {
            const newname = ref(collection.name)
            dialog.create({
              icon: () => h(Icon, { name: 'DriveFileRenameOutlineFilled', size: '24px' }),
              title: '文件夹重命名',
              content: () =>
                h(NInput, {
                  type: 'text',
                  placeholder: '输入新名称',
                  maxlength: 32,
                  showCount: true,
                  value: newname.value,
                  onInput: value => {
                    newname.value = value
                  }
                }),
              positiveText: '确定',
              negativeText: '取消',
              maskClosable: true,
              onPositiveClick: () => {
                if (newname.value === collection.name) return
                if (newname.value === '') message.error('专栏名称不能为空！')
                if (newname.value && collection.id) {
                  // collectionsDataStore.rename(collection.id, newname.value).then(() => {
                  //   collection.name = newname.value
                  //   if (collectionStore.id === collection.id) {
                  //     collectionStore.name = newname.value
                  //   }
                  // })
                }
              }
            })
          }
        }
      },
      {
        label: '移除',
        key: 'remove',
        props: {
          onClick: () => {
            // collectionsDataStore.remove(collection.id)
          }
        }
      }
    ]
  },
}
const dropMethods = {
  handleDrop(ev: DragEvent, collectionId: string, isPublish: boolean) {
    const fileId = ev.dataTransfer?.getData('id')
    if (!fileId) return
    // console.log([fileId, collectionId])
    // productStore
    //   .allocation({
    //     id: fileId,
    //     collectionId: collectionId,
    //     isPublish: isPublish
    //   })
    //   .then(res => {
    //     collectionStore.removeSubfileById(fileId)
    //   })
    //   .catch(err => console.log(err))
  },
  handleDragEnter() {},
  handleDragOver() {},
  handleDragLeave() {}
}
const data = computed(() => columnListStore.data.sort((a, b) => {
  const sequence = userStore.columnSequence
  return sequence!.indexOf(a._id) - sequence!.indexOf(b._id)
}))
function handleMove(event: SortableEvent) {
  const oldIndex = event.oldIndex
  const newIndex = event.newIndex
  const columnId = event.item.id
  if(oldIndex === undefined || newIndex === undefined || columnId === undefined) return
  userStore.updateColumnSequence(oldIndex, newIndex, columnId)
}
function handleColumnClick(column: ColumnType) {
  columnStore.fetch(column._id)
}
</script>
<template>
    <div class="sidebar">
      <n-space class="wrapper" :vertical="true" size="large">
        <n-space class="btn-group" :vertical="true" size="large">
          <Nuxt-link to="/manage/auth">
            <n-button class="collapse-item-btn" size="large" quaternary block>
                <n-space align="center">
                  <Icon name="hugeicons:authorized" :size="'24'" />
                  <span>授权管理</span>
                </n-space>
            </n-button>
          </Nuxt-link>
          <!-- 布局管理 -->
          <!-- <n-button class="collapse-item-btn" size="large" quaternary block disabled>
            <n-space align="center">
              <Icon name="mingcute:layout-10-line" />
              <span>布局管理</span>
            </n-space>
          </n-button> -->
          <!-- 稿件管理 -->
          <Nuxt-link to="/manage/submission">
            <n-button 
              class="collapse-item-btn"
              size="large" 
              quaternary
              :bordered="false"
              block
              @dragenter.prevent="dropMethods.handleDragEnter"
              @dragover.prevent="dropMethods.handleDragOver"
              @dragleave.prevent="dropMethods.handleDragLeave"
              @drop="dropMethods.handleDrop($event, '', false)"
            >
              <n-space align="center">
                <Icon name="material-symbols-light:folder-data-outline-rounded" :size="'24'" />
                <span>稿件管理</span>
              </n-space>
            </n-button>
          </Nuxt-link>
        </n-space>
        <!-- 折叠面板项 -->
        <n-collapse class="collapse-wrapper" :expanded-names="expandedNames" @update:expanded-names="handleExpandedNamesChange">
          <template #arrow>
            <Icon name="material-symbols:arrow-right-rounded"  :size="'24'"/>
          </template>
          <!-- 作品专栏 -->
          <n-collapse-item class="collapse-item" name="1">
            <template #header>
              <n-button class="collapse-item-btn" text size="large">作品专栏</n-button>
            </template>
            <template #header-extra>
              <Icon name="material-symbols:add-rounded"  :size="'24'" @click="columnMethods.handleAddClick" />
            </template>
            <VueDraggable class="draggable" handle=".move" v-model="data" :itemKey="'_id'" @end="handleMove($event)">
              <ColumnItem v-for="item in data" :key="item._id" :id="item._id" :item="item" @click="handleColumnClick(item)" />
            </VueDraggable>
          </n-collapse-item>
          <!-- 轮播管理 -->
          <!-- 首推管理 -->
          <n-collapse-item class="collapse-item" name="2">
            <template #header>
              <n-button class="collapse-item-btn" text size="large">首页推荐</n-button>
            </template>
            <span>首推文件</span>
          </n-collapse-item>
          <!-- 分类管理 -->
          <n-collapse-item class="collapse-item" name="3">
            <template #header>
              <n-button class="collapse-item-btn" text size="large">分类推荐</n-button>
            </template>
            <!-- 首推：增加一个首推标记字段，并限制首推产品的数量，查询时就可以通过字段进行筛选 -->
            <span>首推文件</span>
          </n-collapse-item>
        </n-collapse>
      </n-space>
    </div>
</template>

<style lang="scss" scoped>
:deep(.n-button__content) {
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: 18px;
}
.sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  box-sizing: border-box;
  border-right: 1px solid v-bind('themeVars.dividerColor');
  background-color: v-bind('themeVars.bodyColor');
  box-sizing: border-box;
}
.main {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 18px 6px 0px 12px;
  box-sizing: border-box;
  .wrapper {
    width: 100%;
    .btn-group {
      margin-bottom: 12px;
    }
  }
}

.collapse-wrapper {
  padding: 6px 3px;
  box-sizing: border-box;
}
.collapse-item {
  user-select: none;
  .collapse-item-btn {
    font-size: 18px;
  }
  .collapse-item-icon {
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
  }
  &:hover {
    .collapse-item-icon {
      opacity: 1;
    }
  }
}
</style>
