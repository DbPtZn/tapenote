import { useRendererStore } from "."

export function useShell<T>() {
  return useRendererStore().getShell<T>()
}