import { registerAs } from '@nestjs/config'

export default registerAs('sherpa', () => ({
  offline: {
    ttsConfig: {
      offlineTtsModelConfig: {
        offlineTtsVitsModelConfig: {
          model: 'sherpa//vits-zh-hf-fanchen-C/vits-zh-hf-fanchen-C.onnx',
          lexicon: 'sherpa/vits-zh-hf-fanchen-C/lexicon.txt',
          tokens: 'sherpa/vits-zh-hf-fanchen-C/tokens.txt',
          dataDir: '',
          noiseScale: 0.667,
          noiseScaleW: 0.8,
          lengthScale: 1.0
        },
        numThreads: 1,
        debug: 1,
        provider: 'cpu'
      },
      ruleFsts: 'sherpa/vits-zh-hf-fanchen-C/rule.fst',
      maxNumSentences: 1
    },
    asrConfig: {
      featConfig: {
        sampleRate: 16000,
        featureDim: 80
      },
      modelConfig: {
        transducer: {
          encoder: '',
          decoder: '',
          joiner: ''
        },
        paraformer: {
          model: 'sherpa/sherpa-onnx-paraformer-zh-2023-09-14/model.int8.onnx'
        },
        nemoCtc: {
          model: ''
        },
        whisper: {
          encoder: '',
          decoder: '',
          language: '',
          task: ''
        },
        tdnn: {
          model: ''
        },
        tokens: 'sherpa/sherpa-onnx-paraformer-zh-2023-09-14/tokens.txt',
        numThreads: 1,
        debug: 0,
        provider: 'cpu',
        modelType: 'paraformer'
      },
      lmConfig: {
        model: '',
        scale: 1.0
      },
      decodingMethod: 'greedy_search',
      maxActivePaths: 4,
      hotwordsFile: '',
      hotwordsScore: 1.5
    }
  }
}))
