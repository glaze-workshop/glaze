import path from 'path'

import { PORT } from '../config'

export const componentsRootPath = path.resolve(__dirname, '../components')
export const componentsTargetPath = path.resolve(__dirname, '../../lib/')
export const componentStaticPrefix = `http://localhost:${PORT}/component`
