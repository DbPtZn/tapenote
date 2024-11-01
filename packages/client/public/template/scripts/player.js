const {  fromEvent, Subject, Observable } = stream
class Player {
  stateUpdateEvent = new Subject()
  onStateUpdate = this.stateUpdateEvent.asObservable()

  subtitleUpdataEvent = new Subject()
  onSubtitleUpdate = this.subtitleUpdataEvent.asObservable()

  rateChangeEvent = new Subject()
  onRateChange = this.rateChangeEvent.asObservable()

  volumeChangeEvent = new Subject()
  onVolumeChange = this.volumeChangeEvent.asObservable()

  playOverEvent = new Subject()
  onPlayOver = this.playOverEvent.asObservable()

  data = []
  sourceData = []

  scrollerRef = null
  rootRef = null
  containerRef = null

  subs = []
  scrollerSub = null
  timer = 0
  scrollTime = 0

  /** 公开状态 */
   subtitle = ''
   rate = 1
   volume = 1
   isPlaying = false
   isPause = false
   currentTime = 0 // 当前片段播放时间
   totalTime = 0 // 当前总播放时间
   scrollTop = 0

  /** 临时记录 */
   total = 0
   animeCount = 0
   subtitleCount = 0
   keyframeHistory = []

  /** 微课数据 */
   audio = null
   duration = 0

   keyframeSequence = []
   subtitleSequence = []
   subtitleKeyframeSequence = []
   animeElementSequence = []


   constructor(scrollerRef, containerRef) {
    this.scrollerRef = scrollerRef
    this.containerRef = containerRef
   }

   /** 载入数据 */
   loadData(data = []) {
    return new Promise((resolve, reject) => {
      this.sourceData = data
      // 导入音频数据（在 preview 模式下是多个音频片段）
      const audioSequence = data.map(item => {
        return loadAudio(item.audio)
      })
      /** 预加载音频文件 */
      return Promise.all(audioSequence)
        .then(audios => {
          // 音频全部载入完成的后续操作
          this.data = data.map((item, index) => {
            return {
              audio: audios[index],
              duration: item.duration,
              animeElementSequence: item.promoterSequence.map(item => {
                return this.scrollerRef.querySelectorAll(`[data-id="${item}"]`)
              }),
              keyframeSequence: item.keyframeSequence,
              subtitleSequence: item.subtitleSequence,
              subtitleKeyframeSequence: item.subtitleKeyframeSequence
            }
          })
          resolve(this.data)
        })
        .catch(error => {
          console.error('音频文件加载失败：' + error)
          return
        })
    })
  }

