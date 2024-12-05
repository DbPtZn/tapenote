<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import { FormInst, FormItemRule, FormRules, UploadCustomRequestOptions, UploadFileInfo, useMessage } from 'naive-ui'
import useStore from '@/store'
import { getServerToken } from '@/api'
import TencentTimbreList from './_utils/TencentTimbreList.vue'
import { Tip } from '../../../_common'
import { onMounted } from 'vue'
import { hostname } from 'os'
import { useUploadImg } from '../../../_hooks'

type CreateSpeakerDto = Parameters<ReturnType<typeof useStore>['speakerStore']['create']>[0]
interface ModelType {
  type:  'human' | 'machine'
  model: string
  avatar: string
  name: string
  role: number
  speed: number
  changer: number
}
// type Response = ModelType & Record<string, unknown>
// const message = useMessage()
const { speakerStore } = useStore()
const props = defineProps<{
  account: string
  hostname: string
  type:  'human' | 'machine'
}>()
const emits = defineEmits<{
  submit: [response: CreateSpeakerDto]
}>()
const ResourceDomain = localStorage.getItem(`ResourceDomain:${props.hostname}`) as string
// console.log('ResourceDomain:', ResourceDomain)
const formRef = ref<FormInst | null>(null)
/** 表单数据 */
const model = ref<ModelType>({
  type: props.type,
  model: '',
  avatar: '',
  name: '',
  speed: 1,
  role: 0,
  changer: 0
})
const showTimbreList = ref(true)
onMounted(() => {
  model.value.model = props.type === 'human' ? speakerStore.asrOptions[0].value : speakerStore.ttsOptions[0].value 
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
      message: '合成语音的音色编号不能小于 0',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: number) => {
        if (props.type === 'machine') {
          if (value < 0) {
            return false
          }
        }
      }
    },
  ],
  speed: [
  {
      message: '语速取值范围是 0 ~ 3',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: number) => {
        if (props.type === 'machine') {
          if (value < 0 || value > 3) {
            return false
          }
        }
      }
    },
  ]
}
const accessToken = computed(() => getServerToken(props.account, props.hostname)) 
/** 提交 */
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      console.log('model:', model.value)
      showTimbreList.value = false
      emits('submit', model.value)
    } else {
      console.log(errors)
    }
  })
}
// function handleFinish(args: { file: UploadFileInfo; event?: ProgressEvent }) {
//   if (args.event) {
//     // console.log(args.event.currentTarget)
//     const path = ResourceDomain + (args.event.currentTarget as XMLHttpRequest).response
//     // console.log(path)
//     model.value.avatar = path
//   }
// }
function handleError(ev: Event) {
  const target = ev.target as HTMLImageElement
  target.src = './image-add.png'
}

const audioCache = new Map<string, HTMLAudioElement>()
const isLoading = ref(false)
function handleTest(role: number, ttsModel: string, speed: number) {
  // 如果存在缓存，直接播放缓存信息
  if (audioCache.has(`${ttsModel}&${role}&${speed}`)) {
    audioCache.get(`${ttsModel}&${role}&${speed}`)?.play()
    return
  }
  isLoading.value = true
  speakerStore.testTts(role, ttsModel, speed, props.account, props.hostname).then(res => {
    // const url = ResourceDomain + res.data as string
    const url = props.hostname + res.data as string // 临时音频文件从服务器端读取
    // console.log('url:', url)
    const audio = new Audio(url)
    isLoading.value = false
    audio.oncanplay =() => {
      audio.play()
      // 如果没有缓存，则缓存，并通知服务端移除临时音频文件
      if (!audioCache.has(`${ttsModel}&${role}&${speed}`)) {
        audioCache.set(`${ttsModel}&${role}&${speed}`, audio)
        speakerStore.clearTemp(url, props.account, props.hostname)
      }
    }
  })
}

// function handleSelect(value: string) {
//   console.log('value:', value)
//   // model.value.model = value
// }

const { uploadImgFile } = useUploadImg(props.account, props.hostname)
async function useImgRequest(options: UploadCustomRequestOptions) {
  try {
    if(!options?.file?.file) return
    const url = await uploadImgFile(options.file.file)
    model.value.avatar = url
  } catch (error) {
    console.log(error)
  }
}

const roleMsg = computed(() => speakerStore.ttsOptions.find(option => option.value === model.value.model)?.msg || '')

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
            :custom-request="useImgRequest"
            :show-file-list="false"
          >
            <img class="avatar" :src="model.avatar" style="width: 100%" @error="handleError" />
          </n-upload>
        </n-form-item>
        <n-form-item path="name" label="名称">
          <n-input class="form-input" v-model:value="model.name" type="text" placeholder="请输入名称" maxlength="12" show-count />
        </n-form-item>
        <div class="tip-wrapper">
          <div class="tip-content">
            <Tip>
              <p><b>基础服务：</b> 本地运行的语音处理服务，速度慢且质量会比较差，同时间任务多的话阻塞等待时间较长。<span style="color: aqua;">(免费)</span></p>
              <p><b>会员服务：</b> 云厂商提供的远端语音处理服务, 速度快且质量高、稳定。<span style="color: #ff6161">(会员)</span></p>
            </Tip>
          </div>
        </div>
        <n-form-item path="model" label="来源">
          <n-select v-model:value="model.model" :options="type === 'human' ? speakerStore.asrOptions : speakerStore.ttsOptions" />
        </n-form-item>
        <div v-if="type === 'machine' && roleMsg" class="tip-wrapper">
          <div class="tip-content">
            <Tip>
              <p>{{  roleMsg  }}</p>
            </Tip>
          </div>
        </div>
        <n-form-item v-if="type === 'machine'" path="role" label="音色值">
          <n-input-number v-model:value="model.role" placeholder="请输入角色值" :precision="0" :show-button="false" />
          <n-button class="test" @click="handleTest(model.role, model.model, model.speed)">测试</n-button>
          <n-spin v-show="isLoading" size="small" />
        </n-form-item>
        <n-form-item v-if="type === 'machine'" path="speed" label="默认语速">
          <n-input-number v-model:value="model.speed" placeholder="请输入默认语速" :show-button="false" :precision="1" />
        </n-form-item>
        <n-form-item v-if="type === 'human'" path="changer" label="变声器编号 (暂不支持)">
          <n-input-number v-model:value="model.changer" placeholder="请输入变身器编号" :show-button="false" disabled />
        </n-form-item>
      </n-form>
      <n-button class="confirm" @click="handleSubmit">添加</n-button>
    </n-space>
    <div v-if="showTimbreList" v-show="model.model === 'tencent-base-tts'" class="timbre-list">
      <TencentTimbreList />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.timbre-list {
  position: absolute;
  width: 600px;
  top: -120px;
  left: 446px;
  scale: 0.8;
}
.tip-wrapper {
  position: relative;
  // width: 100%;
  // height: 5px;
  // background-color: aliceblue;
  .tip-content {
    position: absolute;
    height: 24px;
    width: 24px;
    top: 0px;
    right: 0px;
  }
}

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
  // .tip {
  //   width: 100%;
  //   display: flex;
  //   align-items: center;
  //   font-size: 26px;
  //   margin: 25px auto 30px auto;
  // }
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
