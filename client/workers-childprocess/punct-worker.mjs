import sherpa_onnx from 'sherpa-onnx-node'

// const { txt, config } = workerData

// try {
//   const punct = new sherpa_onnx.Punctuation(config)
//   const punct_text = punct.addPunct(txt)

//   parentPort.postMessage(punct_text)
// } catch (error) {
//   parentPort.postMessage({ error: error.message })
// }


process.on('message', msg => {
  // console.log('message', msg)
  const { txt, config }  = msg
  try {
    const punct = new sherpa_onnx.Punctuation(config)
    const punct_text = punct.addPunct(txt)

    process.send(punct_text)
  } catch (error) {
    process.send({ error: error.message })
  }
})