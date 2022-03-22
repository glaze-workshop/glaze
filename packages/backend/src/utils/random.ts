import { customAlphabet } from 'nanoid'

const urlLowerCase = '0123456789_abcdefghijklmnopqrstuvwxyz-'
const nanoid = customAlphabet(urlLowerCase)

export const randomUrlLowerCase = (length = 11) => nanoid(length)
