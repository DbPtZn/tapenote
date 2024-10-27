export const emojis: string[] = []
for (let i = 0x1F600; i <= 0x1F64F; i++) {
  emojis.push(i.toString(16).toUpperCase())
}
export function createEmoji(item: string) {
  return `&#x${item};`
}