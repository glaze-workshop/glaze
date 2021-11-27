import { Prisma } from '@prisma/client'

/**
 * Prisma 的错误代码，见 {@link 'https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes'}
 */
export enum PrismaErrorCode {
  /**
   * Unique 错误
   */
  UniqueConstraint = 'P2002'
}

/**
 * Unique 错误
 */
export interface UniqueConstraintError<T> extends Prisma.PrismaClientKnownRequestError {
  code: PrismaErrorCode.UniqueConstraint
  meta: {target: (keyof T)[]}
  message: string
}

export function isUniqueConstraintError<T> (error: unknown): error is UniqueConstraintError<T> {
  return error instanceof Prisma.PrismaClientKnownRequestError &&
   error.code === PrismaErrorCode.UniqueConstraint
}
