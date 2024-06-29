<script lang="ts" setup>
import { NButton, NIcon, NSpace, useDialog, useMessage, useThemeVars } from 'naive-ui'
import type { DataTableColumns, DropdownOption } from 'naive-ui'
import ShowOrEdit from './MAuth/ShowOrEdit.vue'
import ShowOrSelect from './MAuth/ShowOrSelect.vue'
import DateDisplay from './MAuth/DateDisplay.vue'
import CancelBtn from './MAuth/CancelBtn.vue'
import _ from 'lodash'
import { onMounted } from 'vue'
import { computed } from 'vue'
import type { AuthCodeType, UserType } from '~/types'
import { Icon } from '#components'
import useStore from '~/store'

type Model = AuthCodeType
const { userStore, submissionStore } = useStore()
const message = useMessage()
const dialog = useDialog()
const themeVars = useThemeVars()
const router = useRouter()
const isOnlyShowUnparsed = ref(true)
// const user = ref<UserType>()
onMounted(() => {
  // console.log(router.currentRoute.value.query.id)
  const id = router.currentRoute.value.query.id as string
  submissionStore.fetch(id, isOnlyShowUnparsed.value)
})
const data = ref<AuthCodeType[]>([])

let editData = ref<Model | null>(null)

const renderIcon = (component: Component | string) => {
  if (typeof component === 'string') {
    return h(Icon, { name: component })
  }
  return h(NIcon, { component: component, size: 24 })
}
const handleEdit = (row: Model) => {
  if (editData.value && editData.value._id !== row._id) {
    message.error('请先保存上一个编辑项')
    return
  }
  if (!editData.value || editData.value._id !== row._id) {
    console.log(editData)
    editData.value = Object.assign({}, row)
  } else {
    if (_.isEqual(editData, row)) {
      editData.value = null
      return
    }
    $fetch<AuthCodeType>('/api/manage/authcode/update', {
      method: 'POST',
      body: editData.value
    }).then(res => {
      // console.log(res)
      data.value.some((item, index, arr) => {
        if (item._id === res._id) {
          arr[index].name = res.name
          arr[index].code = res.code
          arr[index].desc = res.desc
          arr[index].disabled = res.disabled
          arr[index].updateAt = res.updateAt
          return true
        }
      })
      editData.value = null
    }).catch(err => {
      message.error('保存失败,可能该授权码已存在!')
      if (editData.value) editData.value = null
    })
  }
}
const createColumns = ({ play }: { play: (row: Model) => void }): DataTableColumns<Model> => {
  return [
    {
      title: '名称',
      key: 'name',
      resizable: true,
      width: '15%',
      render: row =>
        h(ShowOrEdit, {
          hightlight: !row.disabled,
          type: '名称',
          isEdit: editData.value?._id === row._id,
          value: row.name,
          onUpdateValue(v) {
            editData.value!.name = v
          }
        })
    },
    {
      title: '授权码',
      key: 'code',
      resizable: true,
      width: '15%',
      render(row) {
        return h(ShowOrEdit, {
          hightlight: !row.disabled,
          type: '授权码',
          isEdit: editData.value?._id === row._id,
          value: row.code,
          onUpdateValue(v) {
            editData.value!.code = v
          }
        })
      }
    },
    {
      title: '描述',
      key: 'desc',
      resizable: true,
      width: '20%',
      render(row) {
        return h(ShowOrEdit, {
          hightlight: !row.disabled,
          type: '描述',
          isEdit: editData.value?._id === row._id,
          value: row.desc,
          onUpdateValue(v) {
            editData.value!.desc = v
          }
        })
      }
      // ellipsis: {
      //   tooltip: true
      // }
    },
    {
      title: '更新时间',
      key: 'updateAt',
      resizable: true,
      width: '12%',
      render(row) {
        return h(DateDisplay, {
          hightlight: !row.disabled,
          date: row.updateAt
        })
      },
      sortOrder: false,
      sorter: 'default'
      // sorter(rowA, rowB) {
      //   return Number(rowA.updateAt) - Number(rowB.updateAt)
      // }
    },
    {
      title: '创建时间',
      key: 'createAt',
      resizable: true,
      width: '12%',
      render(row) {
        return h(DateDisplay, {
          hightlight: !row.disabled,
          date: row.createAt
        })
      },
      sortOrder: false,
      sorter: 'default'
    },
    {
      title: '状态',
      key: 'disable',
      width: '8%',
      minWidth: '150px',
      resizable: true,
      render(row) {
        return h(ShowOrSelect, {
          hightlight: !row.disabled,
          isEdit: editData.value?._id === row._id,
          value: row.disabled,
          onUpdateValue(v: boolean, cb: () => void) {
            if ((v && row.name === '') || row.code === '') {
              cb()
              message.warning('名称和授权码不能为空')
              return
            }
            editData.value!.disabled = v
          }
        })
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: '18%',
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
                  tertiary: true,
                  size: 'small',
                  onClick: () => {
                    handleEdit(row)
                  }
                },
                {
                  default: () => {
                    return editData.value?._id === row._id ? '保存' : '编辑'
                  }
                }
              ),
              h(CancelBtn, {
                show: editData.value?._id === row._id,
                onClick: () => {
                  editData.value = null
                }
              }),
              h(
                NButton,
                {
                  strong: true,
                  tertiary: true,
                  size: 'small',
                  onClick: () => {
                    dialog.create({
                      title: '是否彻底删除？',
                      icon: () => renderIcon('material-symbols:delete'),
                      positiveText: '确定',
                      negativeText: '取消',
                      onPositiveClick: () => {
                        $fetch(`/api/manage/authcode/delete/${row._id}`, {
                          method: 'delete'
                        }).then(() => {
                          const index = data.value.findIndex(item => item._id === row._id)
                          data.value.splice(index, 1)
                        })
                      },
                      onNegativeClick: () => {
                        message.error('取消')
                      }
                    })
                  }
                },
                { default: () => '移除' }
              )
            ]
          }
        )
      }
    }
  ]
}

