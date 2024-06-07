import { Injectable, Provider, retry } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'
import anime from 'animejs'

const DURATION = 1000 // 动画持续时间基本量 / 1秒
/** 弹入 */
const bounce = {
  bounceIn(target: Element) {
    return anime({
      targets: target,
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInDown(target: Element) {
    return anime({
      targets: target,
      translateY: [-100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInLeft(target: Element) {
    return anime({
      targets: target,
      translateX: [-100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInRight(target: Element) {
    return anime({
      targets: target,
      translateX: [100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInUp(target: Element) {
    return anime({
      targets: target,
      translateY: [100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  }
}

/** 渐入 */
const fide = {
  fideIn(target: Element) {
    return anime({
      targets: target,
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInDown(target: Element) {
    return anime({
      targets: target,
      translateY: [-100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInLeft(target: Element) {
    return anime({
      targets: target,
      translateX: [-100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInRight(target: Element) {
    return anime({
      targets: target,
      translateX: [100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInUp(target: Element) {
    return anime({
      targets: target,
      translateY: [100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  }
}

/** 翻入 */
const filp = {
  filpInX(target: Element) {
    return anime({
      targets: target,
      rotateX: [-180, 0],
      opacity: [0, 1],
      duration: DURATION * 2
    })
  },
  filpInY(target: Element) {
    return anime({
      targets: target,
      rotateY: [-180, 0],
      opacity: [0, 1],
      duration: DURATION * 2
    })
  }
}

/** 闪入 */
const zoom = {
  zoomIn(target: Element) {
    return anime({
      targets: target,
      rotateX: [-180, 0],
      opacity: [0, 1],
      duration: DURATION
    })
  }
}

// export const AnimeEffectMap: Map<string, { name: string; applyEffect: (target: Element) => anime.AnimeInstance }> = new Map([
//   ['bounceIn', { name: '弹入',  applyEffect: bounce.bounceIn }],
//   ['bounceInDown', { name: '向下弹入',  applyEffect: bounce.bounceInDown }],
//   ['bounceInLeft', { name: '自左弹入',  applyEffect: bounce.bounceInLeft }],
//   ['bounceInRight', { name: '自右弹入',  applyEffect: bounce.bounceInRight }],
//   ['bounceInUp', { name: '向上弹入',  applyEffect: bounce.bounceInUp }],
//   ['fideIn', { name: '渐入',  applyEffect: fide.fideIn }],
//   ['fideInDown', { name: '向下渐入',  applyEffect: fide.fideInDown }],
//   ['fideInUp', { name: '向上渐入',  applyEffect: fide.fideInUp }],
//   ['fideInLeft', { name: '自左渐入',  applyEffect: fide.fideInLeft }],
//   ['fideInRight', { name: '自右渐入', applyEffect: fide.fideInRight }],
//   ['filpInX', { name: '沿X轴翻转进入',  applyEffect: filp.filpInX }],
//   ['filpInY', { name: '沿Y轴翻转进入',  applyEffect: filp.filpInY }]
// ])
interface AnimeOption {
  label: string
  value: string
  applyEffect: (target: HTMLElement) => void
  disabled: boolean
  default?: boolean
}
@Injectable()
export class AnimeProvider {
  effectsMap: Map<string, { name: string; applyEffect: (target: Element) => anime.AnimeInstance }>
  constructor() {
    this.effectsMap = new Map([
      ['bounceIn', { name: '弹入',  applyEffect: bounce.bounceIn }],
      ['bounceInDown', { name: '向下弹入',  applyEffect: bounce.bounceInDown }],
      ['bounceInLeft', { name: '自左弹入',  applyEffect: bounce.bounceInLeft }],
      ['bounceInRight', { name: '自右弹入',  applyEffect: bounce.bounceInRight }],
      ['bounceInUp', { name: '向上弹入',  applyEffect: bounce.bounceInUp }],
      ['fideIn', { name: '渐入',  applyEffect: fide.fideIn }],
      ['fideInDown', { name: '向下渐入',  applyEffect: fide.fideInDown }],
      ['fideInUp', { name: '向上渐入',  applyEffect: fide.fideInUp }],
      ['fideInLeft', { name: '自左渐入',  applyEffect: fide.fideInLeft }],
      ['fideInRight', { name: '自右渐入', applyEffect: fide.fideInRight }],
      ['filpInX', { name: '沿X轴翻转进入',  applyEffect: filp.filpInX }],
      ['filpInY', { name: '沿Y轴翻转进入',  applyEffect: filp.filpInY }]
    ]) 
  }
  getAnime(key: string) {
    return this.effectsMap.get(key)
  }
  getOptions() {
    const animeOptions: AnimeOption[] = []
    this.effectsMap.forEach((value, key) => {
      animeOptions.push({
        label: value.name,
        value: key,
        applyEffect: value.applyEffect,
        disabled: false,
        default: false
      })
    })
    return animeOptions
  }

  destory() {
    this.effectsMap.clear()
  }
}
