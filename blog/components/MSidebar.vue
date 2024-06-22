<script lang="ts" setup>
import { NButton, NIcon, NInput, useDialog, useMessage, useThemeVars, type DropdownOption } from 'naive-ui'
// import CollectionItem from './private/CollectionItem.vue'
// import CreateCollectionForm from '../form/CreateCollectionForm.vue'
import { onMounted } from 'vue'
import { DriveFileRenameOutlineFilled } from '@vicons/material'
const themeVars = useThemeVars()
const message = useMessage()
const dialog = useDialog()
const router = useRouter()
onMounted(() => {
  // 获取数据
})
/** 折叠面板 */
const expandedNames = ref<any[]>(['1'])
function handleExpandedNamesChange(args: Array<any>) {
  expandedNames.value = args
}
/** 显示未分配管理 */
function handleUnfiledShow() {
  //
}
/** 合辑相关方法 */
const collectionMethods = {
  /** 添加合辑按钮 */
  handleAddClick(ev: PointerEvent) {
    // ev.preventDefault()
    // ev.stopPropagation()
    // dialog.create({
    //   title: '新建合辑',
    //   icon: () => h(DpzIcon, { icon: `${MaterialTypeEnum.FILLED}create_new_folder`, size: 24 }),
    //   content: () =>
    //     h(CreateCollectionForm, {
    //       submit(res) {
    //         // 新建合辑
          
    //         dialog.destroyAll()
    //       }
    //     })
    // })
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
              icon: () => h(NIcon, { component: DriveFileRenameOutlineFilled, size: 24 }),
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
                if (newname.value === '') message.error('合辑名称不能为空！')
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
  /** 合辑项目顺序发生变化时触发 */
  handleOrderChange() {}
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
</script>
<template>
    <div class="sidebar">
      <n-space class="wrapper" :vertical="true" size="large">
        <n-space class="btn-group" :vertical="true" size="large">
          <n-button class="collapse-item-btn" size="large" quaternary block @click="collectionMethods.handleToAuthManage">
            <n-space align="center">
              <Icon name="uil:github" />
              <span>授权管理</span>
            </n-space>
          </n-button>
          <!-- 布局管理 -->
          <n-button class="collapse-item-btn" size="large" quaternary block disabled>
            <n-space align="center">
              <Icon name="uil:github" />
              <span>布局管理</span>
            </n-space>
          </n-button>
          <!-- 待分配文档 -->
          <n-button 
            class="collapse-item-btn" 
            size="large" 
            quaternary 
            block
            @dragenter.prevent="dropMethods.handleDragEnter"
            @dragover.prevent="dropMethods.handleDragOver"
            @dragleave.prevent="dropMethods.handleDragLeave"
            @click="handleUnfiledShow" 
            @drop="dropMethods.handleDrop($event, '', false)"
          >
            <n-space align="center">
              <Icon name="uil:github" />
              <span>分拣管理</span>
            </n-space>
          </n-button>
        </n-space>
        <!-- 折叠面板项 -->
        <n-collapse :expanded-names="expandedNames" @update:expanded-names="handleExpandedNamesChange">
          <template #arrow>
            <Icon name="uil:github" />
          </template>
          <!-- 作品合辑 -->
          <n-collapse-item class="collapse-item" name="1">
            <template #header>
              <n-button class="collapse-item-btn" text size="large">作品合辑</n-button>
            </template>
            <template #header-extra>
              <Icon name="uil:github" @click="collectionMethods.handleAddClick" />
            </template>
            <!-- <Draggable
              v-model="collectionsDataStore.data"
              :itemKey="'id'"
              handle=".move"
              animation="300"
              @change="collectionMethods.handleOrderChange"
            >
              <template #item="{ element }">
                <CollectionItem
                  :key="element.id"
                  :item="element"
                  :dropdown-options="collectionMethods.generateOptions(element)"
                  @dragenter.prevent="dropMethods.handleDragEnter"
                  @dragover.prevent="dropMethods.handleDragOver"
                  @dragleave.prevent="dropMethods.handleDragLeave"
                  @drop.prevent="dropMethods.handleDrop($event, element.id, element.isPublish)"
                  @click="collectionMethods.handleItemClick(element.id)"
                />
              </template>
            </Draggable> -->
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
