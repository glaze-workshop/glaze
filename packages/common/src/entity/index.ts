export * from './time'
export * from './user'
export * from './team'
export * from './project'
export * from './component'
export * from './folder'
export * from './jwt'
export { DeploymentEntity } from './deployment'

export type PureEntity<T> =
  Omit<T, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: number
    createdAt?: Date
    updatedAt?: Date
  }
