<script lang="ts" setup>
import { inject, onMounted, onUnmounted, ref } from 'vue'
import { FormInst, FormRules} from 'naive-ui'
import { Subscription, fromEvent } from '@tanbo/stream'
interface ModelType {
  rows: number
  cols: number
  useTextbusStyle: boolean
}
const useClose = inject('useClose') as () => void
const props = defineProps<{
  rows?: number
  cols?: number
  onConfirm?: (res: ModelType) => void
  onConfirmEnd?: () => void
}>()
const formRef = ref<FormInst | null>(null)
const model = ref<ModelType>({
  rows: props.rows || 0,
  cols: props.cols || 0,
  useTextbusStyle: true
})
const rules: FormRules = {
  src: [
    {
      required: false
      // validator: (rule: FormItemRule, value: string) => {
      //   return value.length < 100
      // }
    }
  ]
}
function handleConfirm(e: MouseEvent) {
  formRef.value?.validate(errors => {
    if (!errors) {
      props.onConfirm && props.onConfirm(model.value)
      props.onConfirmEnd && props.onConfirmEnd()
      useClose()
    } else {
      console.log(errors)
      props.onConfirmEnd && props.onConfirmEnd()
    }
  })
}
const selector = ref<HTMLElement>()
const subs: Subscription[] = []
onMounted(() => {
  const map = new Map<HTMLElement, { row: number, col: number }>()
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      ((row: number, col: number) => {
        const cell = document.createElement('div')
        selector.value!.appendChild(cell)
        map.set(cell, {
          row,
          col
        })
      })(row, col)
    }
  }
  let flag = false
  subs.push(
    fromEvent(selector.value!, 'mouseover').subscribe(ev => {
      if (flag) {
        return
      }
      const srcElement = ev.target
      const config = map.get(srcElement as HTMLElement)
      if (config) {
        map.forEach((value, key) => {
          if (value.row <= config.row && value.col <= config.col) {
            key.classList.add('textbus-toolbar-table-quick-selector-selected')
          } else {
            key.classList.remove('textbus-toolbar-table-quick-selector-selected')
          }
        })
        model.value.cols = config.col + 1
        model.value.rows = config.row + 1
      }
    }),
    fromEvent(selector.value!, 'mouseleave').subscribe(ev => {
      if (!flag) {
        Array.from(map.keys()).forEach(el => el.classList.remove('textbus-toolbar-table-quick-selector-selected'))
      }
      flag = false
    }),
    fromEvent(selector.value!, 'click').subscribe(ev => {
      flag = true
    })
  )
})
onUnmounted(() => {
  subs.forEach(i => i.unsubscribe())
})
</script>

<template>
  <div class="image-form">
    <div ref="selector" class="textbus-toolbar-table-quick-selector"></div>
    <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
      <n-form-item path="rows" label="表格行数">
        <n-input-number v-model:value="model.rows" :min="0" placeholder="请输入表格行数" />
      </n-form-item>
      <n-form-item path="cols" label="表格列数">
        <n-input-number v-model:value="model.cols" :min="0" placeholder="请输入表格列数" />
      </n-form-item>
      <n-form-item :show-label="false">
        <n-checkbox v-model:checked="model.useTextbusStyle" style="margin-right: 12px"> 使用 Textbus 样式 </n-checkbox>
      </n-form-item>
      <n-button block @click="handleConfirm">确定</n-button>
    </n-form>
  </div>
</template>

<style lang="scss" scoped>
.image-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 6px;
}
.textbus-toolbar-table-quick-selector {
  overflow: hidden;
  padding-left: 1px;
  padding-top: 1px;
  width: 163px;
  box-sizing: content-box;
  cursor: pointer;
  margin-bottom: 15px;

  :deep(div) {
    width: 15px;
    height: 11px;
    box-sizing: content-box;
    border: 1px solid var(--tb-borderColor);
    background: var(--tb-baseColor);
    float: left;
    margin-left: -1px;
    margin-top: -1px;
    position: relative;

    &.textbus-toolbar-table-quick-selector-selected {
      background-color: rgba(18, 150, 219, 0.2);
      // background-color: var(--tb-primaryColor);
      border-color: rgba(18, 150, 219);
      z-index: 1;
    }
  }
}
</style>
