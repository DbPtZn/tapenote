import { useDialog } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { FragmentTrash } from '../private'
import { h, ref, watch } from 'vue'
import useStore from '@/store'

type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]
export function useTrash(id: string, account: string, hostname: string) {
  const { projectStore } = useStore()
  const { t } = useI18n()
  const dialog = useDialog()

  const removedFragments = ref<Fragment[]>(projectStore.fragment(id).getRemovedBySort())

  watch(
    () => projectStore.fragment(id).getRemovedBySort(),
    removedFragmentsData => {
      removedFragments.value = removedFragmentsData
    }
  )
  function handleTrashManage() {
    dialog.create({
      title: '回收站',
      content: () =>
        h(FragmentTrash, {
          data: removedFragments.value,
          onRestore: (fragmentId: string) => {
            projectStore.fragment(id).restore({ fragmentId })
          },
          onDelete: (fragmentId: string) => {
            projectStore.fragment(id).dele({
              fragmentId
            })
          },
          onExit: () => {
            dialog.destroyAll()
          }
        })
    })
  }

  return {
    removedFragments,
    handleTrashManage
  }
}
