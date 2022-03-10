const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: '', // override
  output: {
    path: path.join(__dirname, 'lib'),
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
    react: 'react',
    'react-dom': 'react-dom'
  }
}
