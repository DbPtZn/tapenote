import * as fs from 'fs'
import sherpa_onnx from 'sherpa-onnx-node'
import assert from 'node:assert'

process.on('message', msg => {
  try {
    const extractor = createSpeakerEmbeddingExtractor()
    const manager = new sherpa_onnx.SpeakerEmbeddingManager(extractor.dim)

    // Please download test files from
    // https://github.com/csukuangfj/sr-data
    const spk1Files = ['./sr-data/enroll/fangjun-sr-1.wav', './sr-data/enroll/fangjun-sr-2.wav', './sr-data/enroll/fangjun-sr-3.wav']

    let spk1Vec = []
    for (let f of spk1Files) {
      spk1Vec.push(computeEmbedding(extractor, f))
    }

    const spk2Files = ['./sr-data/enroll/leijun-sr-1.wav', './sr-data/enroll/leijun-sr-2.wav']

    let spk2Vec = []
    for (let f of spk2Files) {
      spk2Vec.push(computeEmbedding(extractor, f))
    }

    let ok = manager.addMulti({ name: 'fangjun', v: spk1Vec })
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

    process.send(true)
  } catch (error) {
    process.send({ error: error.message })
  }
})

// Copyright (c)  2024  Xiaomi Corporation

// Please download models files from
// https://github.com/k2-fsa/sherpa-onnx/releases/tag/speaker-recongition-models
function createSpeakerEmbeddingExtractor() {
  const config = {
    model: 'sherpa/wespeaker_zh_cnceleb_resnet34.onnx',
    numThreads: 1,
    debug: true
  }
  return new sherpa_onnx.SpeakerEmbeddingExtractor(config)
}

function computeEmbedding(extractor, filename) {
  const stream = extractor.createStream()
  const wave = sherpa_onnx.readWave(filename)
  stream.acceptWaveform({ sampleRate: wave.sampleRate, samples: wave.samples })
  return extractor.compute(stream)
}
