const { fromEvent, Subject } = stream

class Player {
  onStateUpdate = new Subject()

  onSourceDataLoaded = new Subject()

  onParseDataLoaded = new Subject()

  onStateUpdate = new Subject()

  onSubtitleUpdate = new Subject()

  onRateChange = new Subject()

  onVolumeChange = new Subject()

  onStop = new Subject()

  onPlayOver = new Subject()

  /** 每次播放都会触发一次, 如果循环多个播放则每个循环都会触发一次 */
  onPlay = new Subject()

  onTimeUpdate = new Subject()

  /** 全局 */
  // rootRef! // 最外层容器
  injector = null
  anime = null
  _data = [] // 数据
  _sourceData = [] // 源数据
  scrollerEl = null // 滚动条
  containerEl = null
  subs = []
  scrollerSub
  audioSubs = []
  // timer!: NodeJS.Timeout
  pausableIntervalInstance = null
  scrollTimer = 0
  get data() {
    return this._data
  }
  get sourceData() {
    return this._sourceData
  }

  /** 播放器状态 */
  _isLoaded = false // 数据是否载入
  _subtitle = ''
  _rate = 1
  _volume = 1
  _isPlaying = false
  _isPause = false
  _currentTime = 0 // 当前片段播放时间
  _totalTime = 0 // 当前总播放时间
  _scrollTop = 0
  get isLoaded() {
    return this._isLoaded
  }
  get subtitle() {
    return this._subtitle
  }
  get rate() {
    return this._rate
  }
  get volume() {
    return this._volume
  }
  get isPlaying() {
    return this._isPlaying
  }
  get isPause() {
    return this._isPause
  }
  get currentTime() {
    return this._currentTime
  }
  get totalTime() {
    return this._totalTime
  }
  get scrollTop() {
    return this._scrollTop
  }

  /** 动画数据 */
  audio = null
  _duration = 0
  keyframeSequence = []
  subtitleSequence = []
  subtitleKeyframeSequence = []
  animeElementSequence = []
  get duration() {
    return this._duration
  }

  /** 临时记录 */
  total = 0
  animeCount = 0
  subtitleCount = 0
  keyframeHistory = []

  constructor(scrollerEl, containerEl) {
    this.scrollerEl = scrollerEl
    this.containerEl = containerEl
  }
  // setup(scrollerEl, containerEl) {
  //   console.log('播放器初始化', scrollerEl, containerEl)
  //   this.scrollerEl = scrollerEl
  //   this.containerEl = containerEl
  // }

  loadData(data = []) {
    // 对载入的数据进行深拷贝（数据可能在过程中发生修改, 不可以使用源数据（具体到本项目中，源数据可能是 pinia 中管理的，直接使用源数据会把数据中的数组直接引用进来）
    this._sourceData = JSON.parse(JSON.stringify(data))
    this.onSourceDataLoaded.next(this._sourceData)
    return new Promise((resolve, reject) => {
      // 导入音频数据（在 preview 模式下是多个音频片段）
      const audioSequence = this._sourceData.map(item => {
        return loadAudio(item.audio)
      })
      /** 预加载音频文件 */
      return Promise.all(audioSequence)
        .then(audios => {
          // 音频全部载入完成的后续操作
          this._data = this._sourceData.map((item, index) => {
            return {
              key: item.key,
              audio: audios[index],
              duration: item.duration,
              animeElementSequence: item.promoterSequence.map(item => {
                return this.scrollerEl.querySelectorAll(`[data-id="${item}"]`)
              }),
              keyframeSequence: item.keyframeSequence,
              subtitleSequence: item.subtitleSequence,
              subtitleKeyframeSequence: item.subtitleKeyframeSequence
            }
          })
          this._isLoaded = true
          this.onParseDataLoaded.next(this._data)
          resolve(this._data)
        })
        .catch(error => {
          console.error('音频文件加载失败2：', error)
          reject(error)
        })
    })
  }

