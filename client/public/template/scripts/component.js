document.addEventListener("DOMContentLoaded", function() {

  /** 动画忽略组件 anime-ignore */
  const animeIgnore = document.querySelectorAll("anime-ignore");
  animeIgnore.forEach(node => {
    const btn = node.querySelector('.anime-ignore-btn')
    fromEvent(btn, 'click').subscribe(e => {
      if (node.classList.contains('anime-ignore-collapse')) {
        node.classList.remove('anime-ignore-collapse')
        // target.parentElement?.classList.add('anime-ignore-expand')
      } else {
        node.classList.add('anime-ignore-collapse')
      }
    })
  })

})