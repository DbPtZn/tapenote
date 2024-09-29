<script lang="ts" setup>
import { Commander, ComponentInstance, ContentType, Injector, Renderer, Slot } from '@textbus/core'
import { computed, inject, onUnmounted, reactive, ref } from 'vue'
import { AddAnimeService } from '../../services'
import { Editor, Layout } from '@textbus/editor'
import { UIIcon, UIConfig } from '../../common'
import { AnimeProvider, Structurer } from '../..'
import { animeComponent } from '../../components/anime/_api'
type AnimeOption = ReturnType<AnimeProvider['getOptions']>[0]
const injector = inject('injector') as Injector
const anime = injector.get(AnimeProvider)
const animeOptions = anime.getOptions()
const addAnimeService = injector.get(AddAnimeService)
const animeProvider = injector.get(AnimeProvider)
const structurer = injector.get(Structurer)
const commander = injector.get(Commander)
const renderer = injector.get(Renderer)
const layout = injector.get(Layout)
const editor = injector.get(Editor)
const container = layout.container
const scrollerRef = structurer.scrollerRef!
const caretRef = ref()
const triggerRef = ref()

const isPopoverShow = ref(false)

let currentElement: HTMLElement | null = null
let currentComponent: ComponentInstance | null = null
const position = reactive({
  left: 0,
  top: 0,
  show: false
})
const exclude = ['RootComponent', 'ParagraphComponent', 'BlockComponent', 'AnimeIgnoreComponent', 'AnimeComponent']
const subscription = addAnimeService.onComponentActive.subscribe(component => {
  // console.log(component)
  // 如果是只读状态，直接跳出
  if (editor.readonly) {
    position.show = false
    isPopoverShow.value = false
    return
  }

  // 如果组件不存在，直接跳出
  if (!component) {
    position.show = false
    isPopoverShow.value = false
    return
  }

  isPopoverShow.value = false // 组件变化时可以隐藏弹出层
  if (exclude.includes(component.name) || component.state.dataAnime) {
    if (component.parentComponent) {
      // 如果组件属于非动画组件，且其父组件也属于非动画组件，不显示按钮
      if (exclude.includes(component.parentComponent.name) || component.parentComponent.state.dataAnime) {
        return
      }
      // 否则，在父组件上显示按钮
      component = component.parentComponent
    }
  }

  // 递归查询父组件是否包含动画忽略组件，若包含该组件则不显示按钮
  let parentComponent = component.parentComponent
  while (parentComponent) {
    if (parentComponent && parentComponent.name === 'RootComponent') break
    if (parentComponent && parentComponent.name === 'AnimeIgnoreComponent') return
    parentComponent = parentComponent.parentComponent
  }

  // 如果是行内组件或文本组件，不显示按钮（可以通过 formatter 方式设置动画）
  if ([ContentType.InlineComponent, ContentType.Text].includes(component.type)) return

  // 当组件的父组件属于动画组件（动画组件包裹模式）或 组件的 state 中 dataAnime 为 true，说明该组件已经添加动画
  if (component.parentComponent?.name === 'AnimeComponent' || component.state.dataAnime) return

  const vNode = renderer.getVNodeByComponent(component)
  const nativeNode = renderer.getNativeNodeByVNode(vNode)

  const containerRect = container.getBoundingClientRect()
  const rect = nativeNode.getBoundingClientRect()
  const top = rect.top - containerRect.top

  position.left = nativeNode.offsetLeft
  position.top = top
  position.show = true

  currentComponent = component
  currentElement = nativeNode
})

const currentOption = reactive({
  effect: animeOptions[0].value,
  title: animeOptions[0].label
})
const offsetVal = computed(() => {
  // 计算动画标题的宽度, 修正按钮位置
  return currentOption.title.length * 14 
})

/** 应用当前值 */
function handleClick() {
  if (currentComponent) {
    // console.log(currentComponent)
    animeProvider.addAnime(currentComponent, currentOption.effect, currentOption.title)
  }
  position.show = false
  isPopoverShow.value = false
  currentComponent = null
}
/** 列表选择 */
function handleSelect(option: AnimeOption) {
  currentOption.effect = option.value
  currentOption.title = option.label

  if (currentComponent) {
    // addAnime(currentComponent)
    animeProvider.addAnime(currentComponent, currentOption.effect, currentOption.title)
  }
  position.show = false
  isPopoverShow.value = false
  currentComponent = null
}

