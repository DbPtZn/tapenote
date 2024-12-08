import { registerAs } from '@nestjs/config'

export default registerAs('limit', () => ({
  asrUsage: Number(process.env.ASR_USAGE_LIMIT) || 0,
  ttsUsage: Number(process.env.TTS_USAGE_LIMIT) || 0
}))
