import { NIcon, useDialog, useMessage } from 'naive-ui'
import { h } from 'vue'
import DownloadForm from '../submission/DownloadForm.vue'
import useStore from '@/store'
// import { DownloadFilled } from '@vicons/material'
import { Icon } from '@iconify/vue'

export function useDownloadDialog() {
  const dialog = useDialog()
  const message = useMessage()
  const { projectStore, userStore } = useStore()
  const handleDownloadDialog = (id: string) => {
    const data = projectStore.get(id)
    const type = data?.lib === 'course' ? 'course' : 'note'
    if (!data) return
    if (!id) return
    dialog.create({
      icon: () => h(Icon, { icon: 'material-symbols:download-2', height: 24 }),
      title: `导出${type === 'course' ? '动画项目' : '笔记项目'}`,
      content: () => h(DownloadForm, {
        type: type,

        penname: userStore.nickname,
        email: userStore.email,
        blog: userStore. homepage,

        title: data.title,
        content: data.content,
        audio: data.audio,
        duration: data.duration,
        promoterSequence: data.promoterSequence,
        keyframeSequence: data.keyframeSequence,
        subtitleSequence: data.subtitleSequence,
        subtitleKeyframeSequence: data.subtitleKeyframeSequence,
        
        
        onResponse: ({ type, msg })=> {
          if(type === 'success') {
            message.success(msg)
            return
          }
          if (type === 'error') {
            message.error(msg)
          }
        },

        onSubmit() {
          dialog.destroyAll()
        }
      })
    })
  }
  return { handleDownloadDialog }
}
