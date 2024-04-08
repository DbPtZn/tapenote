<script lang="ts" setup>
import { Component, h, onMounted, ref } from 'vue'
import { NButton, NIcon, NSpace, useDialog, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { Main, Header } from '@/components'
import useStore, { Subfile, TreeNode } from '@/store'
import { LibraryEnum } from '@/enums'
import utils from '@/utils'
import { Delete, RestoreFromTrash } from '@/components'
import { FolderTreeSelect } from '../_common'
import SelectOtherFolder from './private/SelectOtherFolder.vue'
type File = typeof trashStore.folders[0]
type TrashName = Parameters<typeof trashStore.fetchAndSet>[0]
const { trashStore, folderStore, folderTreeStore, projectStore, userStore } = useStore()
const message = useMessage()
const dialog = useDialog()
const tabsVal = ref<TrashName>('folder')
const libVal = ref<LibraryEnum>()
onMounted(() => {
  trashStore.fetchAndSet(tabsVal.value)
})
const renderIcon = (component: Component) => {
  return h(NIcon, { component: component, size: 24 })
}
const createColumns = (): DataTableColumns<File> => {
  return [
    {
      title: '名称',
      key: 'name',
      render(row) {
        return `${row.name.slice(0, 20)}`
      }
    },
    {
      title: '日期',
      key: 'updateAt',
      render(row) {
        return utils.dateFormat(new Date(row.updateAt))
      }
    },
    tabsVal.value !== 'folder'
      ? {
          title: '描述',
          key: 'abbrev',
          render(row) {
            return row.abbrev && `${row.abbrev.slice(0, 20)}...`
          }
        }
      : { title: '', key: 'null' },
    {
      title: '所属文件夹',
      key: 'folder',
      render(row) {
        return row.folderName ? row.folderName : ''
      }
    },
    {
      title: '操作',
      key: 'actions',
      render(rowData: File, rowIndex: number) {
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
                    dialog.create({
                      title: '是否恢复？',
                      icon: () => renderIcon(RestoreFromTrash),
                      positiveText: '确定',
                      negativeText: '取消',
                      onPositiveClick: () => {
                        methods.handleRestore(rowData, rowIndex)
                      },
                      onNegativeClick: () => {
                        message.error('取消')
                      }
                    })
                  }
                },
                { default: () => '恢复' }
              ),
              h(
                NButton,
                {
                  strong: true,
                  tertiary: true,
                  size: 'small',
                  onClick: () => {
                    dialog.create({
                      title: '是否彻底删除？',
                      content: tabsVal.value == 'folder' ? '此操作将永久删除该文件夹及其中的文件（但不包括子文件夹及子文件夹中的文件），是否继续？' : '此操作将永久删除该文件，是否继续？',
                      icon: () => renderIcon(Delete),
                      positiveText: '确定',
                      negativeText: '取消',
                      onPositiveClick: () => {
                        methods.handleDelete(rowData, rowIndex)
                      },
                      onNegativeClick: () => {
                        message.error('取消')
                      }
                    })
                  }
                },
                { default: () => '删除' }
              )
            ]
          }
        )
      }
    }
  ]
}
function selectFolder(folderId: string, lib: LibraryEnum) {
  return new Promise<string>((resolve, reject) => {
    if (folderId) {
      folderTreeStore.queryExist(folderId).then(isExist => {
        if (!isExist) {
          // 不存在，重新选择文件夹
          message.create('目标所属目录不存在或已移除,请重新选择目录')
          dialog.create({
            title: '选择文件夹',
            content: () =>
              h(SelectOtherFolder, {
                lib: lib,
                onSubmit: (otherId: string) => {
                  resolve(otherId)
                  dialog.destroyAll()
                }
              }),
            onClose: () => {
              message.error('取消')
            },
            onMaskClick: () => {
              message.error('取消')
            }
          })
        } else {
          // 存在，直接返回文件夹id
          resolve(folderId)
        }
      })
    } else {
      reject('缺失文件夹 ID ,还原文件失败')
      message.error('缺失文件夹 ID ,还原文件失败')
    }
  })
}
/** 更新回收站数据 */
function updateTrashState(rowIndex: number, type: 'delete' | 'restore') {
  if (tabsVal.value === 'folder' && type === 'delete') {
    trashStore.deleteFolder(rowIndex)
    return
  }
  trashStore.remove(rowIndex, tabsVal.value)
}
/** 更新文件夹数据 */
function updateFolderState(folderId: string | undefined, lib?: LibraryEnum) {
  // 如果其父节点正打开状态，恢复时刷新父节点数据
  if (folderId === folderStore.id) {
    folderStore.fetchAndSet(folderId!)
  }
}
/** 更新最近编辑数据 */
function updateRecentState(rowData: File, folderId: string, updateAt: string) {
  if (folderStore.id === 'recently') {
    const card: Subfile = {
      id: rowData.id,
      title: rowData.name,
      lib: rowData.lib!,
      abbrev: rowData.abbrev || '',
      updateAt: updateAt,
      createAt: rowData.createAt!,
      folderId: rowData.folderId!,
      folderName: rowData.folderName
    }
    folderStore.addSubFile(card, folderId, rowData.lib!)
  }
}
const methods = {
  handleRestore(rowData: File, rowIndex: number) {
    selectFolder(rowData.folderId!, rowData.lib || libVal.value!).then(folderId => {
      if (tabsVal.value === 'folder') {
        if (rowData.folderId && rowData.lib) {
          rowData.folderId = folderId
          const nodeData = trashStore.TrashDataToTreeNode(rowData)
          folderTreeStore.restore(nodeData).then(() => {
            updateTrashState(rowIndex, 'restore')
            updateFolderState(folderId, rowData.lib)
          })
        }
      } else {
        projectStore.restore(rowData.id, folderId, userStore.account, userStore.hostname).then(res => {
          console.log(rowData.lib)
          updateTrashState(rowIndex, 'restore')
          updateFolderState(folderId, rowData.lib)
          updateRecentState(rowData, folderId, res.data.updateAt)
        })
      }
    })
  },
  handleDelete(rowData: File, rowIndex: number) {
    if (tabsVal.value === 'folder') {
      folderTreeStore.delete(rowData.id).then(res => {
        updateTrashState(rowIndex, 'delete')
      })
    } else {
      projectStore.delete(rowData.id, userStore.account, userStore.hostname).then(() => {
        updateTrashState(rowIndex, 'delete')
      })
    }
  },
  handleUpdateValue(value: TrashName) {
    tabsVal.value = value
    switch (value) {
      case 'folder':
        libVal.value = undefined
        break
      case 'note':
        libVal.value = LibraryEnum.NOTE
        break
      case 'course':
        libVal.value = LibraryEnum.COURSE
        break
      case 'procedure':
        libVal.value = LibraryEnum.PROCEDURE
        break
    }
    trashStore.fetchAndSet(value)
  },
  handleBeforeLeave(value: string) {
    return true
  }
}
</script>

<template>
  <div class="trash">
    <Main :flex="1">
      <n-card title="回收站" style="height: 100%; margin-bottom: 16px; border-radius: 0">
        <n-tabs type="line" :value="tabsVal" animated @update:value="methods.handleUpdateValue">
          <n-tab-pane :name="'folder'" tab="文件夹">
            <n-data-table :columns="createColumns()" :data="trashStore.folders" :pagination="false" :bordered="false" :titleAlign="'center'" />
          </n-tab-pane>
          <n-tab-pane :name="'note'" tab="笔记">
            <n-data-table :columns="createColumns()" :data="trashStore.notes" :pagination="false" :bordered="false" :titleAlign="'center'" />
          </n-tab-pane>
          <n-tab-pane :name="'course'" tab="课程">
            <n-data-table :columns="createColumns()" :data="trashStore.courses" :pagination="false" :bordered="false" :titleAlign="'center'" />
          </n-tab-pane>
          <n-tab-pane :name="'procedure'" tab="工程">
            <n-data-table :columns="createColumns()" :data="trashStore.procedures" :pagination="false" :bordered="false" :titleAlign="'center'" />
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </Main>
  </div>
</template>

<style lang="scss" scoped>
.trash {
  z-index: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
