
// const scheduler = (task) => {
//   requestIdleCallback(idle => {
//     task(() => idle.timeRemaining())
//   })
// }

/**
 * 分时函数，用于按分片执行任务数组中的任务
 * @param datas 任务数组，如果传入的是一个数字，则会创建一个从0到该数字的数组
 * @param taskHandler 任务处理器，一个接受单个任务并执行相应操作的函数
 * @param scheduler 分片调度器，一个接受一个回调函数作为参数的函数，用于控制下一分片的执行
 * @returns 无返回值
 */
export function performChunk<T>(datas: T[], taskHandler: (data: T) => void, scheduler: (task: (goOn: () => boolean) => void) => void) {
  // 如果datas是一个数字，则生成一个从0到该数字的数组
  if (typeof datas === 'number') {
    datas = Array.from({ length: datas }, (_, i) => i) as T[]
  }
  // 如果任务数组为空，则直接返回
  if (datas.length === 0) {
    return
  }
  
  let i = 0

  // 开启下一个分片的执行
  function _run() {
    // 如果已经处理完所有任务，则直接返回
    if (i >= datas.length) {
      return
    }
    
    // 调度器函数，根据分片调度器的控制来执行任务
    scheduler((goOn: () => any) => {
      // 在goOn()返回true且还有任务未处理的情况下，持续执行任务处理器
      while (goOn() && i < datas.length) {
        taskHandler(datas[i])
        i++
      }
      // 所有任务处理完毕后，再次调用_run函数，开始下一分片的执行
      _run()
    })
  }
  // 开始执行第一个分片
  _run()
}

/**
 * 在浏览器环境中处理数据块
 * 该函数使用requestIdleCallback来安排任务，在浏览器空闲时执行任务处理
 * 
 * @param datas - 待处理的数据数组
 * @param taskHandler - 用于处理每个数据的函数
 */
export function browserPerformChunk<T>(datas: T[], taskHandler: (data: T) => void) {
  // 定义一个调度器函数，用于将任务安排在浏览器空闲时执行
  const scheduler = (task) => {
    requestIdleCallback(idle => {
      // 执行任务，并允许其在浏览器空闲时运行
      task(() => idle.timeRemaining())
    })
  }
  // 调用performChunk函数，传入数据数组、任务处理器和调度器
  performChunk(datas, taskHandler, scheduler)
}


/**
 * 模拟环境中使用 setTimeout 来分时处理数据块（非浏览器环境）
 * @param datas - 待处理的数据数组
 * @param taskHandler - 用于处理每个数据的函数
 */
export function timeoutPerformChunk<T>(datas: T[], taskHandler: (data: T) => void, delay = 100) {
  const scheduler = (task) => {
    setTimeout(() => {
      task(() => true)
    }, delay)
  }

  performChunk(datas, taskHandler, scheduler)
}