export function splitText(text: string, maxLength = 48): string[] {
  // 定义常见的中文标点符号 punctuations
  const quotesRegExp = /["”’']/
  const primaryRegExp = /[.?!;。？！；]/ // ['。', '？', '！', '；', '.', '?', '!', ';']
  const secondaryRegExp = /[,，]/  // ['，', '、', ',', '、']
  // 如果文本长度小于等于最大长度，直接返回 （不能直接返回字符串文本，因为会被 for let...of 解析为单字符数组）
  if (text.length <= maxLength) return [text]

  // 用于存储分割后的文本数组
  const segments: string[] = [] // 分割后的文本数组

  let residue = text // 剩余文本
  while (residue.length > maxLength) {
    console.log('residue:' + residue)
    const [front, rear] = splitStringAtPosition(residue, maxLength)

    if (primaryRegExp.test(front)) {
      console.log('front:' + front)
      let index = findFirstSentenceBoundaryFromEnd(front, primaryRegExp)
      if(quotesRegExp.test(residue[index + 1])) {
        console.log('include quote')
        index = index + 1
      }
      const [newFront, newRear] =  splitStringAtPosition(residue, index+1)
      segments.push(newFront)
      residue = newRear
    } else if (secondaryRegExp.test(front)) {
      console.log('转次要标点符号')
      console.log('front:' + front)
      let index = findFirstSentenceBoundaryFromEnd(front, secondaryRegExp)
      if(quotesRegExp.test(residue[index + 1])) {
        console.log('include quote')
        index = index + 1
      }
      const [newFront, newRear] =  splitStringAtPosition(residue, index+1)
      segments.push(newFront)
      residue = newRear
    } else {
      break
    }
    if(residue.length <= maxLength) {
      console.log('end residue:' + residue)
       // 如果剩余的字符不超过 24, 则直接与最后一段进行合并
      if(residue.length < 24) {
        segments[segments.length - 1] = segments[segments.length - 1] + residue
      } else {
        segments.push(residue)
      }
      break
    }
  }
  if (segments.length === 0) segments.push(residue)
  return segments
}

/** 将字符串从指定位置分割成两部分 */
function splitStringAtPosition(str: string, position: number) {
  if (position < 0 || position > str.length) {
    throw new Error('Position is out of the string bounds.')
  }
  return [str.slice(0, position), str.slice(position)]
}

/** 从尾部查询断句符号 */
function findFirstSentenceBoundaryFromEnd(text: string, boundaryRegex: RegExp) {
  for (let i = text.length - 1; i >= 0; i--) {
    if (boundaryRegex.test(text[i])) {
      return i // 返回第一个断句符号的位置
    }
  }
  return -1 // 如果没有找到，返回-1
}


// const txt1 = '原本无比忠诚于犹太教的亚伯拉罕，被好友扬诺苦苦规劝他信基督教，劝到最后，他说要去罗马去一遭，瞻仰一下你所谓天主派遣到世上来的‘代表’，然后再决定是否信仰基督教。后面亚伯拉罕看到了这些“代表”荒淫佚乐的腐败生活，反而坚定的想要加入基督教了。因为尽管教皇、红衣主教、主教、以及教廷里其他主教的生活作风腐败，但是无论谁想推翻他们它可还是屹然不动，倒反而日益发扬光大，这使他认为一定有圣灵在给它做支柱、做基石，所以他认为基督教，的确是比其他的宗教更其正大神圣，因此选择了加入。'
// const result = splitText(txt1)
// console.log(result)




/** 因目前合成模型不能处理英文,暂不考虑 */
/** 对齐: 将中英文文本进行对齐处理，使得中文与英文单词分开 */
function align(text) {
  const textArray = text.split('')
  const resultArray: string[] = []

  let en = ``
  let endPoint = false
  for (let i = 0; i < textArray.length; i++) {
    if (textArray[i].match(/[a-zA-Z]/)) {
      en += textArray[i]
      endPoint = true
    } else {
      if (endPoint) {
        resultArray.push(en)
        en = ''
        endPoint = false
      }
      resultArray.push(textArray[i])
    }
  }
  console.log(textArray)
  console.log(resultArray)
}

// const txt = '这是一段很长的中文text，我们需要将其按照一定的rule进行分割,以便 better 地展示。'
// align(txt)
// const txt1 = '在 Visual Studio Code (VS Code) 中，你可以通过修改用户设置或使用主题来改变光标颜色。'
// align(txt1)

//TODO 考虑是否对英文进行标准化处理,即强制英文单词间隔空格
