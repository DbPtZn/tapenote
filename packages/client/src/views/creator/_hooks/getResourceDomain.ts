import useStore from "@/store"

export function getResourceDomain(hostname: string) {
  let resourceDomain = localStorage.getItem(`ResourceDomain:${hostname}`)
  if (!resourceDomain) {
    try {
      const { userListStore } = useStore()
      resourceDomain = userListStore.getResourceDomain(hostname) || null
    } catch (error) {
      return null
    }
  }
  return resourceDomain
}