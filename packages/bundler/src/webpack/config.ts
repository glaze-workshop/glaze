import { FullPath } from '../path.js'
import webpack, { Configuration } from 'webpack'
import { createCommonConfig } from './webpack.config.common.js'

export function createConfigFile (env: 'production' | 'development'): Configuration {
  return {
    mode: env,
    entry: FullPath.appIndex,
    output: {
      path: FullPath.appBuild,
      filename: '[name].js',
      chunkFilename: '[name].chunk.js'
    },
    ...createCommonConfig(env)
  }
}
