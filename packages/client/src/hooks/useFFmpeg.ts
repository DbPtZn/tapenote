export function useFFmpeg() {
  const worker = new Worker(new URL('./workers/ffmpeg-worker.mjs', import.meta.url))

  return {
    async runFFmpeg(files, options) {
      return new Promise((resolve, reject) => {
        worker.onmessage = event => {
          const { success, output, error } = event.data
          if (success) resolve(output)
          else reject(new Error(error))
        }

        worker.postMessage({
          command: 'run',
          files,
          options
        })
      })
    },
    terminate() {
      worker.terminate()
    }
  }
}
