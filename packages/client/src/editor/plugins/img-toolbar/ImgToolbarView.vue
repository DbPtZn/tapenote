<script lang="ts" setup>
import { inject, onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue'
import { useDialog, useMessage, useThemeVars } from 'naive-ui'
import { Layout, textAlignFormatter } from '@textbus/editor'
import { ComponentInstance, Selection, Injector, Renderer, fromEvent, Commander } from '@textbus/core'
import _ from 'lodash'
import { Img2base64Service, ImgService, ImgToUrlService } from '../../services'
import { BorderStyle, FloatCenter, FloatLeft, FloatRight, UrlIcon } from './icons'

const injector = inject('injector') as Injector
const isogenyDomainNames = inject('isogenyDomainNames') as string[]
const imgService = injector.get(ImgService)
const themeVars = useThemeVars()
const dialog = useDialog()
const message = useMessage()
const toolbarEl = useTemplateRef<HTMLElement>('toolbarEl')
const renderer = injector.get(Renderer)
const commander = injector.get(Commander)
const selection = injector.get(Selection)
// const editor = injector.get(Editor)
const layout = injector.get(Layout)
const imgToUrlService = injector.get(ImgToUrlService)
const container = layout.container

const isExternalUrl = ref(false) // 是否外部图片地址

let currentElement: HTMLElement | null = null
let currentComponent: ComponentInstance | null = null
const position = reactive({
  left: 0,
  top: 0,
  show: false
})

const subscription = imgService.onImgActive.subscribe(component => {
  if (!component) {
    position.show = false
    return
  }
  if (!['ImageB2UComponent', 'ImageComponent'].includes(component.name)) {
    position.show = false
    return
  }
  // console.log(component)
  // const toolbarRect = toolbarEl.value!.getBoundingClientRect()
  const vNode = renderer.getVNodeByComponent(component)
  const nativeNode = renderer.getNativeNodeByVNode(vNode) as HTMLElement
  const containerRect = container.getBoundingClientRect()
  const rect = nativeNode.getBoundingClientRect()
  const top = rect.top - containerRect.top
  // console.log(toolbarRect)
  position.left = nativeNode.offsetLeft + rect.width
  position.top = top
  position.show = true

  currentComponent = component
  currentElement = nativeNode

  isExternalUrl.value = !isogenyDomainNames.some(name => component.state?.src?.startsWith(name))

  const sub = fromEvent(window, 'mousedown').subscribe((ev) => {
    const target = ev.target as HTMLElement
    if(!toolbarEl.value?.contains(target) && target !== currentElement) {
      position.show = false
      sub.unsubscribe()
    }
  })
  
})

// onMounted(() => {})
onUnmounted(() => {
  subscription.unsubscribe()
})

const borderOptions = ['solid', 'dashed', 'dotted', 'none']
function handleBorderUpdate() {
  if (!currentComponent) return
  currentComponent.updateState(draft => {
    let index = borderOptions.indexOf(draft.border)
    if (index === -1) index = 0
    if (index === borderOptions.length - 1) index = 0
    else index++
    draft.border = borderOptions[index]
  })
  selection.selectComponent(currentComponent)
}

function handleTextAlignUpdate(textAlign: 'left' | 'center' | 'right') {
  if (!currentComponent) return
  selection.selectComponent(currentComponent)
  commander.applyAttribute(textAlignFormatter, textAlign)
}

function handleUrlUpdate() {
  if (!currentComponent || !currentElement || !isExternalUrl.value) return
  const component = currentComponent
  const element = currentElement
  if (!(element instanceof HTMLImageElement)) return
  dialog.create({
    title: '修改图片地址',
    content: `是否将图片地址修改为同源地址`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        // const base64 = Img2base64Service.imgElementToBase64(element)
        const base64 = await Img2base64Service.imgUrlToBase64(element.src)
        const url = await imgToUrlService.uploadImg(base64)
        if (!url) return
        component.updateState(draft => {
          draft.src = url
        })
        selection.selectComponent(component)
      } catch (error) {
        // console.log(error)
        message.error('转换失败,该图片不支持转换！')
      }
    }
  })
}
</script>

<template>
  <div
    ref="toolbarEl"
    class="img-toolbar tb-component-toolbar-inner"
    :style="{
      left: position.left + 'px',
      top: position.top + 'px',
      opacity: position.show && currentComponent ? 1 : 0,
      scale: position.show && currentComponent ? 1 : 0
    }"
  >
    <div class="btn" @click="handleBorderUpdate">
      <NIcon :component="BorderStyle" size="24" />
    </div>
    <div class="btn" @click="handleTextAlignUpdate('left')">
      <NIcon :component="FloatLeft" size="24" />
    </div>
    <div class="btn" @click="handleTextAlignUpdate('center')">
      <NIcon :component="FloatCenter" size="24" />
    </div>
    <div class="btn" @click="handleTextAlignUpdate('right')">
      <NIcon :component="FloatRight" size="24" />
    </div>
    <div :class="{ btn: 1, disabled: !isExternalUrl }" @click="handleUrlUpdate">
      <NIcon :component="UrlIcon" size="24" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.img-toolbar {
  position: absolute;
  height: fit-content;
  color: #333;
  padding: 0px;
  transition: transform 0.1s;
}
.btn {
  display: flex;
  align-items: center;
  background-color: v-bind('themeVars.buttonColor2');
  padding: 5px;
  border-radius: 3px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
  }
  &:active {
    background-color: v-bind('themeVars.buttonColor2Pressed');
  }
}
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
