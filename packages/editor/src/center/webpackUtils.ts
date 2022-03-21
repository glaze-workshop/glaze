import path from 'path'
import { webpack } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

import { CompilerCreatorOptions } from './type'
import { componentStaticPrefix } from './config'

/**
 * Create base config
 */
const createWebpackConfigBase = () => {
  return {
    mode: 'development',
    entry: '', // override
    output: {
      path: path.join(__dirname, '../../lib'),
      library: {
        // type: 'umd'
        type: 'system'
      },
      filename: '' // override
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    module: {
      rules: [
        {
          test: /.(jsx?|tsx?)/,
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [new CleanWebpackPlugin()],
    externals: {
      react: 'app:react',
      'react-dom': 'app:react-dom'
    }
  }
}

/**
 * Create compiler for component
 */
export const createComponentCompiler = ({ componentName, entry, onUpdate }: CompilerCreatorOptions) => {
  const config = createWebpackConfigBase()

  config.entry = entry
  config.output.path = `${config.output.path}/${componentName}`
  config.output.filename = `${componentName}-[hash:5].js`
  // console.log('config', config)

  // @ts-ignore
  const compiler = webpack(config)

  compiler.watch({}, (_, stats) => {
    onUpdate({ hash: stats.hash.substring(0, 5) })
  })

  return compiler
}

/**
 * Webpack compiled target component result
 */
export const componentTargetPath = (componentName: string, hash: string) =>
  `${componentStaticPrefix}/${componentName}/${componentName}-${hash}.js`