  /** 递归播放多个项目 */
  playMulti(args) {
    const { data, index, startPoint } = args
  
    if (index < data.length) {
      const { audio, duration, animeElementSequence, keyframeSequence, subtitleSequence, subtitleKeyframeSequence } = data[index]
      /** 将数据更新至当前播放对象 */
      this.audio = audio
      this.duration = duration
      this.animeElementSequence = animeElementSequence
      this.keyframeSequence = keyframeSequence
      this.subtitleSequence = subtitleSequence || []
      this.subtitleKeyframeSequence = subtitleKeyframeSequence || []

      if (!this.audio) return console.warn('音频未加载完成或已失效')
      if (this.isPlaying) return console.warn('正在播放中')

      /** 设置起始播放点  */
      if (startPoint) {
        if(startPoint[index].startIndex) {
          this.setAnimeVisible(false, startPoint[index].startIndex)
          this.animeCount = startPoint[index].startIndex
          this.subtitleCount = startPoint[index].startIndex 
        }
        if(startPoint[index].startTime) {
          if (this.duration < startPoint[index].startTime) {
            this.clear()
            this.setAnimeVisible(true)
            return console.warn('设置时长溢出！')
          }
          this.audio.currentTime = startPoint[index].startTime
        }
      } else {
        this.setAnimeVisible(false)
        this.animeCount = 0
        this.subtitleCount = 0
      }

      /** 将状态更新至当前播放对象 */
      this.isPlaying = true
      this.rate = this.audio.playbackRate
      this.volume = this.audio.volume
      this.stateUpdateEvent.next('') // 触发状态更新
     
      /** 是否包含字幕信息 */
      const hasSubtitle = subtitleSequence && subtitleSequence.length > 0 && subtitleKeyframeSequence && subtitleKeyframeSequence.length > 0

      this.timer = setInterval(() => {
        // 处理字幕
        if (hasSubtitle) {
          if (this.audio.currentTime > subtitleKeyframeSequence[this.subtitleCount]) {
            this.subtitle = this.subtitleSequence[this.subtitleCount]
            this.subtitleUpdataEvent.next(this.subtitle) // 发送字幕更新事件
            this.subtitleCount++
          }
        }

        // 处理动画
        if (this.audio.currentTime > keyframeSequence[this.animeCount]) {
          animeElementSequence[this.animeCount].forEach(el => {
            // 播放动画
            this.applyPlay(el, this.containerRef, this.scrollerRef)
          })
          this.keyframeHistory[this.animeCount] = this.keyframeSequence[this.animeCount] // 记录播放历史
          this.animeCount++
        }

        this.currentTime = this.audio.currentTime // 记录当前播放时间
        this.totalTime = this.total + this.audio.currentTime // 记录当前总播放时间
      }, 50)
      
      // 播放当前音频
      this.audio.play()

      /** 音量改变时 */
      this.audio.onvolumechange = () => {
        this.volumeChangeEvent.next(this.audio?.volume)
      }
      /** 速率改变时 */
      this.audio.onratechange = () => {
        this.rateChangeEvent.next(this.audio?.playbackRate)
      }

      // 监听音频播放结束事件，然后递归播放下一个音频
      this.audio.addEventListener('ended', () => {
        this.clear()
        clearInterval(this.timer)
        this.total += duration
        this.playMulti({ data, index: index + 1, startPoint })
      })
    } else {
      this.clear()
      this.total = 0
      this.totalTime = 0
      this.setAnimeVisible(true)
      this.stateUpdateEvent.next('')
      this.playOverEvent.next('') // 所有音频播放完毕,发布播放结束的订阅
      // 播放结束后立即显示忽略组件会导致内容突兀变动，因此设置为在滚动事件发生后再显示
      this.scrollerSub = fromEvent(this.scrollerRef, 'scroll').subscribe(ev => {
        this.showIgnoreComponent()
        this.scrollerSub.unsubscribe()
        clearTimeout(timer)
      })
      // 或者在 5 s 后显示（考虑可能没有滚动条的情况）
      const timer = setTimeout(() => {
        this.showIgnoreComponent()
        this.scrollerSub.unsubscribe()
        clearTimeout(timer)
      }, 5000);
    }
  }

  /** 启动播放 */
  start() {
    // console.log('开始播放')
    this.hideIgnoreComponent()
    this.init()
    this.playMulti({ data: this.data, index: 0 })
    this.stateUpdateEvent.next('start')
  }

  /** 从此处开始 */
  startHere(startTime, startIndex) {
    this.hideIgnoreComponent()
    this.clear()
    this.playMulti({ data: this.data, index: 0, startPoint: [{ startTime, startIndex }] })
    this.stateUpdateEvent.next('startHere')
  }

  /** 暂停 */
  pause() {
    if (this.isPlaying) {
      this.audio?.pause() //暂停音频
      this.scrollTop = this.scrollerRef.scrollTop //记录滚动条位置
      this.isPlaying = false
      this.isPause = true
    }
    this.stateUpdateEvent.next('pause')
  }

  /** 继续播放 */
  resume() {
    // console.log('继续播放')
    if (!this.isPlaying && this.isPause) {
      this.audio?.play()
      this.isPlaying = true
      this.isPause = false
      this.scrollerRef.scrollTop = this.scrollTop
    }
    this.stateUpdateEvent.next('resume')
  }

  /** 倒回 */
  rewind() {
    if (!this.audio || !this.isPlaying) return
    if (this.audio.currentTime > 2) {
      this.audio.currentTime -= 2 // 回跳 2 秒
      for (let index = this.keyframeHistory.length - 1; index >= 0; index--) {
        // 历史关键帧 > 当前播放时间
        if (this.keyframeHistory[index] > this.audio.currentTime) {
          this.animeElementSequence[index].forEach((el) => {
            el.style.opacity = '0'
          })
          this.animeCount = index
        } else {
          break
        }
      }
    }
  }

  /** 快进 */
  forward() {
    if (!this.audio || !this.isPlaying) return
    if (this.audio.currentTime < this.audio.duration - 2) {
      this.audio.currentTime += 2 //后跳 2 秒
    }
  }

