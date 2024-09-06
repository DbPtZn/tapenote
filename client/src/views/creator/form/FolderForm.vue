<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { LibraryEnum } from '@/enums'
interface ModelType {
  name: string
  desc: string
  lib: LibraryEnum
  // isCloud: boolean
}
type Response = ModelType & Record<string, unknown>
const props = defineProps<{
  name?: string
  desc?: string
  lib?: LibraryEnum
  belong?: string
  // isCloud?: boolean
  submit: (res: Response) => void
}>()
const formRef = ref<FormInst | null>(null)
/** 表单数据 */
const model = ref<ModelType>({
  name: '',
  desc: '',
  lib: props.lib || LibraryEnum.NOTE,
  // isCloud: true
})
const regex = /[<>:"/\\|?*]/g
/** 表单规则 */
const rules: FormRules = {
  name: [
    {
      required: true,
      message: '文件夹名称不能为空',
      trigger: 'blur'
    },
    {
      message: '文件夹名称长度不能超过18个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length <= 18
      }
    },
    {
      message: '文件夹名称不能包含以下任何字符 <>:"/\\|?*',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return !regex.test(value)
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
  ],
  lib: [
    {
      required: true,
      message: '请选择库',
      trigger: 'blur'
    }
  ]
}
const libOptions = [
  {
    label: '笔记库',
    value: LibraryEnum.NOTE
  },
  {
    label: '课程库',
    value: LibraryEnum.COURSE
  },
  {
    label: '工程库',
    value: LibraryEnum.PROCEDURE
  }
]
/** 提交 */
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      props.submit(model.value)
    } else {
      console.log(errors)
    }
  })
}
</script>

<template>
  <div class="folder-form">
    <n-space vertical>
      <!-- <div class="tip">新建文件夹</div> -->
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <n-form-item v-if="belong" path="belong" label="归属文件夹">
          <n-input class="form-input" :value="belong" type="text" placeholder="归属文件夹名称" disabled />
        </n-form-item>
        <n-form-item path="name" label="文件夹名称">
          <n-input class="form-input" v-model:value="model.name" type="text" placeholder="请输入文件夹名称" maxlength="18" show-count />
        </n-form-item>
        <n-form-item path="desc" label="描述">
          <n-input type="textarea" v-model:value="model.desc" placeholder="请输入文件夹描述" maxlength="60" show-count />
        </n-form-item>
        <n-form-item path="lib" label="库">
          <n-select v-model:value="model.lib" placeholder="Select" :options="libOptions" :disabled="!!props.lib" />
        </n-form-item>
        <!-- <n-form-item path="isCloud" label="云同步">
          <n-switch v-model:value="model.isCloud" disabled />
        </n-form-item> -->
      </n-form>
      <n-button class="confirm" @click="handleSubmit">创建</n-button>
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
