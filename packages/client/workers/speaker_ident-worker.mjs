import sherpa_onnx from 'sherpa-onnx-node'
import assert from 'node:assert'
// import { parentPort, workerData } from 'worker_threads'
// const data = workerData

process.on('message', msg => {
  // console.log('message', msg)
  try {
    console.log(msg)
    let extractor
    try {
      // console.log('extarctor')
      extractor = createSpeakerEmbeddingExtractor()
    } catch (error) {
      console.log('createSpeakerEmbeddingExtractor error')
      throw error
    }
    // console.log('debugger4')
    let manager
    try {
      // console.log('manager')
      manager = new sherpa_onnx.SpeakerEmbeddingManager(extractor.dim)
    } catch (error) {
      console.log('sherpa_onnx.SpeakerEmbeddingManager error')
      throw error
    }
    // console.log('debugger3')
    // Please download test files from
    // https://github.com/csukuangfj/sr-data
    const spk1Files = ['./sr-data/enroll/fangjun-sr-1.wav', './sr-data/enroll/fangjun-sr-2.wav', './sr-data/enroll/fangjun-sr-3.wav']
  
    let spk1Vec = []
   try {
    for (let f of spk1Files) {
      spk1Vec.push(computeEmbedding(extractor, f))
    }
   } catch (error) {
    console.log('spk1Vec.push(computeEmbedding(extractor, f))' + error)
    throw error
   }
    // console.log('debugger2')
    const spk2Files = ['./sr-data/enroll/leijun-sr-1.wav', './sr-data/enroll/leijun-sr-2.wav']
  
    let spk2Vec = []
    for (let f of spk2Files) {
      spk2Vec.push(computeEmbedding(extractor, f))
    }
    // console.log('debugger1')
    let ok
    try {
      ok = manager.addMulti({ name: 'fangjun', v: spk1Vec })
    } catch (error) {
      console.log('manager.addMulti' + error)
      throw error
    }
    // console.log('debugger0')
    assert.equal(ok, true)
  
    ok = manager.addMulti({ name: 'leijun', v: spk2Vec })
    assert.equal(ok, true)
  
    assert.equal(manager.getNumSpeakers(), 2)
  
    assert.equal(manager.contains('fangjun'), true)
    assert.equal(manager.contains('leijun'), true)
  
    console.log('---All speakers---')
  
    console.log(manager.getAllSpeakerNames())
    console.log('------------')
  
    const testFiles = ['./sr-data/test/fangjun-test-sr-1.wav', './sr-data/test/leijun-test-sr-1.wav', './sr-data/test/liudehua-test-sr-1.wav']
  
    const threshold = 0.6
  
    for (let f of testFiles) {
      const embedding = computeEmbedding(extractor, f)
  
      let name = manager.search({ v: embedding, threshold: threshold })
      if (name == '') {
        name = '<Unknown>'
      }
      console.log(`${f}: ${name}`)
    }
  
    ok = manager.verify({
      name: 'fangjun',
      v: computeEmbedding(extractor, testFiles[0]),
      threshold: threshold
    })
  
    assert.equal(ok, true)
  
    ok = manager.remove('fangjun')
    assert.equal(ok, true)
  
    ok = manager.verify({
      name: 'fangjun',
      v: computeEmbedding(extractor, testFiles[0]),
      threshold: threshold
    })
    assert.equal(ok, false)
  
    assert.equal(manager.getNumSpeakers(), 1)
  
    // parentPort.postMessage(true)
    process.send(true)
  } catch (error) {
    process.send({ error: error.message })
  }
})

// try {
//   console.log(data)
//   let extractor
//   try {
//     console.log('extarctor')
//     extractor = createSpeakerEmbeddingExtractor()
//   } catch (error) {
//     console.log('createSpeakerEmbeddingExtractor error')
//     throw error
//   }

