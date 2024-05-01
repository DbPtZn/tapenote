// import { Injector } from '@tanbo/di'
import {
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  Formatter,
  Injector,
  onBreak,
  onContextMenu,
  onPaste,
  RenderMode,
  Selection,
  Slot,
  SlotRender,
  Slots,
  useContext,
  useDynamicShortcut,
  useSlots,
  useState,
  VElement,
  VTextNode,
} from '@textbus/core'
import { ComponentLoader } from '@textbus/platform-browser'
import { Grammar, languages, Token, tokenize } from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-powershell'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-less'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-stylus'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import { paragraphComponent } from './paragraph.component'
import { useComponentToolbar, useSelector } from './templates'
import { I18n } from '@textbus/editor'

export const codeStyles = {
  keyword: 'keyword',
  string: 'string',
  function: 'function',
  number: 'number',
  tag: 'tag',
  comment: 'comment',
  boolean: 'boolean',
  operator: false,
  builtin: 'builtin',
  punctuation: false,
  regex: 'regex',
  selector: 'selector',
  property: 'attr-name',
  'class-name': 'class-name',
  'attr-name': 'attr-name',
  'attr-value': 'attr-value',
  'template-punctuation': 'string',
}

export const languageList: Array<{ label: string, value: string }> = [{
  label: 'JavaScript',
  value: 'JavaScript',
}, {
  label: 'HTML',
  value: 'HTML',
}, {
  label: 'CSS',
  value: 'CSS',
}, {
  label: 'TypeScript',
  value: 'TypeScript',
}, {
  label: 'Java',
  value: 'Java',
}, {
  label: 'C',
  value: 'C',
}, {
  label: 'C++',
  value: 'CPP',
}, {
  label: 'C#',
  value: 'CSharp',
}, {
  label: 'Swift',
  value: 'Swift',
}, {
  label: 'Go',
  value: 'Go'
}, {
  label: 'JSON',
  value: 'JSON',
}, {
  label: 'Less',
  value: 'Less',
}, {
  label: 'SCSS',
  value: 'SCSS',
}, {
  label: 'Stylus',
  value: 'Stylus',
}, {
  label: 'Jsx',
  value: 'Jsx',
}, {
  label: 'Tsx',
  value: 'Tsx',
}, {
  label: '',
  value: '',
}]

export interface PreComponentState {
  lang: string
  theme?: string
}

export class CodeStyleFormatter implements Formatter<string> {
  priority = 0 // 新增代码
  name = 'code' + Math.random()
  columned = false

  render(children: Array<VElement | VTextNode>, formatValue: string) {
    return new VElement('span', {
      class: 'tb-hl-' + formatValue
    }, children)
  }
}

export const codeStyleFormatter = new CodeStyleFormatter()

function getLanguageBlockCommentStart(lang: string): [string, string] {
  const types: Record<string, [string, string]> = {
    HTML: ['<!--', '-->'],
    JavaScript: ['/*', '*/'],
    CSS: ['/*', '*/'],
    TypeScript: ['/*', '*/'],
    Java: ['/*', '*/'],
    Swift: ['/*', '*/'],
    Go: ['/*', '*/'],
    JSON: ['', ''],
    Less: ['/*', '*/'],
    SCSS: ['/*', '*/'],
    Stylus: ['/*', '*/'],
    C: ['/*', '*/'],
    CPP: ['/*', '*/'],
    CSharp: ['/*', '*/'],
    Tsx: ['/*', '*/'],
    Jsx: ['/*', '*/']
  }
  return types[lang] || ['', '']
}

function getLanguageGrammar(lang: string): Grammar | null {
  return {
    HTML: languages.html,
    JavaScript: languages.javascript,
    CSS: languages.css,
    TypeScript: languages.typescript,
    Java: languages.java,
    Swift: languages.swift,
    JSON: languages.json,
    Go: languages.go,
    Ruby: languages.ruby,
    Less: languages.less,
    SCSS: languages.scss,
    Stylus: languages.stylus,
    C: languages.c,
    CPP: languages.cpp,
    CSharp: languages.csharp,
    Jsx: languages.jsx,
    Tsx: languages.tsx
  }[lang] || null
}

