export const tryParse = (s: string): any => {
  try {
    return JSON.parse(s)
  } catch (e) {
    console.log('tryParse fail', e)
    return null
  }
}

export const tryStringify = (data: any): string => {
  try {
    return JSON.stringify(data)
  } catch (e) {
    console.log('tryStringify fail', e)
    return ''
  }
}