//   let manager
//   try {
//     console.log('manager')
//     manager = new sherpa_onnx.SpeakerEmbeddingManager(extractor.dim)
//   } catch (error) {
//     console.log('sherpa_onnx.SpeakerEmbeddingManager error')
//     throw error
//   }

//   // Please download test files from
//   // https://github.com/csukuangfj/sr-data
//   const spk1Files = ['./sr-data/enroll/fangjun-sr-1.wav', './sr-data/enroll/fangjun-sr-2.wav', './sr-data/enroll/fangjun-sr-3.wav']

//   let spk1Vec = []
//   for (let f of spk1Files) {
//     spk1Vec.push(computeEmbedding(extractor, f))
//   }

//   const spk2Files = ['./sr-data/enroll/leijun-sr-1.wav', './sr-data/enroll/leijun-sr-2.wav']

//   let spk2Vec = []
//   for (let f of spk2Files) {
//     spk2Vec.push(computeEmbedding(extractor, f))
//   }

//   let ok
//   try {
//     ok = manager.addMulti({ name: 'fangjun', v: spk1Vec })
//   } catch (error) {
//     console.log('manager.addMulti' + error)
//     throw error
//   }
//   console.log('debugger')
//   assert.equal(ok, true)

//   ok = manager.addMulti({ name: 'leijun', v: spk2Vec })
//   assert.equal(ok, true)

//   assert.equal(manager.getNumSpeakers(), 2)

//   assert.equal(manager.contains('fangjun'), true)
//   assert.equal(manager.contains('leijun'), true)

//   console.log('---All speakers---')

//   console.log(manager.getAllSpeakerNames())
//   console.log('------------')

//   const testFiles = ['./sr-data/test/fangjun-test-sr-1.wav', './sr-data/test/leijun-test-sr-1.wav', './sr-data/test/liudehua-test-sr-1.wav']

//   const threshold = 0.6

//   for (let f of testFiles) {
//     const embedding = computeEmbedding(extractor, f)

//     let name = manager.search({ v: embedding, threshold: threshold })
//     if (name == '') {
//       name = '<Unknown>'
//     }
//     console.log(`${f}: ${name}`)
//   }

//   ok = manager.verify({
//     name: 'fangjun',
//     v: computeEmbedding(extractor, testFiles[0]),
//     threshold: threshold
//   })

//   assert.equal(ok, true)

//   ok = manager.remove('fangjun')
//   assert.equal(ok, true)

//   ok = manager.verify({
//     name: 'fangjun',
//     v: computeEmbedding(extractor, testFiles[0]),
//     threshold: threshold
//   })
//   assert.equal(ok, false)

//   assert.equal(manager.getNumSpeakers(), 1)

//   parentPort.postMessage(true)
// } catch (error) {
//   parentPort.postMessage({ error: error.message })
// }

// Copyright (c)  2024  Xiaomi Corporation

// Please download models files from
// https://github.com/k2-fsa/sherpa-onnx/releases/tag/speaker-recongition-models
function createSpeakerEmbeddingExtractor() {
  // console.log('peakerEmbeddingExtractor')
  const config = {
    model: 'sherpa/wespeaker_zh_cnceleb_resnet34.onnx',
    numThreads: 1,
    debug: true
  }
  return new sherpa_onnx.SpeakerEmbeddingExtractor(config)
}

function computeEmbedding(extractor, filename) {
  // console.log('computeEmbedding')
  let stream
  try {
    stream = extractor.createStream()
  } catch (error) {
    console.log('create stream' + error)
    throw error
  }
  let wave
  try {
    wave = sherpa_onnx.readWave(filename, false)
  } catch (error) {
    console.log('read wave error' + error)
    throw error
  }
  try {
    stream.acceptWaveform({ sampleRate: wave.sampleRate, samples: wave.samples })
  } catch (error) {
    console.log('accept Wave form' + error)
    throw error
  }
  try {
    return extractor.compute(stream, false)
  } catch (error) {
    console.log('extractor.compute' + error)
    throw error 
  }
}
