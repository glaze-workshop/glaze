import { context, response, type ResponseTransformer } from 'msw'

/**
 * msw 的延长返回时间 transformer
 */
export const delay = (...transformers: ResponseTransformer[]) => {
  // A custom response composition chain that embeds
  // a random realistic server response delay to each `res()` call.
  return response(...transformers, context.delay(1000))
}
