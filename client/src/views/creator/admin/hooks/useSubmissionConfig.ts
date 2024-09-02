import useStore from "@/store"
import { useDialog, useMessage } from "naive-ui"
import { computed, onMounted, ref } from "vue"

export function useSubmissionConfig() {
  const { userStore } = useStore()
  const dialog = useDialog()
  const message = useMessage()
  const valueRef = ref()
  onMounted(() => {
    valueRef.value = userStore.submissionConfig[0]?.id
  })
  const addableRef = computed(() => {
    return {
      disabled: userStore.submissionConfig.length >= 10
    }
  })
  const closableRef = computed(() => {
    return userStore.submissionConfig.length > 1
  })
  function handleAdd() {
    userStore.addSubmissionConfig().then(config => {
      valueRef.value = config.id
    })
  }
  function handleClose(name: string) {
    if (name === 'Tapenote@Offical') {
      return message.warning('这条官方配置无法删除哟')
    }
    dialog.create({
      title: '确认删除？',
      content: '删除后无法恢复，确认删除吗？',
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: () => {
        userStore.removeSubmissionConfig(name).then(() => {
          if (valueRef.value === name) {
            valueRef.value = userStore.submissionConfig[userStore.submissionConfig.length - 1].id
          }
        })
      }
    })
  }
  return {
    valueRef,
    addableRef,
    closableRef,
    handleAdd,
    handleClose
  }
}