  /** 加速 */
  speedUp() {
    if (!this.audio) return
    if (this.audio.playbackRate >= 2) {
      return //限制最高播放速率
    }
    this.audio.playbackRate += 0.2
    this.rate = this.audio.playbackRate
    this.rateChangeEvent.next(this.rate) // 发布速率变化订阅
  }
  /** 减速 */
  speedDown() {
    if (!this.audio) return
    if (this.audio.playbackRate <= 0.5) {
      return //限制最低播放速率
    }
    this.audio.playbackRate -= 0.2
    this.rate = this.audio.playbackRate
    this.rateChangeEvent.next(this.rate) // 发布速率变化订阅
  }

  /** 增大音量 */
  volumeUp() {
    if (!this.audio) return
    if (this.volume >= 1 || this.audio.volume >= 1) return
    if (this.volume >= 0.9) {
      this.audio.volume = 1
    } else {
      this.audio.volume += 0.1
    }
    this.volume = this.audio.volume
  }

  /** 降低音量 */
  volumeDown() {
    if (!this.audio) return
    if (this.volume <= 0 || this.audio.volume <= 0) return
    if (this.volume <= 0.1) {
      this.audio.volume = 0
    } else {
      this.audio.volume -= 0.1
    }
    this.volume = this.audio.volume
  }

  /** 重播 */
  replay() {
    this.init()
    this.start()
    this.stateUpdateEvent.next('replay')
  }

  /** 终止 */
  stop() {
    this.init()
    this.setAnimeVisible(true)
    this.playOverEvent.next('')
    this.scrollerSub = fromEvent(this.scrollerRef, 'scroll').subscribe(ev => {
      this.showIgnoreComponent()
      this.scrollerSub.unsubscribe()
    })
    this.stateUpdateEvent.next('stop')
  }

  /** 清理播放器数据状态 */
  clear() {
    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
    }
    this.animeCount = 0
    this.subtitleCount = 0
    this.keyframeHistory = []
    this.subtitle = ''
    this.isPlaying = false
    this.isPause = false
    this.currentTime = 0

    this.scrollTop = this.scrollerRef.scrollTop

    clearInterval(this.timer)

