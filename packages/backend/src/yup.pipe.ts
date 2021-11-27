/*
https://docs.nestjs.com/pipes
*/

import { GlazeErr } from '@glaze/common'
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { BaseSchema, ValidationError } from 'yup'

/**
 * yup 的校验逻辑
 */
@Injectable()
export class YupPipe implements PipeTransform {
  constructor (private schema: BaseSchema) {}

  async transform (value: any, metadata: ArgumentMetadata) {
    try {
      await this.schema.validate(value)
    } catch (e) {
      if (ValidationError.isError(e)) {
        throw new GlazeErr.GlazeValidationError(e)
      }
      throw e
    }

    return value
  }
}
