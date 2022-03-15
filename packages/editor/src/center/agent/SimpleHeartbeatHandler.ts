import { HeartbeatHandler } from '@glaze/common'

class SimpleHeartbeatHandler implements HeartbeatHandler<string, boolean> {
  handleNext(): boolean {
    return true
  }
}

export default SimpleHeartbeatHandler
