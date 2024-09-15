/**
 * 获取被动窗口对象:
 * @param currentState 当前层级所有容器的尺寸（宽或高）数据
 * @param initialState 开始拖拽时该层级所有容器的尺寸（宽或高）数据
 * @param index 被拖拽分割条所在的容器的下标
 * @param model 拖拽方向 true 是向左移动，false 是向右移动
 * @param limitState 当前层级所有容器的限值数据
 * @returns 应该被动发生尺寸改变的容器的下标
 */
export function getBeAffectedObjIndex(currentState: number[], initialState: number[], index: number, model: boolean, limitState: number[] = []) {
  if (model) {
    do {
      if (index === 1) {
        if (currentState[index - 1] === limitState[index - 1]) {
          // console.log('首端')
          return index - 1
        }
      }
      index--
      if (index < 0) return undefined
      if (currentState[index] > initialState[index]) {
        currentState[index] = initialState[index]
        return index + 1
      }
      if (currentState[index] > limitState[index]) {
        currentState[index] = limitState[index]
        return index
      }
    } while (index >= 0)
  } else {
    do {
      if (index === currentState.length - 2) {
        if (currentState[currentState.length - 1] === limitState[currentState.length - 1]) {
          // console.log('末端')
          return index + 1
        }
      }
      index++
      if (index >= currentState.length) return undefined
      if (currentState[index] > initialState[index]) {
        currentState[index] = initialState[index]
        return index - 1
      }
      if (currentState[index] > limitState[index]) {
        currentState[index] = limitState[index]
        return index
      }
    } while (index < currentState.length)
  }
}
