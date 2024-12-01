import { Commander, QueryState, FormatValue, Query, Selection, QueryStateType, Injector, Slot, ContentType } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, codeFormatter } from '@textbus/editor'
import { codeComponent } from '../../../../components/code.component'

export function codeToolConfigFactory(injector: Injector): ButtonToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  const selection = injector.get(Selection)
  return {
    iconClasses: ['textbus-icon-code'],
    tooltip: i18n.get('plugins.toolbar.codeTool.tooltip'),
    keymap: {
      key: ';',
      ctrlKey: true,
    },
    queryState(): QueryState<FormatValue> {
      return query.queryFormat(codeFormatter)
    },
    onClick() {
      const state = query.queryFormat(codeFormatter)
      const b = state.state === QueryStateType.Enabled
      b ? commander.unApplyFormat(codeFormatter) : commander.applyFormat(codeFormatter, true)
    }
    // 组件实现时采用的逻辑（弃用）
    // queryState(): QueryState<any> {
    //   return query.queryComponent(codeComponent)
    // },
    // onClick() {
    //   const state = query.queryComponent(codeComponent)
    //   if (state.state === QueryStateType.Enabled) {
    //     const current = state.value!
    //     const parent = current.parent!

    //     const index = parent.indexOf(current)

    //     parent.retain(index)

    //     commander.removeComponent(current)

    //     current.slots.get(0)!.sliceContent().forEach(i => {
    //       parent.insert(i)
    //     })
    //   } else {
    //     const commonAncestorSlot = selection.commonAncestorSlot!
    //     if (selection.startSlot === selection.endSlot) {
    //       // console.log('selection.startSlot === selection.endSlot')
    //       if(selection.isCollapsed) {
    //         const slot = new Slot([ContentType.Text])
    //         slot.insert(' ') // 插入一个空字符占位 否则会默认插入一个 br 换行符
    //         const block = codeComponent.createInstance(injector, { slots: [slot] })
    //         commander.insert(block)
    //         selection.setPosition(slot, 0)
    //         return
    //       }
    //       const slot = selection.focusSlot?.cutTo(new Slot([ContentType.Text]), selection.startOffset!, selection.endOffset!)
    //       const block = codeComponent.createInstance(injector, { slots: [slot!] })
    //       commonAncestorSlot.insert(block)

    //     } else {
    //       // code 组件不支持跨组件的插入
    //       // console.log('selection.startSlot !== selection.endSlot')
    //       return
    //     }
    //   }
    // }
  }
}

export function codeTool() {
  return new ButtonTool(codeToolConfigFactory)
}
