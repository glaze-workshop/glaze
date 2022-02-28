import { AbstractError } from './basic'

export * from './basic'
export * from './error.code'
export * from './auth'

export function isGlazeError<T extends AbstractError> (data: T | unknown): data is T {
  return typeof data === 'object' && data !== null && 'error' in data && (data as any).error === true
}
