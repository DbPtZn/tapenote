import useStore from "@/store"
import { useDialog } from "naive-ui"
import { computed, onMounted, ref } from "vue"

export function useSubscriptionConfig() {
  const { userStore } = useStore()
  const dialog = useDialog()
  const valueRef = ref()
  onMounted(() => {
    valueRef.value = userStore.subscriptionConfig[0]?.id
  })
  const addableRef = computed(() => {
    return {
      disabled: userStore.subscriptionConfig.length >= 10
    }
  })
  const closableRef = computed(() => {
    return userStore.subscriptionConfig.length > 1
  })
  function handleAdd() {
    userStore.addSubscriptionConfig().then(config => {
      valueRef.value = config.id
    })
  }
  function handleClose(name: string) {
    dialog.create({
      title: '确认删除？',
      content: '删除后无法恢复，确认删除吗？',
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: () => {
        userStore.removeSubscriptionConfig(name).then(() => {
          if (valueRef.value === name) {
            valueRef.value = userStore.subscriptionConfig[userStore.subscriptionConfig.length - 1].id
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