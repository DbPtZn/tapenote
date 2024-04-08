import { FractalContainerConfig } from "./fractal-container"

/**
 * 壳接口
 */
export declare class ShellModule {
  /** 壳高度 */
  readonly height: number | string
  /** 壳宽度 */
  readonly width: number | string
  /** 辅助线 */
  readonly useAuxLines?: string
  setup(): FractalContainerConfig
}
