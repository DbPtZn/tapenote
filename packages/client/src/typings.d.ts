import { VElement } from '@textbus/textbus'

declare namespace JSX {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Element extends VElement {}
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
