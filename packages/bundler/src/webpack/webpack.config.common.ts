import { Configuration as WebpackConfiguration } from 'webpack'
import 'webpack-dev-server'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { EnvType } from '../type.js'
import { FullPath } from '../path.js'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { createRequire } from 'module'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
const require = createRequire(import.meta.url)
const webpack = require('webpack')

// style files regexes
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

export const createCommonConfig = (env: EnvType): WebpackConfiguration => {
  const isEnvDevelopment = env === 'development'
  const isEnvProduction = env === 'production'

  // common function to get style loaders
  const getStyleLoaders = (cssOptions: any, preProcessor?: string) => {
    const loaders = [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: cssOptions
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: [
              'postcss-import',
              'tailwindcss',
              'autoprefixer',
              'postcss-flexbugs-fixes',
              [
                'postcss-preset-env',
                {
                  autoprefixer: {
                    flexbox: 'no-2009'
                  },
                  stage: 3
                }
              ],
              // Adds PostCSS Normalize as the reset css with default options,
              // so that it honors browserslist config in package.json
              // which in turn let's users customize the target behavior as per their needs.
              'postcss-normalize'
            ]
          }
        }
      }
    ].filter(Boolean)
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            root: FullPath.appPath
          }
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true
          }
        }
      )
    }
    return loaders
  }

  return {
    devtool: isEnvDevelopment ? 'eval-cheap-source-map' : undefined,
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ProvidePlugin({
        PIXI: 'pixi.js'
      }),
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
      isEnvDevelopment && new ReactRefreshWebpackPlugin(),
      isEnvProduction && new MiniCssExtractPlugin(),
      isEnvProduction && new BundleAnalyzerPlugin({ analyzerMode: 'static' })
    ].filter(Boolean) as any[],
    module: {
      rules: [{
        test: /\.(jsx?|tsx?)$/i,
        exclude: [/node_modules/],
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['last 2 versions']
                  },
                  modules: false
                }],
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [!isEnvProduction && require('react-refresh/babel')].filter(Boolean),
              cacheDirectory: true,
              // See #6846 for context on why cacheCompression is disabled
              cacheCompression: false,
              compact: isEnvProduction
            }
          }

        ]
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use MiniCSSExtractPlugin to extract that CSS
      // to a file, but in development "style" loader enables hot editing
      // of CSS.
      // By default we support CSS Modules with the extension .module.css
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          modules: {
            mode: 'icss'
          }
        }),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true
      },
      // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
      // using the extension .module.css
      {
        test: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          modules: {
            mode: 'local'
          }
        })
      },
      // Opt-in support for SASS (using .scss or .sass extensions).
      // By default we support SASS Modules with the
      // extensions .module.scss or .module.sass
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            modules: {
              mode: 'icss'
            }
          },
          'sass-loader'
        ),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true
      },
      // Adds support for CSS Modules, but using SASS
      // using the extension .module.scss or .module.sass
      {
        test: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            modules: {
              mode: 'local'
            }
          },
          'sass-loader'
        )
      }]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    optimization: {
      usedExports: true
    }
  }
}