/** 展示列 */
const cities = ref(['name', 'code', 'desc', 'updateAt', 'createAt', 'disable', 'actions'])
const columnSelect = ref(false)
const columns = computed(() => createColumns({ play(row) {} }).filter((c: any) => cities.value.includes(c.key)))
// console.log(columns)
const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  // showSizePicker: true,
  // pageSizes: [6, 8, 10, 12],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  }
})

/** 添加 */
function handleAdd() {
  $fetch<AuthCodeType>('/api/manage/authcode/add').then(res => {
    data.value.push(res)
  }).catch(err => {
    message.error(err.response._data.message)
  })
}

/** 全局配置 */
// const value = ref(user.receiverStatus)
const status = [
  { label: '完全开放', value: 0 },
  { label: '启用', value: 1 },
  { label: '禁用', value: 2 }
]
function handleStatusUpdate(value: 0 | 1 | 2) {
  $fetch('/api/user/updateReceiver', {
    method: 'post',
    body: {
      status: value
    }
  }).then(() => {
    message.success('更新成功')
  }).catch(err => {
    console.log(err)
    message.error('更新失败')
  })
}

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
const options = ref<DropdownOption[]>([
  {
    label: () => (editData.value?._id ? '保存' : '编辑'),
    key: 'edit',
    props: {
      onClick: () => {
        targetRow.value && handleEdit(targetRow.value)
      }
    }
  },
  {
    label: '移除',
    key: 'delete',
    props: {
      onClick: () => {
        dialog.create({
          title: '是否彻底删除？',
          icon: () => renderIcon('material-symbols:delete'),
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            targetRow.value && $fetch(`/api/manage/authcode/delete/${targetRow.value?._id}`, {
              method: 'delete'
            }).then(() => {
              const index = data.value.findIndex(row => row._id === targetRow.value?._id)
              data.value.splice(index, 1)
            })
          },
          onNegativeClick: () => {
            message.error('取消')
          }
        })
      }
    }
  }
])
</script>

<template>
  <div class="auth-manage">
    <div class="header">
      <div class="group">
        <n-flex>
          <!-- 权限设置 -->
          <n-popselect v-model:value="userStore.receiverConfig.status" :options="status" @update:value="handleStatusUpdate">
            <n-button secondary>
              {{ status[userStore.receiverConfig.status || 0].label }}
            </n-button>
          </n-popselect>
          <!-- 显示筛选 -->
          <n-button secondary @click="columnSelect = !columnSelect"> 列可见 </n-button>
        </n-flex>
      </div>
      <div class="group" v-show="columnSelect">
        <n-checkbox-group v-model:value="cities">
          <n-space item-style="display: flex;">
            <n-checkbox value="name" label="名称" />
            <n-checkbox value="code" label="授权码" />
            <n-checkbox value="desc" label="描述" />
            <n-checkbox value="updateAt" label="更新时间" />
            <n-checkbox value="createAt" label="创建时间" />
            <n-checkbox value="disable" label="状态" />
          </n-space>
        </n-checkbox-group>
      </div>
      <div class="group">
        <n-button secondary @click="handleAdd">
          <Icon name="material-symbols:add-rounded" />
        </n-button>
      </div>
    </div>
    <n-data-table
      :columns="columns"
      :data="data"
      :pagination="paginationReactive"
      :bordered="false"
      :row-props="rowProps"
      @update:sorter="handleSorterChange"
    />
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="xRef"
      :y="yRef"
      :options="options"
      :show="showDropdownRef"
      :on-clickoutside="handleClickoutside"
      @select="handleSelect"
    />
  </div>
</template>

<style lang="scss" scoped>
.auth-manage {
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
