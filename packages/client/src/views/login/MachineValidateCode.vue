<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { onMounted, ref } from 'vue'
import useStore from '@/store'
const { userListStore } = useStore()
const themeVars = useThemeVars()
const props = defineProps<{
  onConfirm: (result: boolean) => void
}>()
const codeSvg = ref()
const code = ref('')
onMounted(() => {
  resetCode()
})
const resetCode = () => {
  // remoteApi.auth.getCode().then(res => {
  //   codeSvg.value = res.data.svg
  //   model.value.hashCode = res.data.hashCode
  // })
}
function handleConfirm() {
  props.onConfirm(true)
}
</script>

<template>
  <div class="code-input">
    <n-input class="form-input" v-model:value="code" type="text" placeholder="验证码" />
    <n-button text> <span class="svg-code" v-html="codeSvg" @click="resetCode" /> </n-button>
  </div>
  <div class="code-confirm">
    <n-button @click="handleConfirm">确认</n-button>
    <n-button>取消</n-button>
  </div>
</template>

<style lang="scss" scoped>
// .default {
//   height: 100%;
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-bottom: 1px solid v-bind('themeVars.dividerColor');
//   border-right: 1px solid v-bind('themeVars.dividerColor');
// }
</style>
