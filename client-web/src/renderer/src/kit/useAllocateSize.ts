import { Ref } from 'vue'
import { FractalContainerConfig } from '../type'
// import CircularJSON from 'circular-json'
import * as flatted from 'flatted'
/** 分配容器尺寸 */
export function useAllocateSize(propsData: FractalContainerConfig, wrapper: Ref<HTMLElement> | undefined) {
  // 重新赋值，这样不会修改原数据
  const data = flatted.parse(flatted.stringify(propsData)) as FractalContainerConfig
  
  const isRow = data.isRow
  // 获取全局宽高
  const globalHeight = wrapper?.value.clientHeight || window.innerHeight
  const globalWidth = wrapper?.value.clientWidth || window.innerWidth
  // 将固定值px转化成百分比
  data.children.forEach((childNode, index, arr) => {
    if (typeof childNode.ratio === 'string') {
      if (childNode.ratio.slice(-2) === 'px') {
        const val = parseInt(childNode.ratio) / (isRow ? globalWidth : globalHeight) * 100
        arr[index].ratio = val
      }
    }
    if (typeof childNode.min === 'string') {
      if (childNode.min.slice(-2) === 'px') {
        const val = parseInt(childNode.min)   / (isRow ? globalWidth : globalHeight) * 100
        arr[index].min = val
      }
    }
  })
  // console.log(data)
  const childNodeAmount = data.children.length // 节点个数
  const primaryTarget: number[] = new Array(childNodeAmount)
  const secondaryTarget: number[] = new Array(childNodeAmount)
  const minValDistribute: Array<number> = new Array(childNodeAmount)
  let sum = 0
  let unabsorbed = 0
  data.children.forEach((childNode, index) => {
    // 如果宽度值已分配
    if (childNode.ratio || childNode.ratio === 0) {
      sum += childNode.ratio as number
      primaryTarget[index] = childNode.ratio as number
    } else {
      unabsorbed++ // 记录未分配容器的数量
    }
    secondaryTarget[index] = 100 // 水平分布高度默认百分百
  })
  if (sum > 100) {
    // eslint-disable-next-line prettier/prettier
    console.warn('警告：同层级的容器分配的总和溢出 100 %，系统会重新按比例分配，但这可能会导致结果脱离预期！')
    // 分配宽度超出 100%，按比例重新分配
    data.children.forEach((childNode, index) => {
      // 如果分配了宽度值
      if (childNode.ratio || childNode.ratio === 0) {
        // console.log(childNode.ratio)
        primaryTarget[index] = childNode.ratio as number * (100 / sum)
        // console.log(primaryTarget[index])
      }
    })
    sum = 100 // 分配超出 100 时，重置为 100
  } else if (sum < 100 && unabsorbed === 0) {
    // eslint-disable-next-line prettier/prettier
    console.warn('警告：同层级的所有容器分配的总和不足 100 %，系统会重新按比例分配，但这可能会导致结果脱离预期！')
    // 分配宽度不足 100%，按比例重新分配
    data.children.forEach((childNode, index) => {
      // 如果分配了宽度值
      if (childNode.ratio || childNode.ratio === 0) {
        primaryTarget[index] = childNode.ratio as number * (100 / sum)
      }
    })
    // 此处 return 因为重构后到了函数体内，return 会跳出函数执行导致错误。删除即可。
    // return // 这种情况没有剩余待分配容器，直接跳出
  }
  // 存在待分配节点且未分配空间大于 0 时
  if (unabsorbed && 100 - sum > 0) {
    const otherNodesValue = (100 - sum) / unabsorbed // 剩余未分配的空间 / 未分配容器的数量 = 剩余每个容器应分配的量
    for (let i = 0; i < primaryTarget.length; i++) {
      if (!primaryTarget[i] && primaryTarget[i] !== 0) {
        primaryTarget[i] = otherNodesValue
      }
    }
  }
  /** 当最小限值大于当前分配的比值时，发出警告 */
  primaryTarget.forEach((ratio, index) => {
    minValDistribute[index] = data.children[index].min as number || 0 // 分配最小限制
    if (minValDistribute[index] || minValDistribute[index] === 0) {
      if (minValDistribute[index] > ratio) {
        console.warn('警告: 最小比例大于默认比例，可能会出现布局问题！')
      }
    }
  })
  // console.log(primaryTarget)
  const widthDistributeData = isRow ? primaryTarget : secondaryTarget
  const heightDistributeData = !isRow ? primaryTarget : secondaryTarget
  const minValDistributeData = minValDistribute
  // console.log(heightDistributeData)
  return {
    widthDistributeData,
    heightDistributeData,
    minValDistributeData
  }
}

// /** 分配容器尺寸 */
// function allocateContainerSize(
//   data: FractalContainerConfig,
//   primaryTarget: number[],
//   secondaryTarget: number[],
//   minValDistribute: Array<number>,
//   isRow: boolean
// ) {
//   let sum = 0
//   let unabsorbed = 0
//   data.children.forEach((childNode, index) => {
//     // 如果宽度值已分配
//     if (childNode.ratio || childNode.ratio === 0) {
//       sum += childNode.ratio
//       primaryTarget[index] = childNode.ratio
//     } else {
//       unabsorbed++ // 记录未分配容器的数量
//     }
//     secondaryTarget[index] = 100 // 水平分布高度默认百分百
//   })
//   if (sum > 100) {
//     // eslint-disable-next-line prettier/prettier
//     console.warn('警告：同层级的容器分配的总和溢出 100 %，系统会重新按比例分配，但这可能会导致结果脱离预期！')
//     // 分配宽度超出 100%，按比例重新分配
//     data.children.forEach((childNode, index) => {
//       // 如果分配了宽度值
//       if (childNode.ratio || childNode.ratio === 0) {
//         primaryTarget[index] = childNode.ratio * (100 / sum)
//       }
//     })
//     sum = 100 // 分配超出 100 时，重置为 100
//   } else if (sum < 100 && unabsorbed === 0) {
//     // eslint-disable-next-line prettier/prettier
//     console.warn('警告：同层级的所有容器分配的总和不足 100 %，系统会重新按比例分配，但这可能会导致结果脱离预期！')
//     // 分配宽度不足 100%，按比例重新分配
//     data.children.forEach((childNode, index) => {
//       // 如果分配了宽度值
//       if (childNode.ratio || childNode.ratio === 0) {
//         primaryTarget[index] = childNode.ratio * (100 / sum)
//       }
//     })
//     return // 这种情况没有剩余待分配容器，直接跳出
//   }
//   const otherNodesValue = (100 - sum) / unabsorbed // 剩余未分配的空间 / 未分配容器的数量 = 剩余每个容器应分配的量
//   for (let i = 0; i < primaryTarget.length; i++) {
//     if (!primaryTarget[i] && primaryTarget[i] !== 0) {
//       primaryTarget[i] = otherNodesValue
//     }
//   }
//   /** 当最小限值大于当前分配的比值时，发出警告 */
//   primaryTarget.forEach((ratio, index) => {
//     minValDistribute[index] = data.children[index].min || 0 // 分配最小限制
//     if (minValDistribute[index] || minValDistribute[index] === 0) {
//       if (minValDistribute[index] > ratio) {
//         console.warn('警告: 最小比例大于默认比例，可能会出现布局问题！')
//       }
//     }
//   })
// }
