import { Commander, QueryState, QueryStateType, Slot, Injector, Selection } from "@textbus/core"
import { PopoverTool, PopoverToolConfig } from "../.."
// import { zh_CN } from '../../../../i18n/_api'
import { h } from "vue"
// import { I18n, createCell, tableComponent } from "@/editor"
import TableForm from './_utils/TableForm.vue'
import { I18n } from "@textbus/editor"
import { createCell } from "../../../../components"
import { tableComponent } from "../../../../components"

export function tableAddToolConfigFactory(injector: Injector): PopoverToolConfig {
  const i18n = injector.get(I18n)
  const commander = injector.get(Commander)
  const selection = injector.get(Selection)
  return {
    iconClasses: ['textbus-icon-table'],
    tooltip: i18n.get('plugins.toolbar.tableAddTool.tooltip'),
    // viewController: form,
    view: h(TableForm, {
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
    }),
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
