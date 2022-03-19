import { useEffect } from 'react'
import axios from 'axios'
import { GlazeErr } from '@glaze/common'
import { getToken } from '../utils/token'

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { headers } = config
  const token = getToken()
  if (token && headers) {
    headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  // Do something with request error

  return Promise.reject(error)
})

export function useAxiosConfig () {
  useEffect(() => {
    // Add a response interceptor
    const jwtResponseInterceptor = axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

      const { data } = response
      if (GlazeErr.isGlazeError(data)) {
        if (data.status === GlazeErr.ErrorCode.JwtAuthError) {
          location.href = '/login?redirect=' + encodeURIComponent(location.href)
        }
      }
      return response
    }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
      return Promise.reject(error)
    })

    return () => {
      axios.interceptors.response.eject(jwtResponseInterceptor)
    }
  }, [])
}
