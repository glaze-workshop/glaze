import { Command } from 'commander'
import { EnvType } from './type.js'
import { run as rollupRun } from './rollup/run.js'
import { run as webpackRun } from './webpack/run.js'
import process from 'process'

const program = new Command()

program
  .option('-w, --webpack', 'webpack 核心')
  .option('-r, --rollup', 'rollup 核心')
  .option('-d, --dev', 'development 模式')
  .option('-b, --build', 'production 模式')
  .parse()

const options = program.opts<{webpack: boolean; rollup: boolean; dev: boolean; build: boolean}>()

if (options.webpack && options.rollup) {
  console.warn('webpack 和 rollup 不能同时开启')
}

if (options.dev && options.build) {
  console.warn('dev 和 build 不能同时开启')
}

const env: EnvType = options.dev ? 'development' : 'production'
process.env.BABEL_ENV = env
process.env.NODE_ENV = env

if (options.rollup) {
  rollupRun(env)
}
if (options.webpack) {
  webpackRun(env)
}

export type { WebpackCustomConfig, RollupCustomConfig } from './custom.js'
