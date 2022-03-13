import { HeartbeatTrigger } from './lcp.type'

class SimpleHeartbeatTrigger implements HeartbeatTrigger<string, boolean> {
  next() {
    return '__SimpleHeartbeatTrigger'
  }

  check(data: boolean): boolean {
    return data
  }
}

export default SimpleHeartbeatTrigger
