import { Injectable } from '@textbus/core'

// const colorOptions = new Map<string, string>([
//   ['#000000', '#ffffff'],
//   ['#FF5A5F', '#FF0000'],
//   ['#FFA500', '#FF8C00'],
//   ['#FFD700', '#FFFF00'],
//   ['#008000', '#008000'],
//   ['#00CED1', '#00FFFF'],
//   ['#007FFF', '#0000FF'],
//   ['#8A2BE2', '#8B008B']
// ])

@Injectable()
export class ColorProvider {
  private colorOptions: Map<string, string>
  constructor() {
    // console.log(colorOptions.keys())
    this.colorOptions = new Map<string, string>([
      ['#000000', '#ffffff'],
      ['#FF5A5F', '#FF0000'],
      ['#FFA500', '#FF8C00'],
      ['#FFD700', '#FFFF00'],
      ['#008000', '#008000'],
      ['#00CED1', '#00FFFF'],
      ['#007FFF', '#0000FF'],
      ['#8A2BE2', '#8B008B']
    ])
  }
  getColorOptions() {
    const options: string[] = []
    for (const key of this.colorOptions.keys()) {
      options.push(key)
    }
    return options
  }

  destory() {
    // console.log('color provider destory')
    this.colorOptions.clear()
  }
}
