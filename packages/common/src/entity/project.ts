import type { JsonValue } from 'type-fest'
import { CommonTimestamp } from './time'

export interface ProjectEntity extends CommonTimestamp {
  id: number
  /**
   * 项目名称
   */
  name?: string | null
  /**
   * 介绍
   */
  intro?: string | null
  preview?: string | null
  projectFolderId: number
  document?: JsonValue
  documentBytes?: Buffer | null
}
