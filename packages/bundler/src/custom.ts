import { Configuration } from 'webpack'
import { RollupWatchOptions } from 'rollup'
import { FullPath } from './path.js'
import { createRequire } from 'module'
import { ProxyConfigArray, ProxyConfigMap } from 'webpack-dev-server'

export interface CommonConfig {
  name: string
  tsconfigPath: string
}

export interface WebpackCustomConfig extends CommonConfig {
  port: number
  proxy?: ProxyConfigMap | ProxyConfigArray
  customConfig?: (options: Configuration) => Configuration
}

export interface RollupCustomConfig extends CommonConfig {
  customConfig?: (options: RollupWatchOptions) => RollupWatchOptions
}

const defaultConfig: WebpackCustomConfig | RollupCustomConfig = {
  name: 'index',
  tsconfigPath: 'tsconfig.build.json',
  port: 12333
}

export const WebpackConfig: WebpackCustomConfig = {
  ...defaultConfig,
  ...(await requireNullable(FullPath.glazeWebpackConfig))
}

export const RollupConfig: RollupCustomConfig = {
  ...defaultConfig,
  ...(await requireNullable(FullPath.glazeRollupConfig))
}

async function requireNullable (modulePath: string) { // force require
  try {
    const pkg = await import(modulePath)
    return pkg.default
  } catch (e) {
    return null
  }
}
