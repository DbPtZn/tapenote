import { Commander, QueryState, QueryStateType, Slot, Injector, Selection } from "@textbus/core"
import { PopoverTool, PopoverToolConfig } from "../.."
// import { zh_CN } from '../../../../i18n/_api'
import { h } from "vue"
// import { I18n, createCell, tableComponent } from "@/editor"
import TableForm from './_utils/TableForm.vue'
import { I18n, createCell, tableComponent } from "@textbus/editor"

export function tableAddToolConfigFactory(injector: Injector): PopoverToolConfig {
  const i18n = injector.get(I18n)
  const commander = injector.get(Commander)
  const selection = injector.get(Selection)
  // const childI18n = zh_CN.plugins.toolbar.tableAddTool.view
  // const form = new Form({
  //   mini: true,
  //   confirmBtnText: childI18n.get('confirmBtnText'),
  //   items: [
  //     new FormNumber({
  //       name: 'rows',
  //       label: childI18n.get('rowLabel'),
  //       placeholder: childI18n.get('rowPlaceholder')
  //     }),
  //     new FormNumber({
  //       name: 'cols',
  //       label: childI18n.get('columnLabel'),
  //       placeholder: childI18n.get('columnPlaceholder')
  //     }),
  //     new FormSwitch({
  //       label: childI18n.get('useTextbusStyleLabel'),
  //       name: 'useTextbusStyle',
  //       checked: true
  //     })
  //   ]
  // })

  // const quickSelector = document.createElement('div')
  // quickSelector.classList.add('textbus-toolbar-table-quick-selector')
  // const map = new Map<HTMLElement, { row: number, col: number }>()
  // for (let row = 0; row < 10; row++) {
  //   for (let col = 0; col < 10; col++) {
  //     ((row: number, col: number) => {
  //       const cell = document.createElement('div')
  //       quickSelector.appendChild(cell)
  //       map.set(cell, {
  //         row,
  //         col
  //       })
  //     })(row, col)
  //   }
  // }

  // let flag = false
  // quickSelector.addEventListener('mouseover', ev => {
  //   if (flag) {
  //     return
  //   }
  //   const srcElement = ev.target
  //   const config = map.get(srcElement as HTMLElement)
  //   if (config) {
  //     map.forEach((value, key) => {
  //       if (value.row <= config.row && value.col <= config.col) {
  //         key.classList.add('textbus-toolbar-table-quick-selector-selected')
  //       } else {
  //         key.classList.remove('textbus-toolbar-table-quick-selector-selected')
  //       }
  //     })
  //     form.update({
  //       cols: config.col + 1,
  //       rows: config.row + 1
  //     })
  //   }
  // })

  // quickSelector.addEventListener('mouseleave', () => {
  //   if (!flag) {
  //     Array.from(map.keys()).forEach(el => el.classList.remove('textbus-toolbar-table-quick-selector-selected'))
  //     form.update({})
  //   }
  //   flag = false
  // })

  // quickSelector.addEventListener('click', () => {
  //   flag = true
  // })
  // form.elementRef.insertBefore(quickSelector, form.elementRef.childNodes[0])
  return {
    iconClasses: ['textbus-icon-table'],
    tooltip: i18n.get('plugins.toolbar.tableAddTool.tooltip'),
    // viewController: form,
    views: [
      h(TableForm, {
        rows: 2,
        cols: 2,
        onConfirm: (value) => {
          function create(rows: number, columns: number) {
            const result: Slot[] = []
            const size = rows * columns
            for (let i = 0; i < size; i++) {
              result.push(createCell())
            }
            return result
          }
    
          const component = tableComponent.createInstance(injector, {
            slots: create(value.rows || 4, value.cols || 6),
            state: {
              useTextbusStyle: value.useTextbusStyle,
              columnCount: value.cols || 6,
              rowCount: value.rows || 4
            }
          })
    
          commander.insert(component)
          selection.setPosition(component.slots.get(0)!, 0)
        }
      })
    ],
    queryState(): QueryState<any> {
      return {
        state: QueryStateType.Normal,
        value: null
      }
    },
    useValue(value: any) {
      function create(rows: number, columns: number) {
        const result: Slot[] = []
        const size = rows * columns
        for (let i = 0; i < size; i++) {
          result.push(createCell())
        }
        return result
      }

      const component = tableComponent.createInstance(injector, {
        slots: create(value.rows || 4, value.cols || 6),
        state: {
          useTextbusStyle: value.useTextbusStyle,
          columnCount: value.cols || 6,
          rowCount: value.rows || 4
        }
      })

      commander.insert(component)
      selection.setPosition(component.slots.get(0)!, 0)
    }
  }
}

export function tableAddTool() {
  return new PopoverTool(tableAddToolConfigFactory)
}
