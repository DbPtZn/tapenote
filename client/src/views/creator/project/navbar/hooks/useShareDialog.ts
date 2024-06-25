import { NIcon, useDialog, useMessage } from 'naive-ui'
import { h } from 'vue'
import SubmissionForm from '../submission/SubmissionForm.vue'
import useStore from '@/store'
import { ShareFilled } from '@vicons/material'

export function useShareDialog() {
  const dialog = useDialog()
  const message = useMessage()
  const { projectStore, userStore } = useStore()
  const handleExpandShareDialog = (id: string) => {
    const data = projectStore.get(id)
    const type = data?.lib === 'course' ? 'course' : 'note'
    if (!data) return
    if (!id) return
    dialog.create({
      icon: () => h(NIcon, { component: ShareFilled, size: 24 }),
      title: '投稿',
      content: () => h(SubmissionForm, {
        type: type,

        penname: userStore.nickname,
        email: userStore.email,

        title: data.title,
        content: data.content,
        audio: data.audio,
        duration: data.duration,
        promoterSequence: data.promoterSequence,
        keyframeSequence: data.keyframeSequence,
        subtitleSequence: data.subtitleSequence,
        subtitleKeyframeSequence: data.subtitleKeyframeSequence,
        
        
        onResponse: ({ error, msg })=> {
          error ? message.error(msg) : message.success(msg)
        },

        onSubmit() {
          // dialog.destroyAll()
        }
      })
    })
  }
  return { handleExpandShareDialog }
}

/**
  submit: (res) => {
    // const ssoToken = sessionStorage.getItem('sso-token')
    // if (!ssoToken) return message.error('提交失败，权限不足！')
    noteStore.submit({
      id,
      penname: res.penname,
      title: res.title,
      msg: res.msg,
      site: res.site,
      code: res.code,
      email: res.email,
      blog: res.blog
    }).then(res => {
      console.log(res)
      message.success('投稿成功！')
    })
    dialog.destroyAll()
  } 
*/