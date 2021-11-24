import { rest } from 'msw'
import { delay } from '../utils/mock'
import { FULL_AUTH_LOGIN_PATH } from './auth.api'

export const AuthMockHandlers = [
  rest.post(FULL_AUTH_LOGIN_PATH, (req, res, ctx) => {
    const isAuthenticated = sessionStorage.getItem('username')
    if (!isAuthenticated) {
      return delay(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authenticated'
        })
      )
    }
    return delay(
      ctx.json({
        firstName: 'John'
      })
    )
  })
]
