import { GlazePluginType } from '../entity'
import { DefaultSizeConfig, PropsConfig } from '@glaze/types'

export interface GlazeComponentDto {
  id: string
  name: string
  desc?: string | null
  icon?: string
  path: string
  type?: GlazePluginType
  props: PropsConfig<any>
  defaultSize: DefaultSizeConfig
  hasChildren?: boolean

  ownerTeamId: number
}
