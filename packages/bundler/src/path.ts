import * as fs from 'fs'
import * as path from 'path'
import * as process from 'process'

const appDirectory = fs.realpathSync(process.cwd())

export const resolveApp = (relativePath: string): string => path.resolve(appDirectory, relativePath)

export const FullPath = {
  appPath: resolveApp('.'),
  glazeWebpackConfig: resolveApp('glaze.webpack.mjs'),
  glazeRollupConfig: resolveApp('glaze.rollup.mjs'),
  defaultTsBuildPath: resolveApp('tsconfig.build.json'),
  appIndex: resolveApp('./src/index.ts'),
  appBuild: resolveApp('./dist'),
  appHtml: resolveApp('./public/index.html'),
  appPublic: resolveApp('./public'),
  appSrc: resolveApp('src'),

  extensionPublic: resolveApp('./public/manifest.json'),
  extensionBackground: resolveApp('./src/background.ts'),
  extensionContent: resolveApp('./src/content.ts')
}
