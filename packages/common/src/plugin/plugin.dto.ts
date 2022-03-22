import { GlazePluginType } from '../entity/plugin'
import type { GlazePluginControl } from '@glaze/types'

export interface GlazePluginDto {
  id: string
  name: string
  desc?: string
  icon?: string
  path: string
  type?: GlazePluginType
  configSchema?: Record<string, GlazePluginControl>
  ownerTeamId: number
}
