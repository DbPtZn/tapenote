import {
  Commander,
  ContentType,
  Injectable,
  Injector,
  Registry,
  RootComponentRef,
  Event,
  Selection,
  Slot,
  invokeListener,
  DeltaLite,
  ComponentInstance,
  ComponentExtends,
  FormatValue,
  Formats,
  Formatter,
  SelectionPosition,
  BreakEventData
} from '@textbus/core'

function canInsert(content: string | ComponentInstance, target: Slot) {
  const insertType = typeof content === 'string' ? ContentType.Text : content.type
  return target.schema.includes(insertType)
}
function getInsertPosition(slot: Slot, offset: number, content: string | ComponentInstance, excludeSlots: Slot[] = []): SelectionPosition | null {
  if (canInsert(content, slot)) {
    return {
      slot,
      offset
    }
  }
  excludeSlots.push(slot)
  return getNextInsertPosition(slot, content, excludeSlots)
}

function getNextInsertPosition(currentSlot: Slot, content: string | ComponentInstance, excludeSlots: Slot[]): SelectionPosition | null {
  const parentComponent = currentSlot.parent!
  const slotIndex = parentComponent.slots.indexOf(currentSlot)
  if (currentSlot !== parentComponent.slots.last) {
    return getInsertPosition(parentComponent.slots.get(slotIndex + 1)!, 0, content, excludeSlots)
  }
  const parentSlot = parentComponent.parent
  if (!parentSlot) {
    return null
  }
  if (excludeSlots.includes(parentSlot)) {
    return getNextInsertPosition(parentSlot, content, excludeSlots)
  }
  const index = parentSlot.indexOf(parentComponent)
  const position = getInsertPosition(parentSlot, index + 1, content, excludeSlots)
  if (position) {
    return position
  }
  excludeSlots.push(parentSlot)

  const afterContent = parentSlot.sliceContent(index + 1)
  const firstComponent = afterContent
    .filter((i): i is ComponentInstance => {
      return typeof i !== 'string'
    })
    .shift()

  if (firstComponent && firstComponent.slots.length) {
    return getInsertPosition(firstComponent.slots.get(0)!, 0, content, excludeSlots)
  }

  return getNextInsertPosition(parentSlot, content, excludeSlots)
}

@Injectable()
export class CustomCommander extends Commander {
  constructor(selection: Selection, injector: Injector, registry: Registry, rootComponentRef: RootComponentRef) {
    super(selection, injector, registry, rootComponentRef)
  }

  /**
   * 在当前选区粘贴新内容，当选区未闭合时，会先删除选区内容，再粘贴新内容
   * @param pasteSlot 要粘贴的数据
   * @param text 要粘贴的文本
   */
  paste(pasteSlot: Slot<any>, text: string): boolean {
    // console.log(pasteSlot)
    // console.log(text)
    if (pasteSlot.isEmpty) {
      return false
    }
    const selection = this.selection
    if (!selection.isSelected) {
      return false
    }
    if (!selection.isCollapsed) {
      this.delete()
    }
    const component = selection.commonAncestorComponent!
    const slot = selection.commonAncestorSlot!
    const event = new Event(slot, {
      index: selection.startOffset!,
      data: pasteSlot,
      text
    })
    // 监听组件事件 （这里组件中如果阻止事件，则 event.isPrevented 会变成 true）
    invokeListener(component, 'onPaste', event)
    if (!event.isPrevented) {
      const delta = pasteSlot.toDelta()
      const afterDelta = new DeltaLite()
      // console.log([delta, afterDelta])
      while (delta.length) {
        const { insert, formats } = delta.shift()!
        // console.log([insert, formats])
        const filterFormats = formats.filter(format => {
          // console.log(format)
          if (format[0].name === 'color' && format[1] === 'rgb(255, 255, 255)') return false
          return !['textBackgroundColor', 'fontFamily'].includes(format[0].name)
        })
        // console.log(filterFormats)
        const commonAncestorSlot = selection.commonAncestorSlot!
        if (typeof insert !== 'string') {
          // console.log(insert)
          // console.log(insert.toJSON())
          insert.slots.toArray().forEach(slot => {
            // 1. 判断当前是不是 dark 模式
            // 2. dark 模式下，#FFFFFF 要转换成 #000000
            // 3. 配色错误这个问题目前仅在自动继承颜色时发生
            // 4. 所以也可以过滤当颜色不属于配色表时，不进行继承
            // 清除组件中指定格式
            // console.log(slot)
            slot.cleanFormats(formatter => {
              // console.log(formatter)
              // console.log(slot.getFormats())
              if (formatter.name === 'color') {
                if (slot.getFormats().some(format => format.formatter.name === 'color' && format.value === 'rgb(255, 255, 255)')) return false
              }
              return !['textBackgroundColor', 'fontFamily'].includes(formatter.name)
            })
            // 清除组件中指定属性
            slot.cleanAttributes(attribute => {
              return !['blockBackgroundColor'].includes(attribute.name)
            })
          })
        }
        if (canInsert(insert, commonAncestorSlot)) {
          this.insert(insert, filterFormats)
          continue
        }

        afterDelta.push(...commonAncestorSlot.cut(selection.startOffset!).toDelta())

        const parentComponent = commonAncestorSlot.parent!

        if (commonAncestorSlot === parentComponent.slots.last) {
          this.insert(insert, filterFormats)
          continue
        }
        if (parentComponent.separable) {
          const index = parentComponent.slots.indexOf(commonAncestorSlot)
          const nextSlots = parentComponent.slots.cut(index + 1)
          const nextComponent = this.registry.createComponentByData(parentComponent.name, {
            state:
              typeof parentComponent.state === 'object' && parentComponent.state !== null
                ? JSON.parse(JSON.stringify(parentComponent.state))
                : parentComponent.state,
            slots: nextSlots
          })!
          afterDelta.push({
            insert: nextComponent,
            formats: []
          })
          this.insert(insert, filterFormats)
          continue
        }
        if (typeof insert === 'string') {
          this.insert(insert, filterFormats)
          continue
        }
        for (const childSlot of insert.slots.toArray()) {
          delta.unshift(...childSlot.toDelta())
        }
      }
      const snapshot = this.selection.createSnapshot()
      while (afterDelta.length) {
        const { insert, formats } = afterDelta.shift()!
        // console.log(formats)
        const filterFormats = formats.filter(format => {
          return !['textBackgroundColor', 'fontFamily'].includes(format[0].name)
        })
        this.insert(insert, filterFormats)
      }
      snapshot.restore()
      const currentContent = selection.startSlot!.getContentAtIndex(selection.startOffset!)
      if (
        currentContent &&
        typeof currentContent !== 'string' &&
        currentContent.type === ContentType.BlockComponent &&
        currentContent.slots.length > 0
      ) {
        selection.toNext()
      }
    }
    return !event.isPrevented
  }

