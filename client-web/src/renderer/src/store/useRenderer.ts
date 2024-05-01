import { useRendererStore } from "."

export function useRenderer() {
  const renderer = useRendererStore()
  return renderer
}