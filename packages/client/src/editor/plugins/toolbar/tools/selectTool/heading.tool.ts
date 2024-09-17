import {
  Commander,
  ContentType,
  Query,
  QueryState,
  QueryStateType,
  Slot,
  Injector
} from '@textbus/core'
import { SelectTool, SelectToolConfig } from '../../toolkit/select-tool'
import { I18n, headingComponent, paragraphComponent } from '@textbus/editor'

export function headingToolConfigFactory(injector: Injector): SelectToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  return {
    tooltip: i18n.get('plugins.toolbar.headingTool.tooltip'),
    options: [{
      label: i18n.get('plugins.toolbar.headingTool.h1'),
      classes: ['textbus-toolbar-h1'], 
      value: 'h1',
      keymap: {
        ctrlKey: true,
        key: '1'
      },
      suffix: 'Ctrl+1'
    }, {
      label: i18n.get('plugins.toolbar.headingTool.h2'),
      classes: ['textbus-toolbar-h2'],
      value: 'h2',
      keymap: {
        ctrlKey: true,
        key: '2'
      },
      suffix: 'Ctrl+2'
    }, {
      label: i18n.get('plugins.toolbar.headingTool.h3'),
      classes: ['textbus-toolbar-h3'],
      value: 'h3',
      keymap: {
        ctrlKey: true,
        key: '3'
      },
      suffix: 'Ctrl+3'
    }, {
      label: i18n.get('plugins.toolbar.headingTool.h4'),
      classes: ['textbus-toolbar-h4'],
      value: 'h4',
      keymap: {
        ctrlKey: true,
        key: '4'
      },
      suffix: 'Ctrl+4'
    }, {
      label: i18n.get('plugins.toolbar.headingTool.h5'),
      classes: ['textbus-toolbar-h5'],
      value: 'h5',
      keymap: {
        ctrlKey: true,
        key: '5'
      },
      suffix: 'Ctrl+5'
    }, {
      label: i18n.get('plugins.toolbar.headingTool.h6'),
      classes: ['textbus-toolbar-h6'],
      value: 'h6',
      keymap: {
        ctrlKey: true,
        key: '6'
      },
      suffix: 'Ctrl+6'
    }, {
      label: i18n.get('plugins.toolbar.headingTool.paragraph'),
      value: 'p',
      default: true,
      keymap: {
        ctrlKey: true,
        key: '0'
      },
      suffix: 'Ctrl+0'
    }],
    queryState(): QueryState<string> {
      const headingState = query.queryComponent(headingComponent)
      if (headingState.state === QueryStateType.Enabled) {
        // console.log(headingState.value)
        return {
          state: QueryStateType.Enabled,
          value: headingState.value!.state
        }
      }
      const paragraphState = query.queryComponent(paragraphComponent)
      return {
        state: paragraphState.state,
        value: paragraphState.state === QueryStateType.Enabled ? 'p' : null
      }
    },
    onChecked(value: string) {
      // console.log(value)
      const isHeading = /h[1-6]/.test(value)
      commander.transform({
        target: isHeading ? headingComponent : paragraphComponent,
        multipleSlot: false,
        slotFactory() {
          return new Slot([
            ContentType.Text,
            ContentType.InlineComponent
          ])
        },
        stateFactory() {
          if (isHeading) {
            return value
          }
        }
      })
    }
  }
}

export function headingTool() {
  return new SelectTool(headingToolConfigFactory)
}
