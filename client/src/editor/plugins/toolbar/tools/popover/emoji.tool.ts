// import { boldFormatter, colorFormatter } from '../../../../formatters/_api'
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector, Observable, Subject } from '@textbus/core'
import { ButtonTool, ButtonToolConfig, PopoverTool, PopoverToolConfig } from '../../toolkit'
// import { MaterialTypeEnum } from '../../../../enum'
// import { zh_CN } from '../../../../i18n/_api'
// import { I18n, imageComponent } from '@/editor'
import { h } from 'vue'
import EmojiForm from './_utils/EmojiForm.vue'
import { I18n } from '@textbus/editor'

export function emojiToolConfigFactory(injector: Injector): PopoverToolConfig {
  const i18n = injector.get(I18n)
  const commander = injector.get(Commander)
  return {
    iconClasses: ['textbus-icon-emoji'],
    tooltip: i18n.get('plugins.toolbar.emojiTool.tooltip'),
    view: h(EmojiForm, {
      onConfirm: (value: string) => {
        commander.insert(value)
      }
    }),
    queryState(): QueryState<any> {
      return {
        state: QueryStateType.Normal,
        value: null
      }
    },
    useValue(value: string) {
      // commander.insert(value)
    }
  }
}

export function emojiTool() {
  return new PopoverTool(emojiToolConfigFactory)
}
