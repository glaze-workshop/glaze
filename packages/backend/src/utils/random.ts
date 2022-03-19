import { customAlphabet } from 'nanoid'

const urlLowerCase = '0123456789_abcdefghijklmnopqrstuvwxyz-'

export const randomUrlLowerCase = (length = 11) => customAlphabet(urlLowerCase, length)
