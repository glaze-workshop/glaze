import { ProjectEntity } from './project'
import { TeamEntity } from './team'
import { CommonTimestamp } from './time'

/**
 * 文件夹类型
 */

export enum GlazeFolderTypeEnum {
  /** 只关联未创建文件夹的项目，但展示所有 */
  ALL = 'ALL',
  /** 只关联已创建文件夹的项目，但展示所有 */
  CUSTOM = 'CUSTOM',
  /** 存档用的文件夹 */
  ARCHIVED = 'ARCHIVED'
}
;
export type GlazeFolderType = `${GlazeFolderTypeEnum}`

export interface ProjectFolderEntity extends CommonTimestamp {
  id: number
  /**
   * 文件夹名称
   */
  name: string
  /**
   * 图标
   */
  teamId: number

  /**
   * 文件夹类型
   */
  type: GlazeFolderType

  /**
   * 项目列表
   */
  projects?: ProjectEntity[]

  team?: TeamEntity
}
