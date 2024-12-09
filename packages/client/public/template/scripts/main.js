
function getData() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'metadata.json'
    script.type = 'text/javascript'
    script.onload = function () {
      // console.log('data load') 
      // console.log(metadata) // data变量应该在JSON文件中定义
      resolve(metadata)
    }
    document.head.appendChild(script)
  })
}
document.addEventListener("DOMContentLoaded", async function () {

  const data = await getData()
  data.audio = 'audio.ogg'
  // console.log(data)

  // 填入数据
  document.querySelector('title').innerHTML = data.title || ''
  document.getElementById('player_title').innerHTML = data.title || ''
  document.getElementById('player_content').innerHTML = data.content || ''
  document.getElementById('info_penname').innerHTML = data.penname || ''
  document.getElementById('info_blog').innerHTML = data.blog || ''
  document.getElementById('info_email').innerHTML = data.email || ''
  document.getElementById('info_version').innerHTML = data.version || ''
  document.getElementById('info_type').innerHTML = data.type || ''
  document.getElementById('info_wordage').innerHTML = data.wordage || 0
  document.getElementById('info_duration').innerHTML = data.duration || 0
  document.getElementById('info_msg').innerHTML = data.msg || ''

  const scroller = document.getElementById('scroller')
  const playerRef = document.getElementById('player')
  const outline = document.getElementById('outline')

  const headings = playerRef.querySelectorAll('h1, h2, h3, h4, h5, h6')

  const hasHeadings = headings.length > 0

  const list = document.createElement('ul')
  outline.appendChild(list)


  let previousLevel = 0
  let lastItem = list


  headings.forEach(function (heading, index) {
    const level = parseInt(heading.tagName[1]);
    const listItem = document.createElement('li');
    listItem.className = [`outline-heading-h${level}`, 'outline-item'].join(' ')
    const link = document.createElement('a');
    link.textContent = heading.textContent;
    const id = 'section-' + index;
    heading.setAttribute('id', id);
    link.href = '#' + id;
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = this.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
    listItem.appendChild(link);

    if (level > previousLevel) {
      // Increase nesting
      console.log(listItem.textContent)
      const sublist = document.createElement('div');
      if (lastItem) {
        lastItem.appendChild(sublist);
      } else {
        list.appendChild(sublist); // 如果 lastItem 为 null，添加到根列表
      }
      lastItem = sublist; // Update lastItem to the sublist
      lastItem.appendChild(listItem);
    } else if (level < previousLevel) {
      // Decrease nesting
      let tempLastItem = lastItem;
      while (tempLastItem && getLevel(tempLastItem) >= level) {
        tempLastItem = tempLastItem.parentElement;
      }
      if (tempLastItem) {
        tempLastItem.parentElement?.insertBefore(listItem, tempLastItem.nextSibling);
      } else {
        list.appendChild(listItem); // 如果没有找到合适的父元素，添加到根列表
      }
      lastItem = listItem;
    } else {
      // Same level
      if (lastItem) {
        lastItem.parentElement?.insertBefore(listItem, lastItem.nextSibling);
      } else {
        list.appendChild(listItem); // 如果 lastItem 为 null，添加到根列表
      }
      lastItem = listItem;
    }
    // lastItem = listItem;
    previousLevel = level;
  });

  function getLevel(element) {
    if (!element) return 0;
    const tagName = element.tagName;
    return tagName ? parseInt(tagName[1], 10) : 0;
  }

  // Function to determine which heading is currently active based on scroll position
  function setActiveLink() {
    var scrollPosition = window.scrollY || window.pageYOffset
    headings.forEach(function (heading) {
      var rect = heading.getBoundingClientRect()
      if (rect.top > -10 && rect.top <= 100) { // 大于 -10 可以确保通过目录回滚时能激活对应的目录项
        var id = heading.getAttribute('id')
        var link = document.querySelector('a[href="#' + id + '"]')
        if (link) {
          // Remove active class from all links
          var links = document.querySelectorAll('#outline a')
          links.forEach(function (link) {
            link.classList.remove('active-link')
          });
          // Add active class to the corresponding link
          link.classList.add('active-link')
        }
      }
    });
  }

  // Listen for scroll events and update active link accordingly
  hasHeadings && scroller.addEventListener('scroll', setActiveLink);

  // Initial call to set active link on page load
  hasHeadings && setActiveLink();

  // 主题切换
  const screenControl = document.getElementById('screen-control')
  const wideScreen = document.getElementById('wide-screen')
  const narrowScreen = document.getElementById('narrow-screen')
  const wrapper = document.getElementById('player-wrapper')
  wrapper.style.width = '880px'
  wideScreen.style.display = 'none'
  narrowScreen.style.display = 'block'
  screenControl.addEventListener('click', function () {
    if (wrapper.style.width === '880px') {
      wrapper.style.width = '80%'
      wideScreen.style.display = 'block'
      narrowScreen.style.display = 'none'
    } else {
      wrapper.style.width = '880px'
      wideScreen.style.display = 'none'
      narrowScreen.style.display = 'block'
    }
  })


  // 主题切换
  const themeControl = document.getElementById('theme-control')
  const darkMode = document.getElementById('dark-mode')
  const lightMode = document.getElementById('light-mode')
  darkMode.style.display = 'none'
  lightMode.style.display = 'block'
  themeControl.addEventListener('click', function () {
    const theme = document.body.getAttribute('data-theme')
    if (theme === 'dark-theme') {
      document.body.setAttribute('data-theme', 'light-theme')
      darkMode.style.display = 'block'
      lightMode.style.display = 'none'
    } else {
      document.body.setAttribute('data-theme', 'dark-theme')
      darkMode.style.display = 'none'
      lightMode.style.display = 'block'
    }
  })

  // 大纲视图开关
  const outlineControl = document.getElementById('outline-control')
  const closeOutline = document.getElementById('close-outline')
  const openOutline = document.getElementById('open-outline')
  outlineControl.addEventListener('click', function () {
    if (outline.classList.contains('outline-show')) {
      // outline.style.display = 'none'
      outline.classList.remove(['outline-show'])
    } else {
      // outline.style.display = 'flex'
      outline.classList.add(['outline-show'])
    }
  })
  closeOutline.addEventListener('click', function () {
    outline.classList.remove(['outline-show'])
  })
  openOutline.addEventListener('click', function () {
    outline.classList.add(['outline-show'])
  })

  // 控制器和导航切换
  const nav = document.getElementById('nav')
  const toNav = document.getElementById('to-nav')
  const controller = document.getElementById('controller')
  const toControl = document.getElementById('to-control')
  if (data.type === 'note') {
    // 如果是笔记项目，则不显示控制器
    toControl.style.display = 'none'
    controller.style.display = 'none'
    nav.style.display = 'block'
  } else {
    controller.style.display = 'block'
    nav.style.display = 'none'
  }
  toControl.addEventListener('click', function () {
    nav.style.display = 'none'
    controller.style.display = 'block'
  })
  toNav.addEventListener('click', function () {
    nav.style.display = 'block'
    controller.style.display = 'none'
  })

  // 导航栏显示/隐藏
  const rightside = document.getElementById('rightside')
  fromEvent(window, 'mousemove').subscribe(ev => {
    const offset = rightside.clientWidth
    const width = document.body.clientWidth
    if (ev.clientX > width - offset) {
      nav.classList.add('show')
      controller.classList.add('show')
    } else {
      nav.classList.remove('show')
      controller.classList.remove('show')
    }
  })




  /** 控制器 */
  const setSubtitle = document.getElementById('set-subtitle')
  const speedDown = document.getElementById('speed-down')
  const speedUp = document.getElementById('speed-up')
  const play = document.getElementById('play')
  const forward = document.getElementById('forward')
  const rewind = document.getElementById('rewind')
  const stop = document.getElementById('stop')
  const pause = document.getElementById('pause')
  const start = document.getElementById('start')

  const openSubtitle = document.getElementById('open-subtitle')
  const closeSubtitle = document.getElementById('close-subtitle')
  let isSubtitle = true
  openSubtitle.style.display = isSubtitle ? 'block' : 'none'
  closeSubtitle.style.display = isSubtitle ? 'none' : 'block'
  setSubtitle.addEventListener('click', function () {
    if (openSubtitle.style.display === 'block') {
      openSubtitle.style.display = 'none'
      closeSubtitle.style.display = 'block'
      isSubtitle = false
    } else {
      openSubtitle.style.display = 'block'
      closeSubtitle.style.display = 'none'
      isSubtitle = true
    }
  })

  start.style.display = 'block'
  pause.style.display = 'none'

  stop.style.opacity = 0.5
  stop.style.cursor = 'not-allowed'
  const body = document.body
  const player = new Player(scroller, body)

  /** 载入动画数据 */
  let animeList
  await player.loadData([data]).then(parseData => {
    // console.log(parseData)
    // console.log(...parseData[0].animeElementSequence[0])
    animeList = parseData[0].animeElementSequence.map((item, index) => {
      return {
        nodes: [...item],
        keyframe: parseData[0].keyframeSequence[index]
      }
    })
  })

  /** 快捷方式 */
  const shortcut = []
  /** 播放控制 */
  play.addEventListener('click', function () {
    if (!player.isPlaying && !player.isPause) {
      player.start()
      shortcut.push(
        fromEvent(playerRef, 'dblclick').subscribe(ev => {
          if (player.isPlaying && !player.isPause) {
            player.pause()
            createMessage('暂停')
            return
          }
          if (!player.isPlaying && player.isPause) {
            player.resume()
            createMessage('继续')
            return
          }
        })
      )
      return
    }
    if (player.isPlaying && !player.isPause) {
      player.pause()
      return
    }
    if (!player.isPlaying && player.isPause) {
      player.resume()
      return
    }
  })
  stop.addEventListener('click', function () {
    if (!player.isPlaying && !player.isPause) return
    player.stop()
  })
  speedDown.addEventListener('click', function () {
    player.speedDown()
    createMessage(`当前播放速度：${player.rate.toFixed(1)}x`)
  })
  speedUp.addEventListener('click', function () {
    player.speedUp()
    createMessage(`当前播放速度：${player.rate.toFixed(1)}x`)
  })
  forward.addEventListener('click', function () {
    player.forward()
  })
  rewind.addEventListener('click', function () {
    player.rewind()
  })


  player.onStateUpdate.subscribe(() => {
    if (player.isPlaying) {
      start.style.display = 'none'
      pause.style.display = 'block'
      stop.style.opacity = 1
      stop.style.cursor = 'pointer'
    } else {
      start.style.display = 'block'
      pause.style.display = 'none'
    }
  })

  player.onPlayOver.subscribe(() => {
    stop.style.opacity = 0.5
    stop.style.cursor = 'not-allowed'
    subtitle.style.display = 'none'
    shortcut.forEach(item => item.unsubscribe())
    timerSub.forEach(item => item.unsubscribe())
  })

  const subtitle = document.getElementById('subtitle')
  subtitle.style.display = 'none'
  player.onSubtitleUpdate.subscribe(txt => {
    // console.log(txt)
    subtitle.style.display = isSubtitle ? 'block' : 'none'
    subtitle.innerHTML = txt
  })

  const timer = document.getElementById('timer')
  const closeTimer = document.getElementById('close-timer')
  const openTimer = document.getElementById('open-timer')
  const timeline = document.getElementById('timeline')
  closeTimer.style.display = 'block'
  openTimer.style.display = 'none'
  timeline.style.display = 'none'
  timer.addEventListener('click', function () {
    if (openTimer.style.display === 'block') {
      closeTimer.style.display = 'block'
      openTimer.style.display = 'none'
      timeline.style.display = 'none'
    } else {
      closeTimer.style.display = 'none'
      openTimer.style.display = 'block'
      timeline.style.display = 'block'
    }
  })

  const timerSub = []
  player.onStateUpdate.subscribe(state => {
    if (state === 'start') {
      timerSub.push(fromEvent(player.audio, 'timeupdate').subscribe(() => {
        // 获取当前播放时间
        const currentTime = player.currentTime
        // console.log("当前播放时间：" + currentTime + " 秒");
        timeline.innerHTML = durationFormat(currentTime)
      }))
    }
    if (state === 'stop') {
      timeline.innerHTML = durationFormat(0)
      timerSub.forEach(item => item.unsubscribe())
    }
  })


  const location = document.getElementById('location')
  const closeLocation = document.getElementById('close-location')
  const openLocation = document.getElementById('open-location')
  closeLocation.style.display = 'block'
  openLocation.style.display = 'none'
  fromEvent(location, 'click').subscribe(ev => {
    if (player.isPlaying || player.isPause) {
      createMessage('播放过程中不能使用该功能')
      return
    }
    if (closeLocation.style.display === 'none') {
      closeAnimeLocation()
    } else {
      openAnimeLocation()
    }
  })
  player.onStateUpdate.subscribe(state => {
    if (state === 'startHere' || state === 'start') {
      closeAnimeLocation()
    }
  })
  const aniemLocationSub = []
  function openAnimeLocation() {
    closeLocation.style.display = 'none'
    openLocation.style.display = 'block'
    playerRef.classList.add('show-anime')
    animeList.forEach((item, index) => {
      const { nodes, keyframe } = item
      nodes.forEach(node => {
        aniemLocationSub.push(
          fromEvent(node, 'dblclick').subscribe(ev => {
            // console.log(keyframe)
            player.startHere(keyframe, index)
          })
        )
      })
    })
  }

  function closeAnimeLocation() {
    closeLocation.style.display = 'block'
    openLocation.style.display = 'none'
    playerRef.classList.remove('show-anime')
    aniemLocationSub.forEach(item => item.unsubscribe())
  }

  /** 对话框 */
  const mark = document.getElementById('mark')
  const dialog = document.getElementById("dialog")
  const dialogClose = document.getElementById("dialog-close")
  const infoControl = document.getElementById('info-control')
  fromEvent(infoControl, 'click').subscribe(ev => {
    dialog.show()
    anime({
      targets: dialog,
      opacity: [0, 1],
      top: ['80%', '50%'],
      duration: 500
    })
    mark.style.display = 'block'
  })

  fromEvent(mark, 'click').subscribe(ev => {
    dialog.close()
    mark.style.display = 'none'
  })

  fromEvent(dialogClose, 'click').subscribe(ev => {
    dialog.close()
    mark.style.display = 'none'
  })


  const msgBox = document.getElementById('msg-box')
  /** 消息 */
  function createMessage(txt) {
    const message = document.createElement('div')
    message.classList.add('message')
    message.textContent = txt
    msgBox.appendChild(message)
    anime({
      targets: message,
      scale: [0, 1],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: 200
    })
    setTimeout(() => {
      anime({
        targets: message,
        translateY: ['0%', '-50%'],
        opacity: [1, 0],
        easing: 'easeOutQuad',
        duration: 2000
      }).finished.then(() => {
        msgBox.removeChild(message)
      })
    }, 1000);
  }




})


/** 将音频时长（duration）转化成 HH:MM:SS 格式 */
function durationFormat(duration) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${hours ? formattedHours + ':' : ''}${formattedMinutes}:${formattedSeconds}`;
}