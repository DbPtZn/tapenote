<script lang="ts" setup>
import { NButton, NIcon, NSelect, NSpace, useDialog, useMessage, useThemeVars } from 'naive-ui'
import type { DataTableColumns, PaginationInfo } from 'naive-ui'
import _ from 'lodash'
import { onMounted, createApp, computed } from 'vue'
import type { Submission } from '~/types'
import { Icon } from '#components'
import useStore from '~/store'
import dayjs from 'dayjs'
import '@textbus/editor/bundles/textbus.min.css'
import { useParser } from './hooks/useParser'
import type { AllotArticleDto, ParseArticleDto } from '~/dto'
import { RemovedEnum } from '~/enums'
type Model = Submission
const { userStore, submissionStore, columnListStore } = useStore()
const message = useMessage()
const dialog = useDialog()
const themeVars = useThemeVars()
const router = useRouter()
// const user = ref<UserType>()
const id = computed(() => router.currentRoute.value.query.id as string)
const page = computed(() => Number(router.currentRoute.value.query.page))
const docs = ref<Submission[]>([])
// const state = reactive({
//   docs: [] as Submission[],
//   totalDocs: 2,
//   limit: 2,
//   totalPages: 2,
//   page: 1,
//   pagingCounter: 2,
//   hasPrevPage: false,
//   hasNextPage: false,
//   prevPage: null,
//   nextPage: 2,

//   isParsed: 'all'
// })
onMounted(() => {
  // 考虑在离开页面的时候在 store 保存当前的状态(分页、id)
  // 返回稿件管理页面时恢复状态
  submissionStore.fetch({
    filter: { removed: RemovedEnum.NEVER },
    limit: 2,
    page:  1
  }).then(data => docs.value = data)
  console.log(submissionStore.docs)
})
onUnmounted(() => {
  console.log('离开')
  submissionStore.$reset()
})
const renderIcon = (component: string) => {
  return h(Icon, { name: component })
}
const handleParse = (row: Model) => {
  $fetch('/api/manage/parse/' + row._id).then(async (res: any) => {
    try {
      const parser = useParser()
      const result = await parser.parseContent(res.content)
      const dto: ParseArticleDto = {
        _id: row._id,
        content: result.content,
        cover: result.cover.split(window.location.host)[1],
        duration: res.duration, // 音频时长
        promoterSequence: res.promoterSequence, // 启动子序列
        keyframeSequence: res.keyframeSequence, // 关键帧序列
        subtitleSequence: res.subtitleSequence, // 字幕序列
        subtitleKeyframeSequence: res.subtitleKeyframeSequence // 字幕关键帧序列
      }
      $fetch('/api/manage/article/parse', {
        method: 'POST',
        body: dto
      })
        .then(() => {
          message.success('解析成功')
          row.abbrev = result.content.replace(/<[^>]+>/g, '').slice(0, 100)
          row.isParsed = true
        })
        .catch(error => {
          console.log(error)
          message.error('解析失败,项目文件可能损坏或不符合稿件规范！')
        })
    } catch (error) {
      console.log(error)
    }
  })
}

const handleOpen = (row: Model) => {
  message.success(row._id)
  router.push('/manage/article/' + row._id)
}

