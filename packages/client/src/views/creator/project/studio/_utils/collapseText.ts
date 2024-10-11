/** 折叠转写文本的函数 */
export function collapseText(transcript: string[]) {
  const head = transcript.slice(0, 6)
  const tail = transcript.slice(-4)
  return [...head, '...', ...tail]
}