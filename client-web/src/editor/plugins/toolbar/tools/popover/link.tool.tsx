import { Commander, QueryState, Query, Injector, Selection } from '@textbus/core'
import { PopoverTool, PopoverToolConfig } from '../../toolkit'
import { I18n, linkFormatter } from '@textbus/editor'
import LinkForm from './_utils/LinkForm.vue'
import { h, ref } from 'vue'


export function linkToolConfigFactory(injector: Injector): PopoverToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  const selection = injector.get(Selection)
  const hrefRef = ref('')
  return {
    iconClasses: ['textbus-icon-link'],
    tooltip: i18n.get('plugins.toolbar.linkTool.tooltip'),
    views: [
      h(LinkForm, {
        url: () => hrefRef.value,
        onConfirm: res => {
          const { url, target } = res
          const value = {
            href: url,
            target
          }
          if (selection.isCollapsed) {
            const slot = selection.startSlot!
            slot.getFormatRangesByFormatter(linkFormatter, 0, slot.length).filter(f => {
              return f.startIndex < selection.startOffset! && f.endIndex >= selection.endOffset!
            }).forEach(f => {
              slot.retain(f.startIndex)
              slot.retain(f.endIndex - f.startIndex, linkFormatter, value)
            })
          }
          commander.applyFormat(linkFormatter, value)
        }
      })
    ], 
    queryState(): QueryState<any> {
      const result = query.queryFormat(linkFormatter)
      const { value } = result
      if(value) {
        hrefRef.value = value.href
      }
      return result
    },
    useValue(value: any) {
      //
    }
  }
}

export function linkTool() {
  return new PopoverTool(linkToolConfigFactory)
}