const createColumns = ({ play }: { play: (row: Model) => void }): DataTableColumns<Model> => {
  return [
    {
      title: '类型',
      key: 'type',
      resizable: true,
      width: '8%',
      render: row => h(Icon, { name: row.type === 'note' ? 'mdi:notebook' : 'material-symbols-light:play-lesson-rounded', size: '24px' })
    },
    {
      title: '专栏',
      key: 'column',
      resizable: true,
      width: '8%',
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return row.column?.name
      }
    },
    {
      title: '标题',
      key: 'title',
      resizable: true,
      width: '10%',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '内容缩略',
      key: 'abbrev',
      resizable: true,
      width: '10%',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '授权来源',
      key: 'authcode',
      resizable: true,
      width: '10%',
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return row.authcode.name
      }
    },
    {
      title: '作者',
      key: 'author',
      resizable: true,
      width: '8%',
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return row.author.penname
      }
    },
    {
      title: '稿件备注',
      key: 'msg',
      resizable: true,
      width: '10%',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '解析状态',
      key: 'isParsed',
      resizable: true,
      width: '10%',
      render: row => h(Icon, { name: row.isParsed ? 'mdi:email-open' : 'material-symbols-light:mail-lock', size: '24px' })
    },
    {
      title: '更新时间',
      key: 'updateAt',
      resizable: true,
      width: '12%',
      sortOrder: false,
      sorter: 'default',
      render(row) {
        return dayjs(row.updateAt).format('YYYY-MM-DD HH:mm:ss')
      }
      // sorter(rowA, rowB) {
      //   return Number(rowA.updateAt) - Number(rowB.updateAt)
      // }
    },
    {
      title: '创建时间',
      key: 'createAt',
      resizable: true,
      width: '12%',
      sortOrder: false,
      sorter: 'default',
      render(row) {
        return dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: '12%',
      minWidth: '200px',
      maxWidth: '200px',
      render(row) {
        return h(
          NSpace,
          { align: 'baseline' },
          {
            default: () => [
              h(
                NButton,
                {
                  strong: true,
                  type: 'primary',
                  size: 'small',
                  onClick: () => {
                    row.isParsed ? handleOpen(row) : handleParse(row)
                  }
                },
                {
                  default: () => {
                    return row.isParsed ? '打开' : '解析'
                  }
                }
              ),
              h(
                NButton,
                {
                  show: !row.isParsed,
                  strong: true,
                  tertiary: true,
                  size: 'small',
                  onClick: () => {
                    if(row.isParsed) {
                      const opitons = columnListStore.data.map(item => {
                        return {
                          key: item._id,
                          label: item.name,
                          value: item._id
                        }
                      })
                      const columnVal = ref(row.column?._id)
                      dialog.create({
                        title: '选择一个专栏',
                        content: () => h(NSelect, {
                          value: columnVal.value,
                          options: opitons,
                          onUpdateValue: (value) => {
                            columnVal.value = value
                          }
                        }),
                        icon: () => renderIcon('material-symbols-light:folder-data-rounded'),
                        positiveText: '确定',
                        negativeText: '取消',
                        onPositiveClick: () => {
                          const dto: AllotArticleDto = {
                            articleId: row._id,
                            columnId: columnVal.value
                          }
                          $fetch(`/api/manage/article/allot`, {
                            method: 'POST',
                            body: dto
                          }).then(() => {
                            const index = docs.value.findIndex(item => item._id === row._id)
                            const column = columnListStore.data.find(item => item._id === columnVal.value)
                            if(!column) return
                            docs.value[index].column = column
                          })
                        },
                        onNegativeClick: () => {
                          message.error('取消')
                        }
                      })
                      return
                    }
                    dialog.create({
                      title: '确定拒稿？',
                      content: '一旦拒稿将无法再恢复，请谨慎确认！',
                      icon: () => renderIcon('material-symbols:do-not-touch-sharp'),
                      positiveText: '确定',
                      negativeText: '取消',
                      onPositiveClick: () => {
                        // $fetch(`/api/manage/authcode/delete/${row._id}`, {
                        //   method: 'delete'
                        // }).then(() => {
                        //   const index = data.value.findIndex(item => item._id === row._id)
                        //   data.value.splice(index, 1)
                        // })
                      },
                      onNegativeClick: () => {
                        message.error('取消')
                      }
                    })
                  }
                },
                { default: () => (row.isParsed ? '分配' : '拒稿') }
              )
            ]
          }
        )
      }
    }
  ]
}

/** 展示列 */
const cities = ref(['type', 'title', 'abbrev', 'authcode', 'column', 'msg', 'author', 'isParsed', 'updateAt', 'createAt', 'actions'])
const columnSelect = ref(false)
const columns = computed(() => createColumns({ play(row) {} }).filter((c: any) => cities.value.includes(c.key)))
// console.log(columns)

/** 排序 */
// const columnsRef = ref(columns)
function handleSorterChange(sorter: any) {
  columns.value.forEach((column: any) => {
    /** column.sortOrder !== undefined means it is uncontrolled */
    if (column.sortOrder === undefined) return
    if (!sorter) {
      column.sortOrder = false
      return
    }
    if (column.key === sorter.columnKey) column.sortOrder = sorter.order
    else column.sortOrder = false
  })
}