  /** 递归播放多个项目 */
  playMulti(args) {
    const { data, index, startPoint } = args
    if (index < data.length) {
      this.onPlay.next(data[index]?.key || '')
      const { audio, duration, animeElementSequence, keyframeSequence, subtitleSequence, subtitleKeyframeSequence } = data[index]
      /** 将数据更新至当前播放对象 */
      this.audio = audio
      this._duration = duration
      this.animeElementSequence = animeElementSequence
      this.keyframeSequence = keyframeSequence
      this.subtitleSequence = subtitleSequence || []
      this.subtitleKeyframeSequence = subtitleKeyframeSequence || []
      // console.log('数据已经更新到当前播放对象上', duration)
      if (!this.audio) return console.warn('音频未加载完成或已失效')
      if (this._isPlaying) return console.warn('正在播放中')

      /** 设置起始播放点  */
      if (startPoint) {
        if (startPoint[index].startIndex) {
          this.setAllAnimeVisible(false, startPoint[index].startIndex)
          this.animeCount = startPoint[index].startIndex
          this.subtitleCount = startPoint[index].startIndex
        }
        if (startPoint[index].startTime) {
          if (this._duration < startPoint[index].startTime) {
            this.clear()
            this.setAllAnimeVisible(true)
            return console.warn('设置时长溢出！')
          }
          this.audio.currentTime = startPoint[index].startTime
        }
      } else {
        this.setAllAnimeVisible(false)
        this.animeCount = 0
        this.subtitleCount = 0
      }

      /** 将状态更新至当前播放对象 */
      this._isPlaying = true
      this._rate = this.audio.playbackRate
      this._volume = this.audio.volume
      this.onStateUpdate.next('') // 触发状态更新

      /** 是否包含字幕信息 */
      const hasSubtitle = subtitleSequence && subtitleSequence.length > 0 && subtitleKeyframeSequence && subtitleKeyframeSequence.length > 0

      this.pausableIntervalInstance = createPausableInterval(() => {
        // console.log('播放中', this.isPlaying)
        if (!this.isPlaying) return
        this.onTimeUpdate.next(this._currentTime)
        // console.log('当前时间', this.audio!.currentTime)
        // console.log(this.animeCount, this.subtitleCount)
        // console.log(keyframeSequence, keyframeSequence[this.animeCount], this.audio!.currentTime > keyframeSequence[this.animeCount])
        // 处理字幕
        if (hasSubtitle) {
          const currentSubtitleKeyframe = subtitleKeyframeSequence[this.subtitleCount]
          if (currentSubtitleKeyframe && this.audio.currentTime > currentSubtitleKeyframe) {
            // 播放字幕
            this._subtitle = this.subtitleSequence[this.subtitleCount]
            this.onSubtitleUpdate.next(this.subtitle)
            // if (this.subtitleCount < subtitleCountLimit) this.subtitleCount++ // 必须允许溢出，否则达到终点后会不断重复
            this.subtitleCount++
          }
        }

        // 处理动画
        // console.log(this.animeCount, animeCountLimit)
        if (this.audio.currentTime > keyframeSequence[this.animeCount]) {
          // console.log('播放动画', this.audio!.currentTime, keyframeSequence[this.animeCount])
          animeElementSequence[this.animeCount].forEach(el => {
            // 播放动画
            this.applyPlay(el, this.containerEl, this.scrollerEl)
          })
          this.animeCount++
        }

        this._currentTime = this.audio.currentTime // 记录当前播放时间
        this._totalTime = this.total + this.audio.currentTime // 记录当前总播放时间
      }, 50)

      // 播放当前音频
      this.audio.play()
      // console.log('音频开始播放')

      this.audioSubs.push(
        /** 音量改变时 */
        fromEvent(this.audio, 'volumechange').subscribe(() => {
          this.onVolumeChange.next(this.audio?.volume)
        }),
        /** 速率改变时 */
        fromEvent(this.audio, 'ratechange').subscribe(() => {
          const rate = Math.floor(this.audio.playbackRate * 10) / 10
          this.onRateChange.next(rate)
        }),
        // 监听音频播放结束事件，然后递归播放下一个音频
        fromEvent(this.audio, 'ended').subscribe(() => {
          // console.log('播放结束')
          this.clear()
          // clearInterval(this.timer)
          this.pausableIntervalInstance?.stop()
          this.audioSubs.forEach(sub => sub.unsubscribe())
          this.audioSubs.length = 0
          // console.log('播放结束，销毁 subs', this.audioSubs)
          this.total += duration
          this.playMulti({ data, index: index + 1, startPoint })
        })
      )
    } else {
      // console.log('播放完毕')
      this.clear()
      this.total = 0
      this._totalTime = 0
      this.setAllAnimeVisible(true)
      this.onStateUpdate.next('')
      this.onPlayOver.next('') // 所有音频播放完毕,发布播放结束的订阅
      // 播放结束后立即显示忽略组件会导致内容突兀变动，因此设置为在滚动事件发生后再显示
      this.scrollerSub = fromEvent(this.scrollerEl, 'scroll').subscribe(ev => {
        this.showIgnoreComponent()
        this.scrollerSub.unsubscribe()
        clearTimeout(timer)
      })
      // 或者在 5 s 后显示（考虑可能没有滚动条的情况）
      const timer = setTimeout(() => {
        this.showIgnoreComponent()
        this.scrollerSub.unsubscribe()
        clearTimeout(timer)
      }, 5000)
    }
  }

