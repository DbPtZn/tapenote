import sherpa_onnx from 'sherpa-onnx-node'
import { parentPort, workerData } from 'worker_threads'

const { txt, config } = workerData

try {
  const punct = new sherpa_onnx.Punctuation(config)
  const punct_text = punct.addPunct(txt)
  // console.log('punct_text:' + punct_text)
  parentPort.postMessage(punct_text)
} catch (error) {
  parentPort.postMessage({ error: error.message })
}
