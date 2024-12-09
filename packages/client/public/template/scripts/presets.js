/** 动画预设 */
const DURATION = 1000 // 动画持续时间基本量 / 1秒
/** 弹入 */
const bounce = {
  bounceIn(target) {
    return anime({
      targets: target,
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInDown(target) {
    return anime({
      targets: target,
      translateY: [-100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInLeft(target) {
    return anime({
      targets: target,
      translateX: [-100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInRight(target) {
    return anime({
      targets: target,
      translateX: [100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInUp(target) {
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
  fideIn(target) {
    return anime({
      targets: target,
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInDown(target) {
    return anime({
      targets: target,
      translateY: [-100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInLeft(target) {
    return anime({
      targets: target,
      translateX: [-100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInRight(target) {
    return anime({
      targets: target,
      translateX: [100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInUp(target) {
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
  filpInX(target) {
    return anime({
      targets: target,
      rotateX: [-180, 0],
      opacity: [0, 1],
      duration: DURATION * 2
    })
  },
  filpInY(target) {
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
  zoomIn(target) {
    return anime({
      targets: target,
      rotateX: [-180, 0],
      opacity: [0, 1],
      duration: DURATION
    })
  }
}

const effectsMap = new Map([
  ['bounceIn', { name: '弹入',  play: bounce.bounceIn }],
  ['bounceInDown', { name: '向下弹入',  play: bounce.bounceInDown }],
  ['bounceInLeft', { name: '自左弹入',  play: bounce.bounceInLeft }],
  ['bounceInRight', { name: '自右弹入',  play: bounce.bounceInRight }],
  ['bounceInUp', { name: '向上弹入',  play: bounce.bounceInUp }],
  ['fideIn', { name: '渐入',  play: fide.fideIn }],
  ['fideInDown', { name: '向下渐入',  play: fide.fideInDown }],
  ['fideInUp', { name: '向上渐入',  play: fide.fideInUp }],
  ['fideInLeft', { name: '自左渐入',  play: fide.fideInLeft }],
  ['fideInRight', { name: '自右渐入', play: fide.fideInRight }],
  ['filpInX', { name: '沿X轴翻转进入',  play: filp.filpInX }],
  ['filpInY', { name: '沿Y轴翻转进入',  play: filp.filpInY }]
])

function getAnime(key) {
  return effectsMap.get(key)
}