  /** 启动播放 */
  start(isInitScrollTop = true) {
    // console.log('开始播放')
    this.hideIgnoreComponent()
    this.init(isInitScrollTop)
    // console.log('初始化完成')
    this.playMulti({ data: this._data, index: 0 })
    this.onStateUpdate.next('start')
  }

  /** 从此处开始 */
  startHere(startTime, startIndex = 0) {
    this.hideIgnoreComponent()
    this.clear()
    this.playMulti({ data: this._data, index: 0, startPoint: [{ startTime, startIndex }] })
    this.recalculate(false)
    this.onStateUpdate.next('startHere')
  }

  /** 暂停 */
  pause() {
    if (this._isPlaying) {
      this.audio?.pause() //暂停音频
      this.pausableIntervalInstance?.pause()
      this._scrollTop = this.scrollerEl.scrollTop //记录滚动条位置
      this._isPlaying = false
      this._isPause = true
    }
    this.onStateUpdate.next('pause')
  }

  /** 继续播放 */
  resume() {
    // console.log('继续播放')
    if (!this._isPlaying && this._isPause) {
      this.audio?.play()
      this.pausableIntervalInstance?.resume()
      this._isPlaying = true
      this._isPause = false
      this.scrollerEl.scrollTop = this._scrollTop
    }
    this.onStateUpdate.next('resume')
  }

  /** 跳转至指定时间(秒) */
  seek(time) {
    // console.log('seek')
    if (!this.audio) return
    const isForward = time > this.audio.currentTime
    // console.log(isForward ? '快进' : '快退')
    this.audio.currentTime = time
    this._currentTime = this.audio.currentTime // 记录当前播放时间

    // 重新计算 animeCount, 之所以需要一个个遍历，是因为我们需要把已经播放的内容重新隐藏掉
    this.recalculate(isForward)
    this.onStateUpdate.next('seek')
  }

