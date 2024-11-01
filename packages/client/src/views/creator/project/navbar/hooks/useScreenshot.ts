import html2canvas from 'html2canvas'
import { Bridge } from '../../bridge'
import { Layout } from '@textbus/editor'
import { useDialog, useMessage } from 'naive-ui'
import { h } from 'vue'
import { Icon } from '@iconify/vue'

export const useScreenshot = (bridge: Bridge) => {
  const dialog = useDialog()
  const message = useMessage()
  const handleScreenshot = async () => {
    const coverEL = bridge.coverEl
    const titleEl = bridge.titleEl!
    const layout = bridge.editor!.get(Layout)
    const screenEl = layout.middle
    const msg = message.loading('截图中...', { duration: 0 })
    try {
      let coverCanvas: HTMLCanvasElement | undefined
      if(coverEL.value) {
        coverEL.value.style.width = titleEl.offsetWidth + 'px'
        coverCanvas = await html2canvas(coverEL.value, { useCORS: true })
        coverEL.value.style.width = '100%'
      }
  
      const titleCanvas = await html2canvas(titleEl)
      const editorCanvas = await html2canvas(screenEl, { useCORS: true })
      setTimeout(() => {
        msg.destroy()
      }, 300)

      const totalHeight = titleCanvas.height + editorCanvas.height + (coverCanvas?.height || 0)
      const totalWidth = Math.max(titleCanvas.width, editorCanvas.width)
      const combinedCanvas = document.createElement('canvas')
      combinedCanvas.width = totalWidth
      combinedCanvas.height = totalHeight
      const ctx = combinedCanvas.getContext('2d')
      if (!ctx) return
      coverCanvas && ctx.drawImage(coverCanvas, 0, 0)

      // 将第一个截图绘制到新 canvas 上
      ctx.drawImage(titleCanvas, 0, coverCanvas?.height || 0)

      // 将第二个截图绘制到新 canvas 上，位于第一个截图的下方
      ctx.drawImage(editorCanvas, 0, titleCanvas.height + (coverCanvas?.height || 0))
      
      const dataUrl = combinedCanvas.toDataURL('image/png')

      dialog.create({
        title: '截图结果',
        icon: () => h(Icon, { icon: 'icon-park-outline:screenshot-one' }),
        content: () => h('img', { src: dataUrl, style: 'width: 100%; object-fit: contain;' }),
        positiveText: '下载',
        negativeText: '关闭',
        onPositiveClick: () => {
          // 创建一个下载链接
          const link = document.createElement('a')
          link.href = dataUrl
          link.download = `screenshot-${Date.now()}.png`

          // 模拟点击链接来触发下载
          document.body.appendChild(link)
          link.click()

          // 清理，移除创建的链接
          document.body.removeChild(link)
        }
      })
    } catch (error) {
      msg.destroy()
      message.error('截图失败')
    }
  }

  return handleScreenshot
}