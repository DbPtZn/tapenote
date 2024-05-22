import { registerAs } from '@nestjs/config'

export default registerAs('sherpa', () => ({
  model: {
    tts: 'vits-zh-hf-fanchen-C',
    asr: 'sherpa-onnx-paraformer-zh-2023-09-14'
  },
  offline: {
    ttsConfig: {
      model: {
        vits: {
          model: 'sherpa/vits-zh-hf-fanchen-C/vits-zh-hf-fanchen-C.onnx',
          tokens: 'sherpa/vits-zh-hf-fanchen-C/tokens.txt',
          lexicon: 'sherpa/vits-zh-hf-fanchen-C/lexicon.txt',
          dictDir: 'sherpa/vits-zh-hf-fanchen-C/dict'
        },
        debug: true,
        numThreads: 2,
        provider: 'cpu'
      },
      maxNumStences: 1,
      ruleFsts: [
        'sherpa/vits-zh-hf-fanchen-C/date.fst',
        'sherpa/vits-zh-hf-fanchen-C/phone.fst',
        'sherpa/vits-zh-hf-fanchen-C/number.fst',
        'sherpa/vits-zh-hf-fanchen-C/new_heteronym.fst'
      ].join(','),
      ruleFars: ''
    },
    asrConfig: {
      featConfig: {
        sampleRate: 16000,
        featureDim: 80
      },
      modelConfig: {
        paraformer: {
          model: 'sherpa/sherpa-onnx-paraformer-zh-2023-09-14/model.int8.onnx'
        },
        tokens: 'sherpa/sherpa-onnx-paraformer-zh-2023-09-14/tokens.txt',
        numThreads: 2,
        provider: 'cpu',
        debug: 1
      }
    },
    punctConfig: {
      model: {
        ctTransformer: 'sherpa/sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12/model.onnx',
        debug: true,
        numThreads: 1,
        provider: 'cpu'
      }
    }
  }
}))
// offline: {
//   ttsConfig: {
//     offlineTtsModelConfig: {
//       offlineTtsVitsModelConfig: {
//         model: 'sherpa/vits-zh-hf-fanchen-C/vits-zh-hf-fanchen-C.onnx',
//         lexicon: 'sherpa/vits-zh-hf-fanchen-C/lexicon.txt',
//         tokens: 'sherpa/vits-zh-hf-fanchen-C/tokens.txt',
//         dataDir: '',
//         noiseScale: 0.667,
//         noiseScaleW: 0.8,
//         lengthScale: 1.0
//       },
//       numThreads: 1,
//       debug: 1,
//       provider: 'cpu'
//     },
//     ruleFsts: [
//       'sherpa/vits-zh-hf-fanchen-C/phone.fst',
//       'sherpa/vits-zh-hf-fanchen-C/number.fst',
//       'sherpa/vits-zh-hf-fanchen-C/new_heteronym.fst'
//     ].join(','),
//     ruleFars: '',
//     maxNumSentences: 1
//   },
//   asrConfig: {
//     featConfig: {
//       sampleRate: 16000,
//       featureDim: 80
//     },
//     modelConfig: {
//       transducer: {
//         encoder: '',
//         decoder: '',
//         joiner: ''
//       },
//       paraformer: {
//         model: 'sherpa/sherpa-onnx-paraformer-zh-2023-09-14/model.int8.onnx'
//       },
//       nemoCtc: {
//         model: ''
//       },
//       whisper: {
//         encoder: '',
//         decoder: '',
//         language: '',
//         task: ''
//       },
//       tdnn: {
//         model: ''
//       },
//       tokens: 'sherpa/sherpa-onnx-paraformer-zh-2023-09-14/tokens.txt',
//       numThreads: 1,
//       debug: 0,
//       provider: 'cpu',
//       modelType: 'paraformer'
//     },
//     lmConfig: {
//       model: '',
//       scale: 1.0
//     },
//     decodingMethod: 'greedy_search',
//     maxActivePaths: 4,
//     hotwordsFile: '',
//     hotwordsScore: 1.5
//   }
// }