function handleMouseMove() {
  position.show = true
  if (currentElement) currentElement.style.outline = '1px dashed #aaaaaa30'
}
function handleMouseLeave() {
  if (currentElement) currentElement.style.outline = 'none'
}

function handleClickoutside(ev) {
  if (caretRef.value === ev.target) {
    return
  }
  position.show = false
  isPopoverShow.value = false
}

onUnmounted(() => {
  subscription.unsubscribe()
})
</script>
<template>
  <UIConfig>
    <div ref="toolRef" class="tool">
      <div
        ref="btnRef"
        class="tool-btn"
        :style="{
          left: position.left - offsetVal + 'px',
          top: position.top + 'px',
          opacity: position.show && currentComponent ? 1 : 0,
          scale: position.show && currentComponent ? 1 : 0
        }"
        @mousemove="handleMouseMove" 
        @mouseleave="handleMouseLeave"
      >
        <n-popover 
          trigger="click" 
          placement="right" 
          :raw="true" 
          :to="scrollerRef || false" 
          :show-arrow="false" 
          :show="isPopoverShow"
          :style="{
            marginLeft: '0!important',
            borderRadius: '6px'
          }"
          @clickoutside="handleClickoutside"
        >
          <template #trigger>
            <div class="trigger" ref="triggerRef">
              <div class="left-btn" @click="handleClick()">
                <!-- currentOption.title.substring(0, 4) + `${currentOption.title.length > 4 ? '...' : ''}` -->
                <span class="left-btn-txt">{{ currentOption.title }}</span>
              </div>
              <div class="right-btn" ref="caretRef" @click="isPopoverShow = !isPopoverShow">
                <UIIcon :class="['caret', isPopoverShow ? 'active' : '']" icon="textbus-dropdown-caret" />
              </div>
            </div>
          </template>
          <!-- 内容 -->
          <div 
            class="content"
            @mousemove="handleMouseMove" 
            @mouseleave="handleMouseLeave"
          >
            <div
              v-for="option in animeOptions"
              :key="option.value"
              :class="['option']"
              @click="handleSelect(option)"
              @mouseenter.self="option.play(($event.target as HTMLElement).firstChild as HTMLElement)"
            >
              <div class="option-label">
                {{ option.label }}
              </div>
            </div>
          </div>
        </n-popover>
      </div>
    </div>
  </UIConfig>
</template>

<style lang="scss" scoped>
.content {
  max-width: 325px;
  padding: 6px;
  border-radius: 6px;
  // background-color: #0000002f;
  .option {
  display: inline-block;
  margin: 3px;
  padding: 3px;
  border-radius: 3px 3px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8ad;
  cursor: pointer;
  transition: transform 0.1s;
  &:hover {
    transform: scale(1.1);
  }
  .option-label {
    color: var(--tb-textColor1);
    // color: #fff;
  }
}
}
.tool {
  position: absolute;
  user-select: none;
  right: 84px;
  top: -32px;
  .tool-btn {
    position: absolute;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    word-break: keep-all;
    box-sizing: border-box;
    // padding: 3px 6px;
    font-size: 14px;
    color: var(--tb-textColor1);
    background-color: var(--tb-buttonColor2);
    transition: opacity 0.5s ease-in-out;
    cursor: pointer;
    &:active {
      background-color: var(--tb-buttonColor2Pressed);
    }
    .trigger {
      display: flex;
      flex-direction: row;
      .caret {
        pointer-events: none;
        transition: all 0.15s ease-in-out;
        transform: rotate(-90deg);
      }
      .active {
        transform: rotate(90deg);
      }
    }
  }
  .left-btn {
    display: flex;
    align-items: center;
    user-select: none;
    padding: 6px 12px;
    box-sizing: border-box;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    word-break: keep-all;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      background-color: var(--tb-buttonColor2Hover);
    }
  }
  .right-btn {
    display: flex;
    align-items: center;
    user-select: none;
    padding: 0 3px;
    box-sizing: border-box;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    cursor: pointer;
    &:hover {
      background-color: var(--tb-buttonColor2Hover);
    }
  }
}
</style>
