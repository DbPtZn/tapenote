import { Commander, QueryState, FormatValue, Query, Injector } from '@textbus/core'
import { SelectTool, SelectToolConfig } from '../../toolkit/select-tool'
import { SelectOptionConfig } from '../../toolkit/_utils/UISelect.vue'
import { I18n, fontFamilyFormatter } from '@textbus/editor'

export const isSupportFont = (function () {
  const fullbackFontName = 'Arial'
  const text = 'HeRe-is*SoMe%tEst +99.? !@ #~ &^teXtWw L$VEY$U0'
  const fontSize = 20
  const width = 200
  const height = 50
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  canvas.width = width
  canvas.height = height
  context.textAlign = 'center'
  context.fillStyle = 'black'
  context.textBaseline = 'middle'

  function checker(fontName: string) {
    context.clearRect(0, 0, width, height)
    context.font = fontSize + 'px ' + fontName + ', ' + fullbackFontName
    context.fillText(text, width / 2, height / 2)
    const data: Uint8ClampedArray = context.getImageData(0, 0, width, height).data
    return Array.from(data).filter(n => n !== 0)
  }

  return function (fontName: string) {
    if (fontName.toLowerCase() === fullbackFontName.toLowerCase()) {
      return true
    }
    return checker(fullbackFontName).join('') !== checker(fontName).join('')
  }
})()

export function fontFamilyToolConfigFactory(injector: Injector): SelectToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)

  return {
    tooltip: i18n.get('plugins.toolbar.fontFamilyTool.tooltip'),
    options: ([{
      label: i18n.get('plugins.toolbar.fontFamilyTool.defaultFamilyText'),
      classes: ['textbus-toolbar-font-family-inherit'],
      value: '',
      default: true
    }, {
      label: '宋体',
      classes: ['textbus-toolbar-font-family-SimSun'],
      value: 'SimSun, STSong'
    }, {
      label: '黑体',
      classes: ['textbus-toolbar-font-family-SimHei'],
      value: 'SimHei, STHeiti'
    }, {
      label: '微软雅黑',
      classes: ['textbus-toolbar-font-family-Microsoft-YaHei'],
      value: 'Microsoft YaHei'
    }, {
      label: '楷体',
      classes: ['textbus-toolbar-font-family-KaiTi'],
      value: 'KaiTi, STKaiti'
    }, {
      label: '仿宋',
      classes: ['textbus-toolbar-font-family-FangSong'],
      value: 'FangSong, STFangsong',
    }, {
      label: '冬青黑简体中文',
      classes: ['textbus-toolbar-font-family-DongQingHei'],
      value: '"Hiragino Sans GB", 冬青黑简体中文'
    }, {
      label: '苹方',
      classes: ['textbus-toolbar-font-family-PingFang'],
      value: '"PingFang SC", 苹方'
    }, {
      label: '隶书',
      classes: ['textbus-toolbar-font-family-SimLi'],
      value: 'SimLi'
    }, {
      label: 'Andale Mono',
      classes: ['textbus-toolbar-font-family-andale-mono'],
      value: 'Andale Mono'
    }, {
      label: 'Arial',
      classes: ['textbus-toolbar-font-family-Arial'],
      value: 'Arial'
    }, {
      label: 'Helvetica',
      classes: ['textbus-toolbar-font-family-Helvetica'],
      value: 'Helvetica'
    }, {
      label: 'Impact',
      classes: ['textbus-toolbar-font-family-Impact'],
      value: 'Impact'
    }, {
      label: 'Times New Roman',
      classes: ['textbus-toolbar-font-family-Times-New-Roman'],
      value: 'Times New Roman'
    }] as SelectOptionConfig[]).map(i => {
      if (i.value && typeof i.value === 'string') {
        if (!i.value.split(',').map(i => isSupportFont(i.trim())).some(v => v)) {
          i.disabled = true
        }
      }
      return i
    }),
    queryState(): QueryState<FormatValue> {
      return query.queryFormat(fontFamilyFormatter)
    },
    onChecked(value: string) {
      value ? commander.applyFormat(fontFamilyFormatter, value) : commander.unApplyFormat(fontFamilyFormatter)
    }
  }
}

export function fontFamilyTool() {
  return new SelectTool(fontFamilyToolConfigFactory)
}