function format(tokens: Array<string | Token>, slot: Slot, index: number) {
  tokens.forEach(token => {
    if (token instanceof Token) {
      const styleName = codeStyles[token.type]
      slot.retain(index)
      slot.retain(token.length, codeStyleFormatter, styleName || null)
      if (Array.isArray(token.content)) {
        format(token.content, slot, index)
      }
    }
    index += token.length
  })
}

function formatCodeLines(
  lines: Array<{ emphasize: boolean, code: string }>,
  startBlock: boolean,
  blockCommentStartString: string,
  blockCommentEndString: string,
  languageGrammar: Grammar | null) {
  return lines.map(item => {
    let i = item.code
    const slot = createCodeSlot()
    slot.updateState(draft => {
      draft.blockCommentStart = startBlock
      draft.emphasize = item.emphasize
    })
    if (slot.state!.blockCommentStart) {
      i = blockCommentStartString + i
    }
    slot.insert(i)
    if (languageGrammar) {
      const tokens = tokenize(i, languageGrammar)
      format(tokens, slot, 0)
      if (slot.state!.blockCommentStart) {
        slot.retain(0)
        slot.delete(2)
      }
      const lastToken = tokens.pop()

      if (lastToken && typeof lastToken !== 'string' &&
        lastToken.type === 'comment' &&
        (lastToken.content as string).indexOf(blockCommentStartString) === 0) {
        const regString = blockCommentEndString.replace(new RegExp(`[${blockCommentEndString}]`, 'g'), i => '\\' + i)
        slot.updateState(draft => {
          draft.blockCommentEnd = new RegExp(regString + '$').test(lastToken.content as string)
        })
        startBlock = !slot.state!.blockCommentEnd
      } else {
        startBlock = false
      }

      // startBlock = !!lastToken && typeof lastToken !== 'string' &&
      //   lastToken.type === 'comment' &&
      //   (lastToken.content as string).indexOf(blockCommentStartString) === 0
      // slot.blockCommentEnd = !startBlock
    } else {
      slot.updateState(draft => {
        draft.blockCommentEnd = true
      })
    }
    return slot
  })
}

function reformat(
  slots: Slots,
  startSlot: Slot,
  languageGrammar: Grammar,
  blockCommentStartString: string,
  blockCommentEndString: string,
  forceFormat = false) {
  const list = slots.toArray()
  let i = list.indexOf(startSlot)
  // if (list[0]) {
  //   list[0].blockCommentStart = startSlot.blockCommentEnd
  // }
  for (; i < list.length; i++) {
    const slot = list[i]
    let code = slot.sliceContent()[0] as string
    if (slot.state.blockCommentStart) {
      code = blockCommentStartString + code
    }

    const shadow = new Slot([ContentType.Text])
    shadow.insert(code)
    const tokens = tokenize(code, languageGrammar)
    format(tokens, shadow, 0)
    if (slot.state.blockCommentStart) {
      shadow.retain(0)
      shadow.delete(2)
    }

    slot.retain(0)
    slot.retain(slot.length, codeStyleFormatter, null)

    shadow.getFormats().forEach(i => {
      slot.retain(i.startIndex)
      slot.retain(i.endIndex - i.startIndex, i.formatter, i.value)
    })

    const lastToken = tokens.pop()
    if (lastToken && typeof lastToken !== 'string' &&
      lastToken.type === 'comment' &&
      (lastToken.content as string).indexOf(blockCommentStartString) === 0) {
      const regString = blockCommentEndString.replace(new RegExp(`[${blockCommentEndString}]`, 'g'), i => '\\' + i)
      slot.updateState(draft => {
        draft.blockCommentEnd = new RegExp(regString + '$').test(lastToken.content as string)
      })
    } else {
      slot.updateState(draft => {
        draft.blockCommentEnd = true
      })
    }

    const next = list[i + 1]
    if (next) {
      if (!forceFormat && next.state.blockCommentStart === !slot.state.blockCommentEnd) {
        break
      }
      next.updateState(draft => {
        draft.blockCommentStart = !slot.state.blockCommentEnd
      })
    }
  }
}

export interface CodeSlotState {
  blockCommentEnd: boolean
  blockCommentStart: boolean
  emphasize: boolean
}

export function createCodeSlot() {
  return new Slot<CodeSlotState>([
    ContentType.Text
  ], {
    blockCommentEnd: true,
    blockCommentStart: false,
    emphasize: false
  })
}