  /** 重新计算动画和字幕的计数器 */
  recalculate(isForward) {
    if (!this.audio) return
    // 由于播放到终点的时候，count 可能会溢出序列帧范围，因此这里针对这种情况使用 limit 进行处理，确保 count 在序列帧范围内, 否则 if 判断会一直为 false
    const animeCountLimit = this.keyframeSequence.length - 1
    const subtitleCountLimit = this.subtitleKeyframeSequence.length - 1
    if (!isForward) {
      let animeIndex = this.animeCount > animeCountLimit ? animeCountLimit : this.animeCount
      // 动画关键帧 > 当前播放时间时，说明该动画应处于未播放状态，将动画设置为隐藏
      while (this.keyframeSequence[animeIndex] > this.audio.currentTime) {
        this.animeElementSequence[animeIndex]?.forEach((el) => {
          // Ⅰ这里会遇到一个问题，就是如果后面的关键帧重复了前面的动画，那么通过后面的关键帧进行隐藏会导致前面的动画被隐藏
          Player.hiddenElement(el)
        })
        animeIndex--
      }
      this.animeCount = animeIndex === -1 ? 0 : animeIndex
      // Ⅱ 再从 0 到 animeIndex 循环一遍，把 animeIndex 之前的动画设置为显示 (因为有可能在上面的循环中被隐藏了)
      for(let i = 0; i < animeIndex; i++) {
        this.animeElementSequence[i]?.forEach((el) => {
          Player.showElement(el)
        })
      }
  
      let subtitleIndex = this.subtitleCount > subtitleCountLimit ? subtitleCountLimit : this.subtitleCount
      // 字幕关键帧 > 当前播放时间时，说明该字幕未播放，指针继续向前移
      while (this.subtitleKeyframeSequence[subtitleIndex] > this.audio.currentTime) {
        // console.log('字幕未播放')
        subtitleIndex--
      }
      this.subtitleCount = subtitleIndex === -1 ? 0 : subtitleIndex
      return
    }
    let animeIndex = this.animeCount > animeCountLimit ? animeCountLimit : this.animeCount
    while (this.keyframeSequence[animeIndex] < this.audio.currentTime) {
      // console.log('动画已播放')
      this.animeElementSequence[animeIndex]?.forEach((el) => {
        // el.style.visibility = 'visible'
        Player.showElement(el)
      })
      animeIndex++
    }
    this.animeCount = animeIndex <= this.keyframeSequence.length - 1 ? animeIndex : this.keyframeSequence.length - 1

    let subtitleIndex = this.subtitleCount > subtitleCountLimit ? subtitleCountLimit : this.subtitleCount
    while (this.subtitleKeyframeSequence[subtitleIndex] < this.audio.currentTime) {
      // console.log('字幕已播放')
      subtitleIndex++
    }
    this.subtitleCount = subtitleIndex <= this.subtitleKeyframeSequence.length - 1 ? subtitleIndex : this.subtitleKeyframeSequence.length - 1
  }

  /** 倒回 */
  rewind() {
    if (!this.audio || !this._isPlaying) return
    if (this.audio.currentTime > 2) {
      this.audio.currentTime -= 2 // 回跳 2 秒
      this._currentTime = this.audio.currentTime
      this.recalculate(false)
    }
  }

  /** 快进 */
  forward() {
    if (!this.audio || !this._isPlaying) return
    if (this.audio.currentTime < this.audio.duration - 2) {
      this.audio.currentTime += 2 //后跳 2 秒
      this._currentTime = this.audio.currentTime
      this.recalculate(true)
    }
  }

  /** 加速 */
  speedUp() {
    if (!this.audio) return
    if (this.audio.playbackRate >= 2) {
      return //限制最高播放速率
    }
    this.audio.playbackRate += 0.2
    this._rate = this.audio.playbackRate
    // this._rateChangeEvent.next(this._rate) // 发布速率变化订阅
  }
  /** 减速 */
  speedDown() {
    if (!this.audio) return
    if (this.audio.playbackRate <= 0.5) {
      return //限制最低播放速率
    }
    this.audio.playbackRate -= 0.2
    this._rate = this.audio.playbackRate
    // this._rateChangeEvent.next(this._rate) // 发布速率变化订阅
  }

