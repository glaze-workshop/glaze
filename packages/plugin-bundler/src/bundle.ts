import { build } from 'esbuild'
import { GlazePath } from '@glaze/sdk-toolkit'
import { GlazeConfig } from '@glaze/types'
import * as path from 'path'

export function buildFiles (files: string[], watch = false) {
  return build({
    entryPoints: files,
    outdir: GlazePath.distPath,
    outbase: GlazePath.root,
    minify: !watch,
    target: 'es2020',
    bundle: true,
    sourcemap: true,
    watch
  })
}

export async function buildFileWithPanicByConfigFile (configFile: GlazeConfig) {
  const entries = configFile.plugins.map(plugin => plugin.main)
  const res = await buildFiles(entries)
  if (res.errors.length > 0) {
    process.exit(1)
  }
  console.log('Build complete.')
  return res
}

export function parseFilePathToOutput (filePath: string) {
  const parsedPath = path.parse(filePath)
  return path.join(GlazePath.distPath, parsedPath.dir, `${parsedPath.name}.js`)
}
