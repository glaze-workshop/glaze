// src/mocks/res.js
import { response, context, type ResponseTransformer } from 'msw'

export const delay = (...transformers: ResponseTransformer[]) => {
  // A custom response composition chain that embeds
  // a random realistic server response delay to each `res()` call.
  return response(...transformers, context.delay(1000))
}
