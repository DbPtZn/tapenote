<script lang="ts" setup>
import { Injector, Subscription } from '@textbus/core'
import { inject, nextTick, onUnmounted, reactive, ref } from 'vue'
import { DropdownOption } from 'naive-ui'
import _ from 'lodash'
import dayjs from 'dayjs'
import { RootEventService } from '../../services'
import { AnimeProvider, UIConfig } from '../..'
import { Player } from '../..'

const injector = inject('injector') as Injector
const rootEvent = injector.get(RootEventService)
const player = injector.get(Player)
const subs: Subscription[] = []
// const isPopoverShow = ref(false)

/** 最外层组件元素 */
let currentElement: HTMLElement | null = null

const animeElements = ref<string[]>([])
const position = reactive({
  x: 0,
  y: 0,
  show: false
})
// const exclude = ['RootComponent', 'ParagraphComponent', 'BlockComponent', ANIME_COMPONENT_NAME]
subs.push(
  rootEvent.onComponentContextmenu.subscribe(ev => {
    if (!ev) return
    animeElements.value = []

    let nativeNode = ev.target as HTMLElement
    // 查询动画格式
    while (nativeNode) {
      if (nativeNode.parentElement?.classList.contains('tb-root')) {
        currentElement = nativeNode
      }
      if (nativeNode.classList.contains('tb-root')) {
        break
      }
      const animeElement = AnimeProvider.toAnimeElement(nativeNode)
      if (animeElement) {
        const animeId = nativeNode.dataset.id
        if (animeId) animeElements.value.push(animeId)
      }
      nativeNode = nativeNode.parentNode as HTMLElement
    }

    if (animeElements.value.length === 0) return
    // 允许按 ctrl 时查看 DevTools
    !ev.ctrlKey && ev.preventDefault()
    position.show = false
    nextTick().then(() => {
      position.show = true
      position.x = ev.clientX
      position.y = ev.clientY
    })
    setActive()
    getOptions()
  })
)

const options = ref<DropdownOption[]>()
options.value = []
function getOptions() {
  const sourceData = player.sourceData[0]
  const sequence = sourceData.keyframeSequence.map((keyframe, index) => {
    if (animeElements.value.includes(sourceData.promoterSequence[index])) {
      return { keyframe, index }
    }
    return null
  })
  const points = sequence.filter(i => i !== null) as { keyframe: number; index: number }[]
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
            label: dayjs()
              .set('minute', point.keyframe / 60)
              .set('second', point.keyframe % 60)
              .format('mm:ss'),
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
    }
  ]
}

function setActive() {
  position.show = true
  if (currentElement) currentElement.classList.add('anime-box')
}
function setInactive() {
  position.show = false
  if (currentElement) currentElement.classList.remove('anime-box')
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
