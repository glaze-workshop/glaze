/*
https://docs.nestjs.com/pipes
*/

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'

@Injectable()
export class DecodeUrlComponentPipe implements PipeTransform {
  transform (value: any, metadata: ArgumentMetadata) {
    return decodeURIComponent(value)
  }
}
