/**
 * 基于所有窗口之和等于 100 这个规则，计算并获取被动容器的尺寸值（宽或高）
 * @param currentState 当前层级所有容器的尺寸（宽或高）数据
 * @param affected 被动容器的下标
 * @returns 被动容器的尺寸（宽或高）
 */
export function getBeAffectedObjValue(currentState: number[], affected: number) {
  let sum = 0
  for (let i = 0; i < currentState.length; i++) {
    if (i !== affected) {
      sum += currentState[i]
    }
  }
  return 100 - sum
}