  setSpeed(rate) {
    if (!this.audio) return
    this.audio.playbackRate = rate
    this._rate = this.audio.playbackRate
  }

  setVolume(vol) {
    if (!this.audio) return
    this.audio.volume = vol
    this._volume = this.audio.volume
  }

  /** 增大音量 */
  volumeUp() {
    if (!this.audio) return
    if (this._volume >= 1 || this.audio.volume >= 1) return
    if (this._volume >= 0.9) {
      this.audio.volume = 1
    } else {
      this.audio.volume += 0.1
    }
    this._volume = this.audio.volume
  }

  /** 降低音量 */
  volumeDown() {
    if (!this.audio) return
    if (this._volume <= 0 || this.audio.volume <= 0) return
    if (this._volume <= 0.1) {
      this.audio.volume = 0
    } else {
      this.audio.volume -= 0.1
    }
    this._volume = this.audio.volume
  }

  /** 重播 */
  replay() {
    this.init()
    this.start()
    this.onStateUpdate.next('replay')
  }

  /** 终止 */
  stop() {
    this.init()
    this.setAllAnimeVisible(true)
    this.onStop.next()
    this.onPlayOver.next('')
    this.scrollerSub = fromEvent(this.scrollerEl, 'scroll').subscribe(ev => {
      this.showIgnoreComponent()
      this.scrollerSub.unsubscribe()
    })
    this.onStateUpdate.next('stop')
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
    this._subtitle = ''
    this._isPlaying = false
    this._isPause = false
    this._currentTime = 0
    this._scrollTop = this.scrollerEl.scrollTop
    this.pausableIntervalInstance?.stop()
    this.pausableIntervalInstance = undefined
    this.onSubtitleUpdate.next(this.subtitle) // 发布字幕更新订阅
  }

  /** 初始化 */
  init(isInitScrollTop = true) {
    isInitScrollTop && (this.scrollerEl.scrollTop = 0)  // 初始化滚动区
    this.total = 0
    this._totalTime = 0
    this.clear() // 初始化播放器数据状态
  }

  hideIgnoreComponent() {
    const container = this.containerEl
    const elements = container.querySelectorAll('anime-ignore')
    elements.forEach(el => {
      el.classList.add('ignore-component-hidden')
    })
  }

  showIgnoreComponent() {
    const container = this.containerEl
    const elements = container.querySelectorAll('anime-ignore')
    elements.forEach(el => {
      el.classList.remove('ignore-component-hidden')
    })
  }

  /** 设置所有动画可见状态 */
  setAllAnimeVisible(visible, startPoint = 0) {
    this.animeElementSequence.forEach((item, index) => {
      if (index >= startPoint) {
        item.forEach(el => {
          visible ? Player.showElement(el) : Player.hiddenElement(el)
        })
      }
    })
  }

