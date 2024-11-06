import { NIcon, useDialog, useMessage, useThemeVars } from 'naive-ui'
import { h } from 'vue'
import SubmissionForm from '../submission/SubmissionForm.vue'
import useStore from '@/store'
import { Icon } from '@iconify/vue'
// import { ShareFilled } from '@vicons/material'
export function useSubmissionDialog() {
  const dialog = useDialog()
  const message = useMessage()
  const themeVars = useThemeVars()
  const { projectStore, userStore } = useStore()
  const handleExpandShareDialog = (id: string) => {
    const data = projectStore.get(id)
    const type = data?.lib === 'course' ? 'course' : 'note'
    if (!data) return
    if (!id) return
    console.log(data)
    dialog.create({
      icon: () => h(Icon, { icon: 'material-symbols:share', height: 24 }),
      title: '投稿',
      content: () => h(SubmissionForm, {
        id: id,
        type: type,

        penname: userStore.nickname,
        email: userStore.email,

        title: data.title,
        content: data.content,
        abbrev: data.abbrev,
        audio: data.audio,
        duration: data.duration,
        wordage: data.detial.wordage,
        promoterSequence: data.promoterSequence,
        keyframeSequence: data.keyframeSequence,
        subtitleSequence: data.subtitleSequence,
        subtitleKeyframeSequence: data.subtitleKeyframeSequence,
        
        onResponse: ({ error, msg })=> {
          // console.log(msg)
          error ? message.error(msg) : message.success(msg)
          // dialog.destroyAll()
        },
        onSuccess(data) {
          // console.log(data)
          // TODO 桌面端 a 标签打开地址要实现自动通过默认浏览器打开而不是在 electron 应用中打开
          dialog.success({
            title: '作品地址',
            content: () => h('a', { href: data.address, target: '_blank', style: { color: themeVars.value.textColor1 } }, { default: () => `${data.address}` }),
            onPositiveClick(e) {
              dialog.destroyAll()
            },
          })
          projectStore.addSubmissionHistory({id, ...data}, userStore.account, userStore.hostname)
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