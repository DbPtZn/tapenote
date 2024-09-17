
import { Commander, QueryState, FormatValue, Query, Injector } from '@textbus/core'
import { SelectTool, SelectToolConfig } from '../../toolkit/select-tool'
import { I18n, textAlignFormatter } from '@textbus/editor'



export function textAlignToolConfigFactory(injector: Injector): SelectToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  return {
    tooltip: i18n.get('plugins.toolbar.textAlignTool.tooltip'),
    options: [{
      label: i18n.get('plugins.toolbar.textAlignTool.left'),
      iconClasses: ['textbus-icon-paragraph-left'],
      value: 'left',
      keymap: {
        ctrlKey: true,
        key: 'l'
      },
      default: true
    }, {
      label: i18n.get('plugins.toolbar.textAlignTool.right'),
      iconClasses: ['textbus-icon-paragraph-right'],
      value: 'right',
      keymap: {
        ctrlKey: true,
        key: 'r'
      },
    }, {
      label: i18n.get('plugins.toolbar.textAlignTool.center'),
      iconClasses: ['textbus-icon-paragraph-center'],
      value: 'center',
      keymap: {
        ctrlKey: true,
        key: 'e'
      },
    }, {
      label: i18n.get('plugins.toolbar.textAlignTool.justify'),
      iconClasses: ['textbus-icon-paragraph-justify'],
      value: 'justify',
      keymap: {
        ctrlKey: true,
        key: 'j'
      },
    }],
    queryState(): QueryState<FormatValue> {
      return query.queryAttribute(textAlignFormatter)
    },
    onChecked(value: string) {
      commander.applyAttribute(textAlignFormatter, value)
    }
  }
}

export function textAlignTool() {
  return new SelectTool(textAlignToolConfigFactory)
}
