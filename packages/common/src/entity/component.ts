import { CommonTimestamp } from './time'

export enum GlazeComponentTypeEnum {
  BUILD_IN = 'BUILD_IN',
  CUSTOM = 'CUSTOM'
};

export type GlazeComponentType = `${GlazeComponentTypeEnum}`

/**
 * Model GlazeComponent
 *
 */
export interface ComponentEntity extends CommonTimestamp {
  id: string
  /**
   * 组件名称
   */
  name?: string | null
  /**
   * 图标
   */
  icon?: string | null
  ownerId: number | null
  type: GlazeComponentType
}
