import { setupWorker, rest } from 'msw'
import { AuthApi, AuthDto, AuthMock } from '@glaze/common'

export const worker = setupWorker(
  ...AuthMock.AuthMockHandlers
)
