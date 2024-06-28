// TODO 颜色出了 RGB 、 16进制 还有其它类型，这里并不完备，有待完善。
export function rgbaToHex(rgba: string) {
  // 提取RGB和alpha值
  const match = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/)
  if (!match) {
    return rgba
  }

  const [, r, g, b, a] = match

  // 将RGB值转换为十六进制
  const toHex = c => {
    const hex = parseInt(c, 10).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`

  // 将alpha值转换为十六进制
  const hexAlpha = a ? Math.round(parseFloat(a) * 255).toString(16) : ''

  const hexWithAlpha = hexColor + hexAlpha
  return hexWithAlpha.toLocaleUpperCase()
}
