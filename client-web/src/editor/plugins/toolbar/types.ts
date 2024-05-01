import { Injector } from "@textbus/core"
import { VNode } from "vue"

export interface Tool {
  setup(injector: Injector, limitElement: HTMLElement): VNode

  refreshState(): void

  disabled(is: boolean): void

  onDestroy?(): void
}
