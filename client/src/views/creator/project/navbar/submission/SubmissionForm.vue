<script lang="ts" setup>
import { VNode, computed, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CascaderOption, FormInst, FormItemRule, FormRules, NText, SelectRenderLabel, useMessage } from 'naive-ui'
import { LibraryEnum } from '@/enums'
import { SelectBaseOption, SelectGroupOption, SelectOption } from 'naive-ui/es/select/src/interface'
import useStore from '@/store'
import { pack } from './pack'
import dayjs from 'dayjs'
import HistoryCard from './HistoryCard.vue'
type SubmissionHistory = Omit<ReturnType<typeof useStore>['projectStore']['data'][0]['submissionHistory'][0], 'key'>
interface ModelType {
  site: string
  code: string
  penname: string
  editionId: string
  title: string // 标题
  email: string // 邮箱
  blog: string // 博客地址
  msg: string // 提交时的备注信息
  // isShared: boolean // 是否已经加入分享（不考虑实现）
  // dir: [] // 合辑目录（暂不实现）
}
type Response = ModelType & Record<string, unknown>
const { userStore, projectStore } = useStore()
const props = defineProps<{
  id: string // projectId
  type: 'note' | 'course'
  site?: string
  code?: string
  penname?: string
  editionId?: string
  title: string
  content: string // 内容
  abbrev: string
  audio?: string
  duration?: number
  promoterSequence?: string[]
  keyframeSequence?: number[]
  subtitleSequence?: string[]
  subtitleKeyframeSequence?: number[]
  email?: string
  blog?: string
}>()
const emits = defineEmits<{
  response: [result: { error: boolean; msg: string }]
  success: [SubmissionHistory]
}>()
const formRef = ref<FormInst | null>(null)
/** 表单数据 */
const model = ref<ModelType>({
  site: props.site || '',
  code: props.code || '',
  penname: props.penname || '佚名',
  editionId: props.editionId || '',
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
  editionId: [],
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

/** 预设配置 */
const value = ref('null')
const options = computed(() => {
  const opts = userStore.submissionConfig.map(config => {
    return {
      label: config.name,
      value: config.id
    }
  })
  return [
    {
      label: '自定义',
      value: 'null'
    },
    ...opts
  ]
})
function handleSelect(value: Array<any> | string | number | null, option: SelectBaseOption | null | SelectBaseOption[]) {
  if (value === 'null') {
    model.value.site = ''
    model.value.code = ''
    model.value.editionId = ''
    return
  }
  userStore.submissionConfig.some(config => {
    if (config.id === value) {
      model.value.site = config.site
      model.value.code = config.code
      model.value.editionId = ''
      return true
    }
  })
}

/** 历史记录 */
const isHistoryOptionsShow = ref(false)
const historyValue = ref('key123456a')
function handleHistoryOptionsShow(value: boolean) {
  isHistoryOptionsShow.value = !isHistoryOptionsShow.value
}
const historyOptions = computed(() => {
  // return projectStore.get(props.id)?.submissionHistory.map(item => {
  //   return {
  //     label: item.title,
  //     value: item.key
  //   }
  // })
  // 标题 推送目的 版号 推送时间
  return [
    {
      title: '标题dasdasdsadwqdwqdqweqwdasdasdsadwqdwqdqweqwdasdasdsadwqdwqdqweqw标题标题',
      editionId: 'dasdasdsadwqdwqdqweqw',
      site: 'https://www.bilibili.com/video/BV1Ka411N7VN/BV1Ka411N7VN/BV1Ka411N7VN/BV1Ka411N7VN',
      label: `投稿时间：${'2024-6-27 8:08'}`,
      value: 'key123456a',
      code: 'key123456qwqw',
      date: '2024-6-27 8:08'
    },
    {
      title: '标题dasdasdsadwqdwqdqweqwdasdasdsadwqdwqdqweqwdasdasdsadwqdwqdqweqw标题标题',
      editionId: 'dasdasdsadwqdwqdqweqw',
      site: 'https://www.bilibili.com/video/BV1Ka411N7VN/BV1Ka411N7VN/BV1Ka411N7VN/BV1Ka411N7VN',
      label: '2024-6-27 8:08',
      value: 'key123456fd',
      code: 'key123456qwqw',
      date: '2024-6-27 8:08'
    }
  ]
})
const renderOption = (props: { node: VNode; option: SelectOption | SelectGroupOption; selected: boolean }) => {
  const { option } = props
  return h(HistoryCard, {
    title: option.title as string,
    site: option.site as string,
    code: option.code as string,
    editionId: option.editionId as string,
    date: option.date as string,
    onSelected: () => {
      model.value.site = option.site as string
      model.value.code = option.code as string
      model.value.editionId = option.editionId as string
      isHistoryOptionsShow.value = false
    },
    onClose: () => {
      //
    }
  })
}

/** 提交 */
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      pack
        .submit({
          editionId: model.value.editionId,
          title: model.value.title,
          content: props.content,
          abbrev: props.abbrev || '',
          audio: props.audio || '',
          duration: props.duration || 0,
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
          msg: model.value.msg
        })
        .then(editionId => {
          emits('response', {
            error: false,
            msg: '投稿成功'
          })
          console.log(editionId)
          emits('success', {
            receiver: model.value.site || '',
            editionId: editionId,
            code: model.value.code || '',
            title: model.value.title || '',
            penname: model.value.penname || '',
            email: model.value.email || '',
            blog: model.value.blog || '',
            msg: model.value.msg || '',
            date: dayjs().format('YYYY-MM-DD HH:mm:ss')
          })
        })
        .catch(err => {
          console.log(err)
          emits('response', {
            error: true,
            msg: err?.response?.data || err?.message || '投稿失败'
          })
          // message.error('投稿失败')
        })
    } else {
      console.log(errors)
    }
  })
}
</script>

