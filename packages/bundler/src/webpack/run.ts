import { EnvType } from '../type.js'
import { createConfigFile } from './config.js'
import Webpack from 'webpack'
import DevServer from 'webpack-dev-server'
import { WebpackConfig } from '../custom.js'
import { FullPath } from '../path.js'
const { webpack } = Webpack

export async function run (env: EnvType) {
  const config = createConfigFile(env)
  const compiler = webpack(config)
  if (env === 'development') {
    const server = new DevServer({
      hot: true,
      port: WebpackConfig.port,
      historyApiFallback: true,
      static: {
        directory: FullPath.appPublic
      },
      proxy: WebpackConfig.proxy
    }, compiler)
    await server.start()
    console.log('dev server is running')
  } else {
    return new Promise<void>((resolve) => {
      compiler.run((err, stats) => {
        if (err || stats?.hasErrors()) {
          console.error(err?.message)
          console.error(err?.stack)
        }
        if (stats) {
          console.log(stats?.toString({
            chunks: false, // Makes the build much quieter
            colors: true // Shows colors in the console
          }))
        }
        resolve()
      })
    })
  }
}
