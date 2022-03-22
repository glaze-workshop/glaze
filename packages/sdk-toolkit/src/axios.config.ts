import { GlazeErr } from '@glaze/common'
import axios from 'axios'
import { tokenHandler } from './token'
import { loginCommandAction } from './action'
const httpAdapter = require('axios/lib/adapters/http')

axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.defaults.adapter = httpAdapter

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { headers } = config
  const token = tokenHandler.getToken()
  if (token && headers) {
    headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  console.error(error)
  process.exit(1)
})

axios.interceptors.response.use(async function (response) {
  const { data } = response
  if (GlazeErr.isGlazeError(data)) {
    if (data.status === GlazeErr.ErrorCode.JwtAuthError) {
      console.error('登录信息失效，请「login」再进行其他操作')
      await loginCommandAction()
      process.exit(0)
    }
  }
  return response
}, function (error) {
  console.error(error)
  process.exit(1)
})