  /** 动画播放函数 */
  applyPlay(el, container, scroller) {
    this.applyAnime(el.dataset.effect, el)
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
    isInline && el.classList.add('player-anime-playing')
    Player.showElement(el)
    const anime = getAnime(effectValue)
    if (anime) {
      anime.play(el).finished.then(() => {
        isInline && el.classList.remove('player-anime-playing')
      })
    } else {
      isInline && el.classList.remove('player-anime-playing')
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
    const scrollerRect = scroller.getBoundingClientRect()
    const Horizon = scroller.clientHeight // 可视窗口的高度
    const Scrolled = scroller.scrollTop // 已滚动高度
    const Node2Top = getTopDistance(el) - scrollerRect.top // 节点距离滚动容器顶部（指节点的上边界至滚动容器顶部）
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

  /** 立即取消当前滚动事务: 当两个滚动事务同时存在的时候可能会出现相互拉扯的情况，所以要确保同一时间只有一个事务 */
  clearInterval() {
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

  /**
   * 应用原生页面滚动
   * @param el 元素对象
   * @param scrollerRef // 滚动层
   * @param offset // 偏移值
   */
  applyNativeScroll(el, container, scrollerRef, offset) {
    if (!container || !scrollerRef) return console.error('无法获取容器层或滚动层，请检查依赖！')
    const offsetVal = offset || scrollerRef.clientHeight / 3
    const top = getTopDistance(el) - container.offsetTop
    const timeout = setTimeout(() => {
      scrollerRef.scrollTo({ top: top - offsetVal, behavior: 'smooth' })
      clearTimeout(timeout)
    }, 0)
  }

  /** 将片段数据解析成播放所需数据 */
  parseData(data) {
    const course = JSON.parse(JSON.stringify(data)) // 深拷贝
    const { key, audio, duration, promoters, timestamps } = course
    const keyframeSequence = []
    let promoterSequence = []
    // 存在时间戳的情况
    if (timestamps.length > 0 && timestamps.length === promoters.length) {
      promoterSequence = promoters.filter((item, index) => {
        if (item !== null) {
          keyframeSequence.push(timestamps[index])
          return item
        }
      })
    } else {
      const section = duration / promoters.length // 切片时长
      promoterSequence = promoters.filter((item, index) => {
        if (item !== null) {
          keyframeSequence.push(Number((section * index).toFixed(3)))
          return item
        }
      })
    }

    return { key, audio, duration, promoterSequence, keyframeSequence }
  }

  static hiddenElement(el) {
    el.classList.add('player-anime-hidden')
    // console.log('隐藏元素', el)
  }
  
  static showElement(el) {
    el.classList.remove('player-anime-hidden')
    // console.log('显示元素', el)
  }

  destory() {
    // console.log('播放结束 destory')
    this.init()
    this.subs.forEach(sub => sub.unsubscribe())
    this.audioSubs.forEach(sub => sub.unsubscribe())
    this.audioSubs.length = 0
    // 销毁，确保垃圾回收
    if (this.audio) {
      this.audio.src = ''
      this.audio = null
    }

    this._data?.forEach(item => {
      if (item.audio) {
        item.audio.src = ''
      }
    })
    try {
      this._data.length = 0
      this._data = null

      this._sourceData.length = 0
      this._sourceData = null

      this.keyframeHistory.length = 0
      this.keyframeHistory = null

      this.keyframeSequence.length = 0
      this.keyframeSequence = null

      this.subtitleSequence.length = 0
      this.subtitleSequence = null

      this.subtitleKeyframeSequence.length = 0
      this.subtitleKeyframeSequence = null

      this.animeElementSequence.length = 0
      this.animeElementSequence = null
    } catch (error) {
      console.error(error)
    }
  }
}


/**
 * 获取最外层（祖先）元素到顶部的距离（部分组件中的元素offsetTop可能是相对于组件）
 * @param el 目标元素
 * @returns 返回距离
 */
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
  return new Promise(async (resolve, reject) => {
    // console.log('开始加载音频', src)
    const audio = new Audio(src)

    const canplay = fromEvent(audio, 'canplaythrough').subscribe(() => {
      // console.log('音频加载完成')
      un()
      resolve(audio)
    })

    const err = fromEvent(audio, 'error').subscribe(error => {
      console.error('-音频加载失败-', error)
      un()
      reject(error)
    })

    function un() {
      err?.unsubscribe()
      canplay?.unsubscribe()
    }

    audio.load()
  })
}

function createPausableInterval(callback, interval) {
  let timerId = null
  let isPaused = false

  function start() {
    if (!isPaused && timerId === null) {
      timerId = setInterval(callback, interval)
    }
  }

  function pause() {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
      isPaused = true
    }
  }

  function resume() {
    if (isPaused) {
      isPaused = false
      start()
    }
  }

  function stop() {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
    isPaused = false
  }

  start() // Automatically start the interval when created

  return { pause, resume, stop }
}
