import { Entity } from '@glaze/common'

export interface ScreenshotJob {}

export interface DeploymentScreenshotJob {
  user: Entity.UserEntity
  deployment: Entity.DeploymentEntity
}
