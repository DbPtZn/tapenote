// import { Injector } from '@tanbo/di'
//
// import { I18n } from '../../i18n'
// import { GroupTool, GroupToolConfig, ToolType } from '../toolkit/group-tool'

import { DropdownTool, DropdownToolConfig, ToolType, blockquoteToolConfigFactory, codeToolConfigFactory, emojiToolConfigFactory, leftToRightToolConfigFactory, letterSpacingToolConfigFactory, lineHeightToolConfigFactory, preToolConfigFactory, rightToLeftToolConfigFactory, subscriptToolConfigFactory, superscriptToolConfigFactory } from '../..'
// import { Textbus } from '@textbus/core'
import { audioToolConfigFactory, videoToolConfigFactory } from '../dialog/_api'
import { I18n } from '@textbus/editor'
import { Injector } from '@textbus/core'

// import { superscriptToolConfigFactory } from './superscript.tool'
// import { subscriptToolConfigFactory } from './subscript.tool'
// import { preToolConfigFactory } from './pre.tool'
// import { lineHeightToolConfigFactory } from './line-height.tool'
// import { letterSpacingToolConfigFactory } from './letter-spacing.tool'
// import { emojiToolConfigFactory } from './emoji.tool'
// import { codeToolConfigFactory } from './code.tool'
// import { leftToRightToolConfigFactory } from './left-to-right.tool'
// import { rightToLeftToolConfigFactory } from './right-to-left.tool'
// import { audioToolConfigFactory } from './audio.tool'
// import { videoToolConfigFactory } from './video.tool'
// import { blockquoteToolConfigFactory } from './blockquote.tool'

export function defaultGroupToolFactory(injector: Injector): DropdownToolConfig {
  const i18n = injector.get(I18n)
  return {
    iconClasses: ['textbus-icon-plus'],
    options: [
      {
        ...preToolConfigFactory(injector),
        type: ToolType.Select,
        label: i18n.get('plugins.toolbar.insertObjectTool.sourceCode')
      },
      {
        ...lineHeightToolConfigFactory(injector),
        type: ToolType.Select,
        label: i18n.get('plugins.toolbar.insertObjectTool.lineHeight')
      },
      {
        ...letterSpacingToolConfigFactory(injector),
        type: ToolType.Select,
        label: i18n.get('plugins.toolbar.insertObjectTool.letterSpacing')
      },
      {
        ...emojiToolConfigFactory(injector),
        type: ToolType.Render,
        label: i18n.get('plugins.toolbar.insertObjectTool.emoji')
      },
      // {
      //   ...audioToolConfigFactory(injector),
      //   type: ToolType.Dialog,
      //   label: i18n.get('plugins.toolbar.insertObjectTool.audio')
      // },
      // {
      //   ...videoToolConfigFactory(injector),
      //   type: ToolType.Dialog,
      //   label: i18n.get('plugins.toolbar.insertObjectTool.video')
      // },
      {
        ...superscriptToolConfigFactory(injector),
        type: ToolType.Button,
        label: i18n.get('plugins.toolbar.insertObjectTool.superscript')
      },
      {
        ...subscriptToolConfigFactory(injector),
        type: ToolType.Button,
        label: i18n.get('plugins.toolbar.insertObjectTool.subscript')
      },
      // {
      //   ...codeToolConfigFactory(injector),
      //   type: ToolType.Button,
      //   label: i18n.get('plugins.toolbar.insertObjectTool.code')
      // },
      {
        ...blockquoteToolConfigFactory(injector),
        type: ToolType.Button,
        label: i18n.get('plugins.toolbar.insertObjectTool.blockquote')
      },
      {
        ...leftToRightToolConfigFactory(injector),
        type: ToolType.Button,
        label: i18n.get('plugins.toolbar.insertObjectTool.leftToRight')
      },
      {
        ...rightToLeftToolConfigFactory(injector),
        type: ToolType.Button,
        label: i18n.get('plugins.toolbar.insertObjectTool.rightToLeft')
      }
    ]
  }
}

export function defaultGroupTool() {
  return new DropdownTool(defaultGroupToolFactory)
}
