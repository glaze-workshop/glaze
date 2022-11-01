import { bold, cyan, dim, underline, red, green } from 'colorette'
import { EnvType } from '../type.js'
import { createRollupFullConfig } from './config.js'
import { RollupConfig } from '../custom.js'
import { envExtract } from '../utils.js'
import {
  rollup,
  RollupError,
  RollupWatcher,
  RollupWatchOptions,
  VERSION,
  watch,
} from 'rollup'
import ms from 'pretty-ms'
import dateTime from 'date-time'

export const stderr = console.error.bind(console)

export function run(env: EnvType) {
  const config = createRollupFullConfig(RollupConfig, env)
  const customizedConfig = RollupConfig.customConfig?.(config) ?? config

  const { isEnvDevelopment } = envExtract(env)
  if (isEnvDevelopment) {
    startWatching(customizedConfig)
  } else {
    build(customizedConfig)
  }
}

//#region rollup cli source code
/**
 * watch 开始
 * @private
 * @param configs 配置
 */
function startWatching(configs: RollupWatchOptions) {
  let watcher: RollupWatcher
  try {
    watcher = watch(configs)
  } catch (err: any) {
    return handleError(err)
  }

  watcher.on('event', (event) => {
    switch (event.code) {
      case 'ERROR':
        handleError(event.error, true)
        break

      case 'START':
        cyan(underline(`rollup v${VERSION}`))
        break

      case 'BUNDLE_START':
        // eslint-disable-next-line no-case-declarations
        let input = event.input
        if (typeof input !== 'string') {
          input = Array.isArray(input)
            ? input.join(', ')
            : Object.values(input as Record<string, string>).join(', ')
        }
        stderr(cyan(`bundles ${bold(input)}...`))
        break

      case 'BUNDLE_END':
        stderr(green(`created in ${bold(ms(event.duration))}`))
        break

      case 'END':
        stderr(`\n[${dateTime()}] waiting for changes...`)
    }

    if ('result' in event && event.result) {
      event.result
        .close()
        .catch((error: RollupError) => handleError(error, true))
    }
  })
}

async function build(inputOptions: RollupWatchOptions): Promise<unknown> {
  const outputOptions = Array.isArray(inputOptions.output)
    ? inputOptions.output
    : inputOptions.output
    ? [inputOptions.output]
    : []

  const start = Date.now()
  const useStdout = !outputOptions[0].file && !outputOptions[0].dir

  try {
    const bundle = await rollup(inputOptions)
    if (useStdout) {
      const output = outputOptions[0]
      if (output.sourcemap && output.sourcemap !== 'inline') {
        handleError({
          code: 'ONLY_INLINE_SOURCEMAPS',
          message:
            'Only inline sourcemaps are supported when bundling to stdout.',
        })
      }
      const { output: outputs } = await bundle.generate(output)
      for (const file of outputs) {
        let source: string | Uint8Array
        if (file.type === 'asset') {
          source = file.source
        } else {
          source = file.code
        }
        if (outputs.length > 1)
          process.stdout.write(`\n${cyan(bold(`//→ ${file.fileName}:`))}\n`)
        process.stdout.write(source as Buffer)
      }
      return
    }
    stderr(green(`created in ${bold(ms(Date.now() - start))}`))

    await Promise.all(outputOptions.map(bundle.write))
    await bundle.close()
  } catch (e: any) {
    handleError(e)
  }
}
/**
 * 处理错误
 *
 * @private
 * @param err 错误
 * @param recover 是否重启
 */
function handleError(err: RollupError, recover = false): void {
  let description = err.message || err
  if (err.name) description = `${err.name}: ${description}`
  const message =
    (err.plugin ? `(plugin ${err.plugin}) ${description}` : description) || err

  stderr(bold(red(`[!] ${bold(message.toString())}`)))

  if (err.url) {
    stderr(cyan(err.url))
  }

  if (err.loc) {
    stderr(`${err.loc.file || err.id} (${err.loc.line}:${err.loc.column})`)
  }

  if (err.frame) {
    stderr(dim(err.frame))
  }

  if (err.stack) {
    stderr(dim(err.stack))
  }

  stderr('')

  if (!recover) process.exit(1)
}

//#endregion
