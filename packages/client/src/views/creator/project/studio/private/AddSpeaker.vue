<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import { FormInst, FormItemRule, FormRules, UploadFileInfo, useMessage } from 'naive-ui'
import useStore from '@/store'
import { getServerToken } from '@/api';
interface ModelType {
  type:  'human' | 'machine'
  avatar: string
  name: string
  role: number
  changer?: number
}
type Response = ModelType & Record<string, unknown>
// const message = useMessage()
const { speakerStore } = useStore()
const props = defineProps<{
  account: string
  hostname: string
  type:  'human' | 'machine'
  submit: (res: Response) => void
}>()
const ResourceDomain = localStorage.getItem(`ResourceDomain:${props.hostname}`) as string
console.log('ResourceDomain:', ResourceDomain)
const formRef = ref<FormInst | null>(null)
/** 表单数据 */
const model = ref<ModelType>({
  type: props.type,
  avatar: '',
  name: '',
  role: 0,
  changer: 0
})
/** 表单规则 */
const rules: FormRules = {
  name: [
    {
      required: true,
      message: '名称不能为空',
      trigger: 'blur'
    },
    {
      message: '名称长度不能超过12个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 12
      }
    }
  ],
  role: [
    {
      required: true,
      message: '音色编号不能为空',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: number) => {
        if (value === undefined) {
          return false
        }
      }
    },
    {
      message: '扮演角色的角色值不能小于或等于 9999',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: number) => {
        if (props.type === 'human') {
          if (value <= 9999) {
            return false
          }
        }
      }
    },
    {
      message: '扮演角色的角色值不能超过 99999',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: number) => {
        if (props.type === 'human') {
          if (value > 99999) {
            return false
          }
        }
      }
    },
    {
      message: '合成语音的音色编号不能大于 9998 或等于 0',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: number) => {
        if (props.type === 'machine') {
          if (value >= 9998 || value === 0) {
            return false
          }
        }
      }
    },
    {
      message: '该角色值已存在！',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: number) => {
        if (speakerStore.data.some(speaker => speaker.role === value)) {
          return false
        }
      }
    }
  ]
}
const accessToken = computed(() => getServerToken(props.account, props.hostname)) 
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
function handleFinish(args: { file: UploadFileInfo; event?: ProgressEvent }) {
  if (args.event) {
    // console.log(args.event.currentTarget)
    const path = ResourceDomain + (args.event.currentTarget as XMLHttpRequest).response
    // console.log(path)
    model.value.avatar = path
  }
}
function handleError(ev: Event) {
  const target = ev.target as HTMLImageElement
  target.src = './image-add.png'
}

const audioCache = new Map<number, HTMLAudioElement>()
const isLoading = ref(false)
function handleTest(role: number) {
  // 如果存在缓存，直接播放缓存信息
  if (audioCache.has(role)) {
    audioCache.get(role)?.play()
    return
  }
  isLoading.value = true
  speakerStore.testTts(role, props.account, props.hostname).then(res => {
    // const url = ResourceDomain + res.data as string
    const url = props.hostname + res.data as string // 临时音频文件从服务器端读取
    console.log('url:', url)
    const audio = new Audio(url)
    isLoading.value = false
    audio.oncanplay =() => {
      audio.play()
      // 如果没有缓存，则缓存，并通知服务端移除临时音频文件
      if (!audioCache.has(role)) {
        audioCache.set(role, audio)
        speakerStore.clearTemp(url, props.account, props.hostname)
      }
    }
  })
}
onUnmounted(() => {
  audioCache.forEach((audio, role) => {
    if(audio) {
      audio.pause()
      audio.src = ''
    }
    // 清除引用
    audioCache.delete(role)
  })
})
</script>

<template>
  <div class="add-role-form">
    <n-space vertical>
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <n-form-item path="avatar" label="头像">
          <n-upload
            :action="`${hostname}/upload/img`"
            :show-file-list="false"
            :headers="{
              Authorization: `Bearer ${accessToken}`
            }"
            @finish="handleFinish"
          >
            <img class="avatar" :src="model.avatar" style="width: 100%" @error="handleError" />
          </n-upload>
        </n-form-item>
        <n-form-item path="name" label="名称">
          <n-input class="form-input" v-model:value="model.name" type="text" placeholder="请输入名称" maxlength="12" show-count />
        </n-form-item>
        <n-form-item path="role" label="角色值">
          <n-input-number v-model:value="model.role" placeholder="请输入角色值" :precision="0" :show-button="false" />
          <n-button class="test" @click="handleTest(model.role)">测试</n-button>
          <n-spin v-show="isLoading" size="small" />
        </n-form-item>
        <n-form-item v-if="type === 'human'" path="changer" label="变声器编号(暂不可用)">
          <n-input-number v-model:value="model.changer" placeholder="请输入变身器编号" :show-button="false" disabled />
        </n-form-item>
      </n-form>
      <n-button class="confirm" @click="handleSubmit">添加</n-button>
    </n-space>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  height: 80px;
  width: 80px;
  cursor: pointer;
}
.test {
  margin-left: 10px;
  margin-right: 10px;
}
.add-role-form {
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
