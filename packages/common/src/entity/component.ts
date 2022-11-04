import { CommonTimestamp } from './time'
import {
  DefaultSizeConfig,
  GlazePluginControl,
  PropsConfig
} from '@glaze/types'
import { UserEntity } from './user'
import { GlazePluginType } from './plugin'

export enum GlazeComponentTypeEnum {
  BUILD_IN = 'BUILD_IN',
  CUSTOM = 'CUSTOM'
}

export type GlazeComponentType = `${GlazeComponentTypeEnum}`

/**
 * Model GlazeComponent
 *
 */
export interface GlazeComponentEntity extends CommonTimestamp {
  id: string
  name: string
  desc?: string | null
  icon?: string | null
  type: GlazePluginType
  path: string
  props: PropsConfig<any>
  defaultSize: DefaultSizeConfig
  hasChildren?: boolean

  lastUpdateBy?: UserEntity
  ownerTeamId: number
}
