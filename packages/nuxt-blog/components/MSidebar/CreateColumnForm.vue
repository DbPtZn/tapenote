<script lang="ts" setup>
import { ref } from 'vue'
import { useThemeVars, type FormInst, type FormItemRule, type FormRules, type UploadFileInfo } from 'naive-ui'
interface ModelType {
  name: string
  cover: string
  desc: string
}
// type Response = ModelType & Record<string, unknown>
// const props = defineProps<{
//   // name?: string
//   submit: (res: Response) => void
// }>()
const emits = defineEmits<{
  submit: [ModelType]
}>()
const themeVars = useThemeVars()
const formRef = ref<FormInst | null>(null)
/** 表单数据 */
const model = ref<ModelType>({
  name: '',
  cover: '',
  desc: ''
})
/** 表单规则 */
const rules: FormRules = {
  name: [
    {
      required: true,
      message: '专栏名称不能为空',
      trigger: 'blur'
    },
    {
      message: '专栏名称长度不能超过18个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 18
      }
    }
  ],
  desc: [
    {
      required: false,
      message: '请输入描述',
      trigger: 'blur'
    },
    {
      message: '描述长度不能超过60个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 60
      }
    }
  ]
}
/** 提交 */
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      emits('submit', model.value)
    } else {
      console.log(errors)
    }
  })
}
function handleFinish(args: { file: UploadFileInfo; event?: ProgressEvent }) {
  if (args.event) {
    // console.log(args.event.currentTarget)
    const path = (args.event.currentTarget as XMLHttpRequest).response
    // console.log(path)
    model.value.cover = path
  }
}
function handleError(ev: Event) {
  const target = ev.target as HTMLImageElement
  target.src = '/empty.png'
}
</script>

<template>
  <div class="folder-form">
    <n-space vertical>
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <n-form-item path="name" label="专栏名称">
          <n-input class="form-input" v-model:value="model.name" type="text" placeholder="请输入专栏名称" maxlength="18" show-count />
        </n-form-item>
        <n-form-item path="cover" label="封面">
          <n-upload :action="`/api/upload/img`" :show-file-list="false" @finish="handleFinish">
            <div class="upload">
              <img v-if="model.cover" class="cover" :src="model.cover" style="max-width: 100%" @error="handleError" />
              <Icon v-if="!model.cover" name="material-symbols:add-rounded" size="48px" />
            </div>
          </n-upload>
        </n-form-item>
        <n-form-item path="desc" label="描述">
          <n-input type="textarea" v-model:value="model.desc" placeholder="请输入描述" maxlength="60" show-count />
        </n-form-item>
      </n-form>
      <n-button class="confirm" @click="handleSubmit">创建</n-button>
    </n-space>
  </div>
</template>

<style lang="scss" scoped>
.folder-form {
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
.upload {
  border-radius: 3px;
  border: 1px solid v-bind('themeVars.borderColor');
  height: 80px;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .cover {
    height: 80px;
    width: 80px;
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
