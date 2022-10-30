import path from 'path'
import fs from 'fs'
import process from 'process'

const appDirectory = fs.realpathSync(process.cwd())

export const resolveApp = (relativePath: string): string =>
  path.resolve(appDirectory, relativePath)

export const GlazePath = Object.freeze({
  root: resolveApp('.'),
  pluginConfigPath: resolveApp('glaze.plugin.js'),
  componentConfigPath: resolveApp('glaze.component.js'),
  distPath: resolveApp('dist'),
})
