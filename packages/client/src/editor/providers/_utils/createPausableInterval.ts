export function createPausableInterval(callback: () => void, interval: number) {
  let timerId: NodeJS.Timeout | null = null
  let isPaused: boolean = false

  function start(): void {
    if (!isPaused && timerId === null) {
      timerId = setInterval(callback, interval)
    }
  }

  function pause(): void {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
      isPaused = true
    }
  }

  function resume(): void {
    if (isPaused) {
      isPaused = false
      start()
    }
  }

  function stop(): void {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
    isPaused = false
  }

  start() // Automatically start the interval when created

  return { pause, resume, stop }
}
