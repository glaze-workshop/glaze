export function writeToken (token: string) {
  if (token) {
    localStorage.setItem('glaze_token', token)
  }
}

export function getToken (): string {
  return localStorage.getItem('glaze_token') || ''
}

export function cleanToken () {
  return localStorage.removeItem('glaze_token')
}
