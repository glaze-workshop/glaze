export * from './time'
export * from './user'

export type PureEntity<T> =
  Omit<T, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: number
    createdAt?: Date
    updatedAt?: Date
  }
