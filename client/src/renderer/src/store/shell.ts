import { FractalContainerConfig } from ".."

/**
 * 壳接口
 */
declare class ShellModule {
  /** 壳高度 */
  readonly height: number | string
  /** 壳宽度 */
  readonly width: number | string
  /** 辅助线 */
  readonly useAuxLines?: string
  setup(): FractalContainerConfig
}

export { ShellModule }