<template>
  <div class="folder-form">
    <n-space vertical>
      <n-tabs default-value="preset" size="large" :style="{ marginBottom: '12px' }" justify-content="start">
        <n-tab-pane name="preset" tab="预设配置">
          <n-select v-model:value="value" :options="options" @update:value="handleSelect" />
        </n-tab-pane>
        <n-tab-pane name="history" tab="历史记录">
          <n-select
            placeholder="投稿历史记录"
            v-model:value="historyValue"
            :show="isHistoryOptionsShow"
            @update:show="handleHistoryOptionsShow"
            :options="historyOptions" 
            :render-option="renderOption" 
            :to="false"
          />
        </n-tab-pane>
      </n-tabs>
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <!-- <n-form-item label="预设配置">
          <n-select v-model:value="value" :options="options" @update:value="handleSelect" />
        </n-form-item> -->
        <n-form-item path="site" label="推送目的">
          <n-input class="form-input" v-model:value="model.site" type="text" placeholder="目标博客地址" />
        </n-form-item>
        <n-form-item path="code" label="授权码">
          <n-input class="form-input" v-model:value="model.code" type="text" placeholder="授权码" maxlength="18" show-count />
        </n-form-item>
        <n-form-item path="penname" label="笔名">
          <n-input class="form-input" v-model:value="model.penname" type="text" placeholder="作品笔名" maxlength="18" show-count />
        </n-form-item>
        <n-form-item path="editionId" label="版号">
          <n-input class="form-input" v-model:value="model.editionId" type="text" placeholder="版号（可不填）" maxlength="64" show-count />
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
      <n-button class="confirm" @click="handleSubmit">确认投稿</n-button>
    </n-space>
  </div>
</template>

<style lang="scss" scoped>
.folder-form {
  position: relative;
  // width: 350px;
  // height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
  // border-radius: 15px;
  margin: 30px 0 0;
  z-index: 1;
  .tip {
    width: 100%;
    display: flex;
    align-items: center;
    // justify-content: center;
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
.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  a {
    cursor: pointer;
    color: plum;
  }
}
</style>
