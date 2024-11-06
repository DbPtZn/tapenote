<script lang="ts" setup>
import { Injector, Subscription } from '@textbus/core'
import { inject, nextTick, onUnmounted, reactive, ref } from 'vue'
import { DropdownOption } from 'naive-ui'
import _ from 'lodash'
import dayjs from 'dayjs'
import { RootEventService } from '../../services'
import { UIConfig } from '../..'
import { Player } from '../..'

const injector = inject('injector') as Injector
const rootEvent = injector.get(RootEventService)
const player = injector.get(Player)
const subs: Subscription[] = []
// const renderer = injector.get(Renderer)
// const layout = injector.get(Layout)
// const animeEventService = injector.get(AnimeEventService)
// const rootComponent = injector.get(RootComponentRef)
// const container = layout.container
// const scrollerRef = configProvider.scrollerRef
// const caretRef = ref()
// const triggerRef = ref()

// const isPopoverShow = ref(false)

let currentElement: HTMLElement | null = null
// let currentComponent: ComponentInstance | null = null
let animeElements = ref<string[]>([])
const position = reactive({
  x: 0,
  y: 0,
  show: false
})
// const exclude = ['RootComponent', 'ParagraphComponent', 'BlockComponent', ANIME_COMPONENT_NAME]
subs.push(
  rootEvent.onComponentContextmenu.subscribe(ev => {
    if (!ev) return
    // ev.preventDefault()
    // console.log(ev)
    position.show = false
    nextTick().then(() => {
      position.show = true
      position.x = ev.clientX
      position.y = ev.clientY
    })
    
    let nativeNode = ev.target as HTMLElement
    // 查询动画格式
    while (nativeNode) {
      if (nativeNode.parentElement?.classList.contains('tb-root')) {
        currentElement = nativeNode
      }
      if (nativeNode.classList.contains('tb-root')) {
        break
      }
      if (['anime', 'anime-component'].includes(nativeNode.tagName.toLocaleLowerCase())) {
        const animeId = nativeNode.dataset.id
        if (animeId) animeElements.value.push(animeId)
      }
      nativeNode = nativeNode.parentNode as HTMLElement
    }

    //TODO 测试代码
    if (animeElements.value.length > 0) {
      ev.preventDefault()
    }

    setActive()
    getOptions()
  })
)

const options = ref<DropdownOption[]>()
options.value = []
function getOptions() {
  // console.log(animeElements.value)
  const sourceData = player.sourceData[0]
  // console.log(sourceData.promoterSequence)
  const sequence = sourceData.keyframeSequence.map((keyframe, index) => {
    if (animeElements.value.includes(sourceData.promoterSequence[index])) {
      return { keyframe, index }
    }
    return null
  })
  const points = sequence.filter(i => i !== null) as ({ keyframe: number; index: number })[]
  // console.log(dayjs().set('minute', 128.437/60).set('second', 128.437%60).format('mm:ss'))
  // console.log(points)
  options.value = [
    {
      key: 'play-here',
      label: '从此位置播放',
      show: points.length > 0,
      children: [
        ...points.map(point => {
          return {
            key: _.uniqueId(),
            label: dayjs().set('minute', point.keyframe/60).set('second', point.keyframe%60).format('mm:ss'),
            props: {
              onClick: () => {
                player.startHere(point.keyframe, point.index)
                setInactive()
              }
            }
          }
        })
      ],
      props: {
        onClick: () => {
          player.startHere(points[0].keyframe, points[0].index)
          setInactive()
        }
      }
    },
    {
      key: 'quote',
      label: '引用',
      props: {
        onClick: () => {
          setInactive()
        }
      }
    }
  ]
}


let original = {
  display: '',
  outline: ''
}
function setActive() {
  position.show = true
  if (currentElement) {
      original = {
        display: currentElement.style.display,
        outline: currentElement.style.outline
      }
      currentElement.style.display = 'block'
      currentElement.style.outline = '1px dashed #aaaaaa30'
    }
}
function setInactive() {
  position.show = false
  if (currentElement) {
    currentElement.style.display = original.display
    currentElement.style.outline = original.outline
    original = {
      display: '',
      outline: ''
    }
  }
  animeElements.value = []
}

function handleClickoutside(ev) {
  setInactive()
}


onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
})
</script>
<template>
  <UIConfig>
    <div ref="toolRef" class="tool">
      <n-dropdown
        placement="bottom-start"
        trigger="manual"
        :x="position.x"
        :y="position.y"
        :options="options"
        :show="position.show"
        :on-clickoutside="handleClickoutside"
      />
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
