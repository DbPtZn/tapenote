
export function useGetKeymapHandler(el: HTMLElement, elementRef: HTMLElement): string {
  if (el === elementRef) {
    return ''
  }
  if (el.dataset.keymap) {
    return el.dataset.keymap
  }
  return useGetKeymapHandler(el.parentNode as HTMLElement, elementRef)
}