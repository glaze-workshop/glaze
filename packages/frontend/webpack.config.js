// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
// eslint-disable-next-line no-unused-vars
const { Configuration, HotModuleReplacementPlugin } = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : 'style-loader'

/** @type {Configuration} */
const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    open: true,
    hot: true,
    host: 'localhost',
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: "./tsconfig.build.json",
        diagnosticOptions: {
          semantic: true,
          syntactic: true
        },
        mode: 'write-references',
        loader: { infrastructure: 'silent', issues: 'console', devServer: false }
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/i,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [!isProduction && require('react-refresh/babel')].filter(Boolean)
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('postcss-import'),
                require('tailwindcss'),
                require('autoprefixer')
              ]
            }
          }
        }]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset'
      }

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}

module.exports = () => {
  if (isProduction) {
    config.mode = 'production'

    config.plugins.push(new MiniCssExtractPlugin())

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW())
  } else {
    config.mode = 'development'
    config.devtool = 'eval-cheap-source-map'

    config.plugins.push(new HotModuleReplacementPlugin())

    config.plugins.push(new ReactRefreshWebpackPlugin())
  }
  return config
}
