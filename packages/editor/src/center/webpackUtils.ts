import { Configuration, webpack } from 'webpack'
import { componentStaticPrefix } from './config'
import { parseComponentFilename, parseComponentFilePathDir, parseComponentTargetPath } from '@glaze/sdk-toolkit'

/**
 * Create base config
 */
const createWebpackConfigBase = (entry: string, path: string, filename: string): Configuration => {
  return {
    mode: 'development',
    entry, // override
    output: {
      path, // override
      library: {
        // type: 'umd'
        type: 'system'
      },
      filename // override
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    module: {
      rules: [
        {
          test: /.(jsx?|tsx?)/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
          }
        }
      ]
    },
    externals: {
      react: 'app:react',
      'react-dom': 'app:react-dom'
    }
  }
}

/**
 * Create compiler for component
 */
export const createComponentCompiler = (file: string) => {
  const config = createWebpackConfigBase(file, parseComponentFilePathDir(file), parseComponentFilename(file))
  return webpack(config)
}

/**
 * Webpack compiled target component result
 */
export const componentTargetPath = (file: string) => `${componentStaticPrefix}/${parseComponentTargetPath(file)}`
