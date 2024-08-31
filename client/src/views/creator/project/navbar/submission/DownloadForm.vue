<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CascaderOption, FormInst, FormItemRule, FormRules, useMessage } from 'naive-ui'
import { LibraryEnum } from '@/enums'
import { SelectBaseOption } from 'naive-ui/es/select/src/interface'
import useStore from '@/store'
import { pack } from '../../../_utils'
interface ModelType {
  site: string
  code: string
  penname: string
  title: string // 标题
  email: string // 邮箱
  blog: string // 博客地址
  msg: string // 提交时的备注信息
  // isShared: boolean // 是否已经加入分享（不考虑实现）
  // dir: [] // 合辑目录（暂不实现）
}
type Response = ModelType & Record<string, unknown>
// const { userStore } = useStore()
// const message = useMessage()
const props = defineProps<{
  type: 'note' | 'course'
  site?: string
  code?: string
  penname?: string
  title: string
  content: string // 内容
  abbrev?: string
  audio?: string
  duration?: number
  wordage?: number
  promoterSequence?: string[]
  keyframeSequence?: number[]
  subtitleSequence?: string[]
  subtitleKeyframeSequence?: number[]
  email?: string
  blog?: string
  onResponse: (result: { type: 'error' | 'success'; msg: string }) => void
  onSubmit: () => void
}>()
const formRef = ref<FormInst | null>(null)
/** 表单数据 */
const model = ref<ModelType>({
  site: props.site || '',
  code: props.code || '',
  penname: props.penname || '佚名',
  title: props.title || '',
  email: props.email || '',
  blog: props.blog || '',
  msg: ''
})
/** 表单规则 */
const rules: FormRules = {
  site: [],
  code: [],
  penname: [],
  title: [
    {
      required: true,
      message: '作品名称不能为空',
      trigger: 'blur'
    }
  ],
  email: [],
  blog: [],
  msg: [
    {
      required: false,
      message: '请输入描述',
      trigger: 'blur'
    },
    {
      message: '备注信息长度不能超过60个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 60
      }
    }
  ]
}
// const value = ref('null')
// const options = computed(() => {
//   const opts = userStore.submissionConfig.map(config => {
//     return {
//       label: config.name,
//       value: config.id
//     }
//   })
//   return [
//     {
//       label: '自定义',
//       value: 'null'
//     },
//     ...opts
//   ]
// })
// function handleSelect(value: Array<any> | string | number | null, option: SelectBaseOption | null | SelectBaseOption[]) {
//   if (value === 'null') {
//     model.value.site = ''
//     model.value.code = ''
//     return
//   }
//   userStore.submissionConfig.some(config => {
//     if (config.id === value) {
//       model.value.site = config.site
//       model.value.code = config.code
//     }
//   })
// }

/** 提交 */
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      pack
        .download({
          title: model.value.title,
          content: props.content,
          audio: props.audio || '',
          duration: props.duration || 0,
          wordage: props.wordage || 0,
          promoterSequence: props.promoterSequence || [],
          keyframeSequence: props.keyframeSequence || [],
          subtitleSequence: props.subtitleSequence || [],
          subtitleKeyframeSequence: props.subtitleKeyframeSequence || [],
          type: props.type,
          site: model.value.site,
          code: model.value.code,
          penname: model.value.penname,
          email: model.value.email,
          blog: model.value.blog,
          msg: model.value.msg,
          editionId: '',
          abbrev: props.abbrev || ''
        })
        .then(() => {
          props.onResponse({ type: 'success', msg: '导出成功' })
        })
        .catch(err => {
          props.onResponse({ type: 'error', msg: '导出失败' })
        })
    } else {
      console.log(errors)
    }
  })
  props.onSubmit()
}
</script>

<template>
  <div class="download-form">
    <n-space vertical>
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <n-form-item path="penname" label="笔名">
          <n-input class="form-input" v-model:value="model.penname" type="text" placeholder="作品笔名" maxlength="18" show-count />
        </n-form-item>
        <n-form-item path="title" label="标题">
          <n-input class="form-input" v-model:value="model.title" type="text" placeholder="作品标题不能为空" maxlength="32" show-count />
        </n-form-item>
        <n-form-item path="email" label="邮箱">
          <n-input class="form-input" v-model:value="model.email" type="text" placeholder="作者邮箱" maxlength="32" show-count />
        </n-form-item>
        <n-form-item path="blog" label="作者博客">
          <n-input class="form-input" v-model:value="model.blog" type="text" placeholder="作者博客" maxlength="64" show-count />
        </n-form-item>
        <n-form-item path="msg" label="备注信息">
          <n-input type="textarea" v-model:value="model.msg" placeholder="请输入作品描述" maxlength="64" show-count />
        </n-form-item>
      </n-form>
      <n-button class="confirm" @click="handleSubmit">确认导出</n-button>
    </n-space>
  </div>
</template>

<style lang="scss" scoped>
.download-form {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 30px 0 0;
  z-index: 1;
  .tip {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 26px;
    margin: 25px auto 30px auto;
  }
  .confirm {
    width: 100%;
    height: 40px;
    border: none;
    font-weight: bold;
    letter-spacing: 8px;
    border-radius: 10px;
    cursor: pointer;
  }
}
</style>
