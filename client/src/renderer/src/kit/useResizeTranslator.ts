/**
 * 将容器缩放（缩小/放大）问题转化为纯粹的放大问题。
 * 举例： A、B 两容器，拖动分隔条向右移动时，A为主动放大，B为被动缩小；
 * 反之，拖动分隔条向左移动时，B为主动放大，A为被动缩小；
 * 基于这个规则，后续只需要计算哪个容器是主动，哪个容器是被动，在改变尺寸的算法上可以统一成纯粹的加法；
 * 而被动改变的容器不通过拖拽去计算，而是基于所有容器尺寸百分比之和必须等于 100 这个规则去计算被动容器应有的尺寸百分比值。
 * @param value 鼠标移动的距离
 * @param index 滚动条所在容器的下标
 * @param initialVal 开始拖拽时该层级所有容器的尺寸（宽或高）数据
 * @param minValDistribute 当前层级所有容器的限值数据
 * @returns
 */
export function useResizeTranslator(value: number, index: number, initialVal: number[], minValDistribute: number[]) {
  let activeIndex: number // 主动窗口的下标
  let distance: number // 鼠标移动的距离
  let direction: boolean // 记录鼠标移动的模式， true 是向左移动，false 是向右移动
  // 将窗口增大/减小问题 转化为 窗口增大问题
  if (value >= 0) {
    activeIndex = index
    distance = value
    direction = true
  } else {
    activeIndex = index - 1
    distance = -value
    direction = false
  }
  // 限制可拖拽的最大值（拖拽方向上可能有多个容器，这多个容器的限值之和才是当前的可拖拽最大值）
  let max = 0
  if (!direction) {
    for (let i = activeIndex + 1; i < initialVal.length; i++) {
      max += initialVal[i] - minValDistribute[i]
    }
  } else {
    for (let i = activeIndex - 1; i >= 0; i--) {
      max += initialVal[i] - minValDistribute[i]
    }
  }
  if (distance > max) {
    distance = max
  }
  return {
    /** 主动容器的下标 */
    activeIndex,
    /** 鼠标移动的距离 */
    distance,
    /** 鼠标移动的方向 */
    direction
  }
}