export const preComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'PreComponent',
  separable: false,
  zenCoding: {
    key: 'Enter',
    match(c: string) {
      const matchString = languageList.map(i => i.label || i.value).concat('js', 'ts').join('|').replace(/\+/, '\\+')
      const reg = new RegExp(`^\`\`\`(${matchString})$`, 'i')
      return reg.test(c)
    },
    generateInitData(content) {
      const matchString = content.replace(/`/g, '').replace(/\+/, '\\+')
      for (const item of languageList) {
        const reg = new RegExp(`^${matchString}$`, 'i')
        if (reg.test(item.label || item.value)) {
          return {
            state: {
              lang: item.value,
              theme: ''
            },
            slots: [createCodeSlot()]
          }
        }
      }
      if (/^js$/i.test(matchString)) {
        return {
          state: {
            lang: 'JavaScript',
            theme: ''
          },
          slots: [createCodeSlot()]
        }
      }
      if (/^ts$/i.test(matchString)) {
        return {
          state: {
            lang: 'TypeScript',
            theme: ''
          },
          slots: [createCodeSlot()]
        }
      }
      return {
        state: {
          lang: '',
          theme: ''
        },
        slots: [createCodeSlot()]
      }
    }
  },
  setup(data: ComponentInitData<PreComponentState, CodeSlotState> = {
    slots: [],
    state: {
      lang: '',
      theme: ''
    }
  }) {
    let languageGrammar = getLanguageGrammar(data.state!.lang)
    let [blockCommentStartString, blockCommentEndString] = getLanguageBlockCommentStart(data.state!.lang)

    const stateController = useState({
      lang: data.state!.lang,
      theme: data.state?.theme || 'auto'
    })
    const injector = useContext()

    const i18n = injector.get(I18n)

    const selection = injector.get(Selection)

    stateController.onChange.subscribe(newState => {
      data.state!.lang = newState.lang
      data.state!.theme = newState.theme
      languageGrammar = getLanguageGrammar(newState.lang);

      [blockCommentStartString, blockCommentEndString] = getLanguageBlockCommentStart(newState.lang)
      isStop = true
      slots.toArray().forEach(i => {
        i.updateState(draft => {
          draft.blockCommentStart = false
          draft.blockCommentEnd = false
        })
      })
      if (!languageGrammar) {
        slots.toArray().forEach(i => {
          i.retain(0)
          i.retain(i.length, codeStyleFormatter, null)
        })
      } else {
        reformat(slots, slots.get(0)!, languageGrammar!, blockCommentStartString, blockCommentEndString, true)
      }
      isStop = false
    })

    const codeConfig = (data.slots || [createCodeSlot()]).map(i => {
      return {
        emphasize: i.state?.emphasize || false,
        code: i.toString()
      }
    })
    const slotList = formatCodeLines(
      codeConfig,
      false,
      blockCommentStartString,
      blockCommentEndString,
      languageGrammar
    )
    const slots = useSlots(slotList)

    let isStop = false

    slots.onChildSlotChange.subscribe(slot => {
      if (languageGrammar && !isStop) {
        isStop = true
        const index = slot.index
        reformat(slots, slot, languageGrammar, blockCommentStartString, blockCommentEndString)
        slot.retain(index)
        isStop = false
      }
    })

    useDynamicShortcut({
      keymap: {
        key: '/',
        ctrlKey: true
      },
      action: () => {
        const startIndex = slots.indexOf(selection.startSlot!)
        const endIndex = slots.indexOf(selection.endSlot!)

        const selectedSlots = slots.slice(startIndex, endIndex + 1)
        const isAllComment = selectedSlots.every(f => {
          return /^\s*\/\//.test(f.toString())
        })
        if (isAllComment) {
          selectedSlots.forEach(f => {
            const code = f.toString()
            const index = code.indexOf('// ')
            const index2 = code.indexOf('//')

            if (index >= 0) {
              f.cut(index, index + 3)
              if (f === selection.anchorSlot) {
                selection.setAnchor(f, selection.startOffset! - 3)
              }
              if (f === selection.focusSlot) {
                selection.setFocus(f, selection.endOffset! - 3)
              }
            } else {
              f.cut(index2, index2 + 2)
              if (f === selection.anchorSlot) {
                selection.setAnchor(f, selection.startOffset! - 2)
              }
              if (f === selection.focusSlot) {
                selection.setFocus(f, selection.endOffset! - 2)
              }
            }
          })
        } else {
          selectedSlots.forEach(f => {
            f.retain(0)
            f.insert('// ')
          })
          selection.setBaseAndExtent(selection.startSlot!, selection.startOffset! + 3, selection.endSlot!, selection.endOffset! + 3)
        }
      }
    })

    onBreak(ev => {
      if (ev.target.isEmpty && ev.target === slots.last) {
        const prevSlot = slots.get(slots.length - 2)
        if (prevSlot?.isEmpty) {
          const paragraph = paragraphComponent.createInstance(injector)
          const parentComponent = selection.commonAncestorComponent!
          const parentSlot = parentComponent.parent!
          const index = parentSlot.indexOf(parentComponent)
          parentSlot.retain(index + 1)
          slots.remove(slots.last)
          if (slots.length > 1) {
            slots.remove(prevSlot)
          }
          parentSlot.insert(paragraph)
          selection.setPosition(paragraph.slots.get(0)!, 0)
          ev.preventDefault()
          return
        }
      }
      const nextSlot = ev.target.cutTo(createCodeSlot(), ev.data.index)
      slots.insertAfter(nextSlot, ev.target as Slot)
      if (languageGrammar && !isStop) {
        isStop = true
        const index = nextSlot.index
        reformat(slots, nextSlot, languageGrammar, blockCommentStartString, blockCommentEndString)
        nextSlot.retain(index)
        isStop = false
      }
      selection.setPosition(nextSlot, 0)
      ev.preventDefault()
    })

    function emphasize() {
      const { startSlot, endSlot } = selection
      let startIndex = slots.indexOf(startSlot!)
      const endIndex = slots.indexOf(endSlot!) + 1
      for (; startIndex < endIndex; startIndex++) {
        slots.get(startIndex)?.updateState(draft => {
          draft.emphasize = true
        })
      }
    }

    function cancelEmphasize() {
      const { startSlot, endSlot } = selection
      let startIndex = slots.indexOf(startSlot!)
      const endIndex = slots.indexOf(endSlot!) + 1
      for (; startIndex < endIndex; startIndex++) {
        slots.get(startIndex)?.updateState(draft => {
          draft.emphasize = false
        })
      }
    }

    onContextMenu(event => {
      event.useMenus([{
        iconClasses: ['textbus-icon-source-code'],
        label: i18n.get('components.preComponent.contextMenuLabel'),
        submenu: languageList.map(i => {
          return {
            label: i.label || i18n.get('components.preComponent.defaultLang'),
            onClick() {
              if (i.value !== data.state!.lang) {
                data.state!.lang = i.value
                stateController.update(draft => {
                  draft.lang = i.value
                })
              }
            }
          }
        })
      }, {
        // iconClasses:
        label: i18n.get('components.preComponent.changeTheme'),
        submenu: [{
          label: 'Light',
          onClick() {
            stateController.update(draft => {
              draft.theme = 'light'
            })
          }
        }, {
          label: 'Dark',
          onClick() {
            stateController.update(draft => {
              draft.theme = 'dark'
            })
          }
        }]
      }, {
        label: i18n.get('components.preComponent.emphasize'),
        disabled: !selection.isSelected,
        onClick: emphasize
      }, {
        label: i18n.get('components.preComponent.cancelEmphasize'),
        disabled: !selection.isSelected,
        onClick: cancelEmphasize
      }])
    })

    onPaste(ev => {
      const codeList: string[] = []
      const sourceCode = ev.data.text

      let str = ''
      let isBreak = true
      for (let i = 0; i < sourceCode.length; i++) {
        const char = sourceCode[i]
        if (char === '\r') {
          if (sourceCode[i + 1] === '\n') {
            i++
          }
          if (str) {
            codeList.push(str)
            str = ''
          }
          if (!isBreak) {
            codeList.push('')
          } else {
            isBreak = false
          }
        } else if (char === '\n') {
          if (str) {
            codeList.push(str)
            str = ''
          }
          if (!isBreak) {
            codeList.push('')
          } else {
            isBreak = false
          }
        } else {
          isBreak = true
          str += char
        }
      }
      if (str) {
        codeList.push(str)
      }
      const firstCode = codeList.shift()
      const target = ev.target
      if (firstCode) {
        target.insert(firstCode)
      }
      const index = slots.indexOf(target)
      if (codeList.length) {
        slots.retain(index + 1)
        const slotList = formatCodeLines(
          codeList.map(i => {
            return {
              code: i,
              emphasize: false
            }
          }),
          !target.state.blockCommentEnd,
          blockCommentStartString,
          blockCommentEndString,
          languageGrammar
        )
        const last = slotList[slotList.length - 1]
        slots.insert(...slotList)
        selection.setPosition(last, last.length)
      } else {
        selection.setPosition(target, target.index)
      }
      ev.preventDefault()
    })

    const ComponentToolbar = useComponentToolbar()
    const LanguageSelector = useSelector({
      items: languageList.map(item => {
        if (item.label) {
          return item
        }
        return {
          ...item,
          label: i18n.get('components.preComponent.defaultLang')
        }
      }),
      defaultValue: data.state?.lang
    }, current => {
      stateController.update(draft => {
        draft.lang = current.value
      })
    })
    const ThemeSelector = useSelector({
      items: [
        {
          label: 'Auto',
          value: 'auto'
        },
        {
          label: 'Light',
          value: 'light'
        }, 
        {
          label: 'Dark',
          value: 'dark'
        }
      ],
      defaultValue: data.state?.theme || 'auto'
    }, current => {
      stateController.update(draft => {
        draft.theme = current.value
      })
    })

    return {
      render(slotRender: SlotRender, renderMode: RenderMode): VElement {
        let lang = ''
        languageList.forEach(i => {
          if (i.value === data.state!.lang) {
            lang = i.label
          }
        })
        const blockHighlight = slots.toArray().some(i => i.state?.emphasize === true)
        return (
          <pre class="tb-pre" lang={lang} data-theme={data.state!.theme || null}>
            {
              renderMode === RenderMode.Editing ?
              <ComponentToolbar>
                <LanguageSelector/>
                <ThemeSelector/>
                <button type="button" class="textbus-toolbar-button" onClick={emphasize}>
                  {i18n.get('components.preComponent.emphasize')}
                </button>
                <button type="button" class="textbus-toolbar-button" onClick={cancelEmphasize}>
                  {i18n.get('components.preComponent.cancelEmphasize')}
                </button>
              </ComponentToolbar> : null
            }
            <div class="tb-pre-content">
              <div class="tb-code-line-number-bg " style={{
                width: Math.max(String(slots.length).length, 2.5) + 'em'
              }}/>
              <div class={'tb-code-content' + (blockHighlight ? ' tb-color-content-highlight' : '')}>
                {
                  slots.toArray().map(item => {
                    return slotRender(item, children => {
                      return <div
                        class={(item.state?.emphasize ? 'tb-code-line-emphasize ' : '') + 'tb-code-line'}>{children}</div>
                    })
                  })
                }
              </div>
              <span class="tb-pre-lang">{lang}</span>
            </div>
          </pre>
        )
      }
    }
  }
})

export const preComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.tagName === 'PRE'
  },
  read(el: HTMLElement, injector: Injector): ComponentInstance {
    const lines = el.querySelectorAll('.tb-code-line')
    let slots: Slot[] = []
    if (lines.length) {
      slots = Array.from(lines).map(i => {
        const code = (i as HTMLElement).innerText.replace(/[\s\n]+$/, '')
        const slot = createCodeSlot()
        slot.updateState(draft => {
          draft.emphasize = i.classList.contains('tb-code-line-emphasize')
        })
        slot.insert(code)
        return slot
      })
    } else {
      el.querySelectorAll('br').forEach(br => {
        br.parentNode!.replaceChild(document.createTextNode('\n'), br)
      })
      slots = el.innerText.split('\n').map(code => {
        const slot = createCodeSlot()
        slot.insert(code)
        return slot
      })
    }

    return preComponent.createInstance(injector, {
      state: {
        lang: el.getAttribute('lang') || '',
        theme: el.dataset.theme || ''
      },
      slots
    })
  },
}
