import { Configuration } from 'webpack'
import { RollupWatchOptions } from 'rollup'
import { FullPath } from './path.js'

export interface CommonConfig {
  name: string
  tsconfigPath: string
}

export interface WebpackCustomConfig extends CommonConfig {
  port: number
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

export const WebpackConfig: WebpackCustomConfig = await requireNullable(FullPath.glazeWebpackConfig) || defaultConfig
export const RollupConfig: RollupCustomConfig = await requireNullable(FullPath.glazeRollupConfig) || defaultConfig

async function requireNullable (modulePath: string) { // force require
  try {
    const pkg = await import(modulePath)
    return pkg.default
  } catch (e) {
    return false
  }
}