    this.subtitleUpdataEvent.next(this.subtitle) // 发布字幕更新订阅
  }

  /** 初始化 */
  init() {
    // 初始化滚动区
    this.scrollerRef.scrollTop = 0
    // 初始化
    this.total = 0
    this.totalTime = 0
    // 初始化播放器数据状态
    this.clear()
  }

  hideIgnoreComponent() {
    const container = this.containerRef
    const elements = container.querySelectorAll('anime-ignore')
    elements.forEach(el => {
      el.style.display = 'none'
    })
  }
  
  showIgnoreComponent() {
    const container = this.containerRef
    const elements = container.querySelectorAll('anime-ignore')
    elements.forEach(el => {
      el.style.display = 'block'
    })
  }


  /** 设置动画可见状态 */
  setAnimeVisible(visible, startPoint = 0) {
    this.animeElementSequence.forEach((item, index) => {
      if(index >= startPoint) {
        item.forEach(el => {
          // el.style.opacity = visible ? '1' : '0'
          el.style.visibility = visible ? 'visible' : 'hidden'
        })
      }
    })
  }

  /** 动画播放函数 */
  applyPlay(el, container, scroller) {
    this.applyAnime(el.dataset.effect, el)
    // console.log(el)
    this.applyScroll({
      el: el,
      scroller: scroller,
      container: container,
      commonRollSpeed: 1,
      commonReservedZone: 300,
      overflowTopRollSpeed: 2,
      overflowTopReservedZone: 200,
      overflowBottomRollSpeed: 2,
      overflowBottomReservedZone: 200
    })
    // 原生滚动模式
    // this.applyNativeScroll(el, container, scroller)                
  }

  /** 应用动画播放控制 */
  applyAnime(effectValue, el) {
    const style = window.getComputedStyle(el)
    const isInline = style.display === 'inline'
    isInline && (el.classList.add('anime-playing'))
    el.style.visibility = 'visible'
    const anime = getAnime(effectValue)
    if (anime) {
      anime.applyEffect(el).finished.then(() => {
        isInline && (el.classList.remove('anime-playing'))
      })
    } else {
      isInline && (el.classList.remove('anime-playing'))
    }
  }

  /** 应用页面滚动 */
  applyScroll(args) {
    const {
      el,
      scroller,
      container,
      commonRollSpeed,
      commonReservedZone,
      overflowTopRollSpeed,
      overflowTopReservedZone,
      overflowBottomRollSpeed,
      overflowBottomReservedZone
    } = args
    const Horizon = scroller.clientHeight // 可视窗口的高度
    const Scrolled = scroller.scrollTop // 已滚动高度
    const Node2Top = getTopDistance(el) - container.offsetTop // 节点距离文档顶部（指节点的上边界至文档顶部）
    const NodeHeight = el.clientHeight // 元素自身的高度
    const Node2HorizonBottom = Horizon + Scrolled - Node2Top - NodeHeight //节点距离可视区间底部
    if (Node2Top < Scrolled) {
      this.clearInterval() // 立即结束上一个滚动事务
      // 节点距离可视区间顶部小于滚动距离（溢出可视区间上边界），执行回滚动作
      let Node2HorizonTop = Scrolled - Node2Top // 溢出上边界的高度 = 已滚距离 - 节点至文档顶部距离
      let rollSpeed = Math.round((Node2HorizonTop + overflowTopReservedZone) / (30 / overflowTopRollSpeed)) // 基于溢出上边界的距离(加预留区高度)来计算滚动速率
      if (rollSpeed < 10) rollSpeed = 10 // 最小滚动速率为 10
      this.scrollTimer = setInterval(() => {
        scroller.scrollTop -= rollSpeed
        Node2HorizonTop -= rollSpeed
        if (Node2HorizonTop <= -overflowTopReservedZone) {
          this.clearInterval()
          return
        }
      }, 10)
    } else if (Node2HorizonBottom < 0) {
      this.clearInterval() // 立即结束上一个滚动事务
      //节点距离可视区间底部小于0（溢出可视区间下边界），执行滚动动作
      let Node2HorizonBottomAbs = Math.abs(Node2HorizonBottom) // 计算溢出的距离（取绝对值）
      let rollSpeed = Math.round((Node2HorizonBottomAbs + overflowBottomReservedZone) / (30 / overflowBottomRollSpeed)) // 基于溢出的距离(加预留区高度)计算滚动速率
      if (rollSpeed < 10) rollSpeed = 10 // 最小滚动速率为 10
      this.scrollTimer = setInterval(() => {
        scroller.scrollTop += rollSpeed
        Node2HorizonBottomAbs -= rollSpeed
        // 默认滚动后，给底部预留 100 px 的距离
        if (Node2HorizonBottomAbs < -overflowBottomReservedZone) {
          this.clearInterval()
          return
        }
      }, 10)
      // this.applyNativeScroll(el, container, scroller) // 原生滚动模式
    } else if (Node2HorizonBottom < 200 && Node2HorizonBottom > 0) {
      this.clearInterval() // 立即结束上一个滚动事务
      //设置当节点距离可视区间底部小于200时，执行动作
      let sum = 0 // 滚动累计量
      this.scrollTimer = setInterval(() => {
        scroller.scrollTop += 10 * commonRollSpeed
        sum += 10 * commonRollSpeed
        // 默认滚动后，给底部预留 300 px 的空间
        if (sum > commonReservedZone) {
          this.clearInterval()
          return
        }
      }, 20)
    } else {
      //排除上述三种情况以后，执行动作
      this.clearInterval()
      return
    }
  }

  /** 立即取消当前滚动事务 */
  clearInterval() {
    // 当两个滚动事务同时存在的时候可能会出现相互拉扯的情况，所以要确保同一时间只有一个事务
    clearInterval(this.scrollTimer)
  }

  /** 将音频时长（duration）转化成 HH:MM:SS 格式 */
  durationFormat(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${hours ? formattedHours + ':' : ''}${formattedMinutes}:${formattedSeconds}`;
  }

  destory() {
    this.stop()
    this.init()
    this.subs.forEach(sub => sub.unsubscribe())
  }
}


function getTopDistance(el) {
 let i = el.offsetTop
 while (el.offsetParent) {
   el = el.offsetParent
   i += el.offsetTop
 }
 return i
}

/** 异步加载音频数据 */
function loadAudio(src) {
 return new Promise((resolve, reject) => {
   const audio = new Audio(src)
   audio.addEventListener('canplaythrough', () => {
     resolve(audio)
   })

   audio.addEventListener('error', error => {
     reject(error)
   })

   audio.load()
 })
}