/** 右键菜单 */
const targetRow = ref<null | Model>(null)
const showDropdownRef = ref()
const xRef = ref(0)
const yRef = ref(0)
function handleClickoutside() {
  showDropdownRef.value = false
}
function handleSelect() {
  showDropdownRef.value = false
}
const rowProps = (row: Model) => {
  return {
    style: { height: '59px' },
    onContextmenu: (e: MouseEvent) => {
      targetRow.value = row
      // message.info(JSON.stringify(row, null, 2))
      e.preventDefault()
      showDropdownRef.value = false
      nextTick().then(() => {
        showDropdownRef.value = true
        xRef.value = e.clientX
        yRef.value = e.clientY
      })
    }
  }
}
// const options = ref<DropdownOption[]>([
//   {
//     label: () => (editData.value?._id ? '保存' : '编辑'),
//     key: 'edit',
//     props: {
//       onClick: () => {
//         // targetRow.value && handleParse(targetRow.value)
//       }
//     }
//   },
//   {
//     label: '移除',
//     key: 'delete',
//     props: {
//       onClick: () => {
//         dialog.create({
//           title: '是否彻底删除？',
//           icon: () => renderIcon('material-symbols:do-not-touch-sharp'),
//           positiveText: '确定',
//           negativeText: '取消',
//           onPositiveClick: () => {
//             // targetRow.value && $fetch(`/api/manage/authcode/delete/${targetRow.value?._id}`, {
//             //   method: 'delete'
//             // }).then(() => {
//             //   const index = data.value.findIndex(row => row._id === targetRow.value?._id)
//             //   data.value.splice(index, 1)
//             // })
//           },
//           onNegativeClick: () => {
//             message.error('取消')
//           }
//         })
//       }
//     }
//   }
// ])

const showSelectOption = ref(submissionStore.isParsed)
const showSelectOptions = [
  { label: '全部', value: 'all' },
  { label: '已解析', value: 'true' },
  { label: '未解析', value: 'false' }
]
function handleShowSelectOptionUpdate(value) {
  // console.log(value)
  submissionStore.isParsed = value
  submissionStore.fetch({
    filter: { _id: id.value, removed: RemovedEnum.NEVER },
    limit: 2,
    page: 1
  }).then(data => docs.value = data)
}

/** 翻页 */
function handlePageChange(page: number) {
  console.log('page change')
  // router.push({
  //   path: router.currentRoute.value.path,
  //   query: {
  //     id: id.value,
  //     page: page,
  //   }
  // })
  submissionStore.fetch({
    filter: { _id: id.value, removed: RemovedEnum.NEVER },
    limit: 2,
    page: page || 1
  }).then(data => docs.value = data)
}

</script>

<template>
  <div class="submission-manage">
    <div class="header">
      <div class="group">
        <n-flex>
          <!-- 权限设置 -->
          <!-- <n-popselect v-model:value="userStore.receiverConfig.status" :options="status" @update:value="handleStatusUpdate">
            <n-button secondary>
              {{ status[userStore.receiverConfig.status || 0].label }}
            </n-button>
          </n-popselect> -->
          <!-- 显示筛选 -->
          <n-button secondary @click="columnSelect = !columnSelect"> 列可见 </n-button>
        </n-flex>
      </div>
      <div class="group" v-show="columnSelect">
        <ClientOnly>
          <n-checkbox-group v-model:value="cities">
            <n-space item-style="display: flex;">
              <n-checkbox value="type" label="类型" />
              <n-checkbox value="column" label="专栏" />
              <n-checkbox value="title" label="标题" />
              <n-checkbox value="abbrev" label="内容" />
              <n-checkbox value="authcode" label="授权来源" />
              <n-checkbox value="author" label="作者" />
              <n-checkbox value="msg" label="稿件备注" />
              <n-checkbox value="isParsed" label="解析状态" />
              <n-checkbox value="updateAt" label="更新时间" />
              <n-checkbox value="createAt" label="创建时间" />
              <n-checkbox value="actions" label="操作" />
            </n-space>
          </n-checkbox-group>
        </ClientOnly>
      </div>
      <div class="group">
        <n-select
          v-model:value="showSelectOption"
          :options="showSelectOptions"
          :consistent-menu-width="false"
          @update:value="handleShowSelectOptionUpdate"
        />
      </div>
    </div>
    <n-data-table
      :columns="columns"
      :data="docs"
      :bordered="false"
      :row-props="rowProps"
      @update:sorter="handleSorterChange"
    />
    <div class="footer">
      <n-pagination 
        v-model:page="submissionStore.page"
        :page-count="submissionStore.getTotalPages"
        @update:page="handlePageChange"
      />
    </div>
    <!-- <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="xRef"
      :y="yRef"
      :options="options"
      :show="showDropdownRef"
      :on-clickoutside="handleClickoutside"
      @select="handleSelect"
    /> -->
  </div>
</template>

<style lang="scss" scoped>
.submission-manage {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: v-bind('themeVars.cardColor');
  .header {
    height: 60px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .group {
      display: flex;
      align-items: center;
      flex-direction: row;
      font-size: 16px;
      font-weight: 500;
      margin: 0 24px;
      cursor: pointer;
    }
  }
}
.footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  background-color: unset;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: unset;
}

// /*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: var(--dpz-scrollbarColor);
}
</style>
