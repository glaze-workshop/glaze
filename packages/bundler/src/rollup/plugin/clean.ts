import { Plugin } from 'rollup'
import * as path from 'path'
import * as fs from 'fs'
import rimraf from 'rimraf'
import { promisify } from 'util'

export default function clean (targets: string[]): Plugin {
  return {
    name: 'glaze-clean',
    async buildStart (options) {
      for (const target of targets) {
        const normalisedPath = path.normalize(target)
        if (fs.existsSync(normalisedPath)) {
          console.log(`cleaning path: ${normalisedPath}`)
          await promisify(rimraf)(normalisedPath)
        }
      }
    }
  }
}
