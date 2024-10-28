import { RawKeyAgent } from "@textbus/core"

export function isTargetKey(agent: RawKeyAgent) {
  if(agent.key === '/') return true
  // console.log(agent.key === 'Process' && agent.code === 'NumpadDivide' && agent.keyCode === 229)
  if(agent.key === 'Process' && agent.code === 'NumpadDivide' && agent.keyCode === 229) return true
  if(agent.key === 'Process' && agent.code === 'Slash' && agent.keyCode === 229) return true
  return false
}