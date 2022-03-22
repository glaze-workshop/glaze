import { GlazePluginType } from '../entity/plugin'

export interface GlazePluginDto {
  id: string
  name: string
  desc?: string
  icon?: string
  path: string
  type?: GlazePluginType
  ownerTeamId: number
}