  /**
   * 在当前选区插入新内容，当选区未闭合时，会先删除选区内容，再插入新的内容
   * 在插入新内容时，write 方法还会把相邻的样式应用到新内容上
   * @param content 新插入的内容
   * @param formats 新的格式
   */
  // write(content: string | ComponentInstance, formats?: Formats): boolean
  // write<T extends FormatValue>(content: string | ComponentInstance, formatter?: Formatter<T>, value?: T): boolean
  // write<T extends FormatValue>(content: string | ComponentInstance, formatter?: Formatter<T> | Formats, value?: T): boolean {
  //   const selection = this.selection
  //   const canInsert = selection.isCollapsed ? true : this.delete()
  //   if (!canInsert) {
  //     return false
  //   }
  //   const position = getInsertPosition(selection.startSlot!, selection.startOffset!, content)
  //   if (!position) {
  //     return false
  //   }
  //   let formats = position.slot.extractFormatsByIndex(position.offset).filter(i => {
  //     // 动画格式换行不继承
  //     return i[0].name !== 'AnimeFormatter'
  //   })
  //   if (formatter) {
  //     if (Array.isArray(formatter)) {
  //       formats = [...formats, ...formatter]
  //     } else {
  //       formats.push([formatter, value as FormatValue])
  //     }
  //   }
  //   return this.insert(content, formats)
  // }

   /**
   * 在当前选区内触发换行操作，如果选区未闭合，则先删除选区内容，再触发回车操作
   */
  //  break(): boolean {
  //   const selection = this.selection
  //   if (!selection.isSelected) {
  //     return false
  //   }

  //   if (!selection.isCollapsed) {
  //     const isCollapsed = this.delete(false)
  //     if (!isCollapsed) {
  //       return false
  //     }
  //   }
  //   const startSlot = this.selection.startSlot!
  //   const event = new Event<Slot, BreakEventData>(startSlot, {
  //     index: this.selection.startOffset!
  //   })

  //   invokeListener(startSlot.parent!, 'onBreak', event)

  //   if (!event.isPrevented) {
  //     const startOffset = this.selection.startOffset!
  //     const isToEnd = startOffset === startSlot.length || startSlot.isEmpty
  //     const content = isToEnd ? '\n\n' : '\n'
  //     const isInserted = this.write(content)
  //     if (isInserted && isToEnd) {
  //       this.selection.setPosition(startSlot, startOffset + 1)
  //     }
  //   }
  //   return !event.isPrevented
  // }
}
