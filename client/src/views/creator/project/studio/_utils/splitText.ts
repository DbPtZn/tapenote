export function splitText(text, maxLength = 32): string[] {
  // // 定义常见的中文标点符号
  // const punctuations = new Set(['。', '？', '！', '，', '、', '；', '；', '：', '（', '）', '《', '》', '「', '」', '『', '』', '【', '】'])

  // // 如果文本长度小于等于最大长度，直接返回
  // if (text.length <= maxLength) {
  //   return [text]
  // }

  // // 用于存储分割后的文本数组
  // const segments = []
  // let currentSegment = ''

  // for (const char of text) {
  //   // 如果当前字符是标点符号，且当前段的字符数加上标点已经超过最大长度，先添加当前段
  //   if (punctuations.has(char) && currentSegment.length + char.length > maxLength) {
  //     segments.push(currentSegment)
  //     currentSegment = char // 将标点符号作为新的一段的开始
  //   } else {
  //     // 将字符添加到当前段
  //     currentSegment += char
  //   }

  //   // 如果当前段已经达到最大长度，且当前字符不是标点符号，则添加当前段并开始新段
  //   if (currentSegment.length >= maxLength && !punctuations.has(char)) {
  //     segments.push(currentSegment)
  //     currentSegment = ''
  //   }
  // }

  // // 确保添加最后一个段
  // if (currentSegment) {
  //   segments.push(currentSegment)
  // }

  // return segments
  return []
}

// 使用示例
// const text = '这是一段很长的中文文本，我们需要将其按照一定的规则进行分割，以便更好地展示。'
// const splitText = splitChineseText(text)
// console.log(splitText)
