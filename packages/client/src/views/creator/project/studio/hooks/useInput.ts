import { computed, h, onMounted, ref } from 'vue'
import { splitText } from '../_utils/splitText'
import { useI18n } from 'vue-i18n'
import { NIcon, NMessageProvider, useDialog, useMessage } from 'naive-ui'
import useStore from '@/store'
import { CreateBlankFragment, SpeakerSelectList } from '../private'
import { AddReactionSharp } from '@vicons/material'
import { formatTime } from '../_utils/formatTime'

type Speaker = ReturnType<typeof useStore>['speakerStore']['data'][0]
export function useInput(id: string, account: string, hostname: string) {
  const { projectStore, speakerStore } = useStore()
  const message = useMessage()
  const dialog = useDialog()
  const { t } = useI18n()

  const recorderMode = ref<'ASR' | 'TTS'>('ASR')
  const ttsSpeed = ref(1)
  const isAudioInputting = ref(false)
  const inputtingDuration = ref('00:00:00')

  const speakerId = computed(() =>
    recorderMode.value === 'TTS' ? projectStore.get(id)?.speakerHistory.machine : projectStore.get(id)?.speakerHistory.human
  )
  const speaker = computed(() => {
    return speakerStore.get(speakerId.value || '', account, hostname, recorderMode.value === 'TTS' ? 'machine' : 'human')
  })

  function handleTextOutput(text: string) {
    if (text.length === 0) return
    // TODO 对过长的文本进行分片
    if (text.length > 32) {
      const chunks = splitText(text)
      if (typeof chunks === 'string') {
        // console.log(chunks)
        // 防御：避免字符串文本，因为会被 for let...of 解析为单字符数组
        message.error(t('studio.msg.input_error'))
        return
      }
      const promiseArr: Promise<any>[] = []
      for (let chunk of chunks) {
        promiseArr.push(
          projectStore.fragment(id).createByText({
            txt: chunk,
            speakerId: speakerId.value || '',
            speed: ttsSpeed.value
          })
        )
      }
      // TODO 这里涉及并发问题，无法确定并发数量，如果中间有失败，则需要对失败片段重新上传，再次失败则放弃并提示用户
      // 理论上我们可以限制最大 6 个并发，这样用户一次输入的文本长度不应该超过 32 * 6 个字符（中文），当超过时提示用户手动分片
      Promise.all(promiseArr).catch(e => {
        message.error(t('studio.msg.create_fragment_error'))
      })
      return
    }
    projectStore
      .fragment(id)
      .createByText({
        txt: text,
        speakerId: speakerId.value || '',
        speed: ttsSpeed.value
      })
      .catch(e => {
        message.error(t('studio.msg.create_fragment_error'))
      })
  }
  function handleAudioOutput(data: { audio: Blob | undefined; duration: number }) {
    if (!data.audio) return
    projectStore
      .fragment(id)
      .createByAudio({
        audio: data.audio,
        duration: data.duration,
        speakerId: speakerId.value || ''
      })
      .catch(e => {
        message.error(t('studio.msg.create_fragment_error'))
      })
  }
  /** 添加空白音频过渡 */
  function handleAddBlank() {
    dialog.create({
      title: '创建空白音频',
      content: () =>
        h(NMessageProvider, null, () =>
          h(CreateBlankFragment, {
            onConfirm: result => {
              projectStore
                .fragment(id)
                .createBlank(result)
                .catch(e => {
                  message.error(t('studio.msg.create_fragment_error'))
                })
              dialog.destroyAll()
            },
            onCancel: () => {
              dialog.destroyAll()
            }
          })
        )
    })
  }

  function setTimer(callback: (duration: string) => void, remaining: number) {
    let sec = 0
    const intervalId = setInterval(() => {
      sec += 0.01
      const formattedTime = formatTime(sec)
      callback(formattedTime)
      if (sec > remaining) {
        clearInterval(intervalId)
      }
    }, 10)
    return () => clearInterval(intervalId)
  }
  
  let timer: (() => void) | null = null
  function handleInputting(is: boolean) {
    isAudioInputting.value = is
    if(is) timer = setTimer(t => inputtingDuration.value = t, 60)
    else {
      timer?.()
      inputtingDuration.value = '00:00:00'
    }
  }

  function handleModeSwitch() {
    recorderMode.value = recorderMode.value === 'ASR' ? 'TTS' : 'ASR'
  }

  const speedOptions = [
    { label: '2.0x', value: 2.0 },
    { label: '1.5x', value: 1.5 },
    { label: '1.25x', value: 1.25 },
    { label: '1.0x', value: 1.0 },
    { label: '0.75x', value: 0.75 },
    { label: '0.5x', value: 0.5 }
  ]

  /** 切换语音合成角色 */
  function handleSpeakerChange(type: 'human' | 'machine') {
    dialog.destroyAll()
    dialog.create({
      icon: () => h(NIcon, { component: AddReactionSharp, size: 24, style: { marginRight: '8px' } }),
      title: t('studio.changeRoles'),
      content: () =>
        h(SpeakerSelectList, {
          account: account,
          hostname: hostname,
          speakerHistory: projectStore.get(id)?.speakerHistory || { human: '', machine: '' },
          data: speakerStore.data,
          type: type,
          onSelect: (speakerId: string, type: 'human' | 'machine') => {
            projectStore.updateSpeakerHistory({ id: id, type, speakerId }, account, hostname).catch(e => {
              message.error('Speaker history update error！')
            })
            dialog.destroyAll()
          },
          onAdd: result => {
            speakerStore.create(
              {
                role: result.role,
                name: result.name,
                avatar: result.avatar,
                changer: result.changer
              },
              account,
              hostname
            )
          },
          onRemove: (id: string) => {
            speakerStore.delete(id, account, hostname)
          }
        })
    })
  }

  onMounted(() => {
    // 获取说话人列表
    speakerStore.fetchAndSet(account, hostname)
  })

  return {
    recorderMode,
    ttsSpeed,
    speakerId,
    speaker,
    speedOptions,
    isAudioInputting,
    inputtingDuration,
    handleTextOutput,
    handleAudioOutput,
    handleAddBlank,
    handleInputting,
    handleModeSwitch,
    handleSpeakerChange
  }
}
