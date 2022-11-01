import path from 'path'
import fs from 'fs'
import process from 'process'

const appDirectory = fs.realpathSync(process.cwd())

export const resolveApp = (relativePath: string): string =>
  path.resolve(appDirectory, relativePath)

export const GlazePath = Object.freeze({
  root: resolveApp('.'),
  pluginConfigPath: resolveApp('glaze.plugin.js'),
  distPath: resolveApp('dist'),
  componentDistPath: resolveApp('dist.components'),
})

export function parsePluginFilePathToOutput(filePath: string) {
  const parsedPath = path.parse(filePath)
  return path.join(GlazePath.distPath, parsedPath.dir, `${parsedPath.name}.js`)
}

export function parseComponentFilePathDir(filePath: string) {
  const parsedPath = path.parse(filePath)
  return path.join(GlazePath.componentDistPath, parsedPath.dir)
}

export function parseComponentFilename(filePath: string) {
  const parsedPath = path.parse(filePath)
  return `${parsedPath.name}.js`
}

export function parseComponentTargetPath(filePath: string) {
  const parsedPath = path.parse(filePath)
  return `${parsedPath.dir}/${parsedPath.name}.js`
}
