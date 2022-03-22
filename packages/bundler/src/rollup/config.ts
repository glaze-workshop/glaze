import { EnvType } from '../type.js'
import { FullPath } from '../path.js'
import { OutputOptions, RollupWatchOptions } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
import sourceMaps from 'rollup-plugin-sourcemaps'
import resolve, {
  DEFAULTS as RESOLVE_DEFAULTS
} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { envExtract } from '../utils.js'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import clean from './plugin/clean.js'
import { RollupCustomConfig } from '../custom'

export function createRollupFullConfig (config: RollupCustomConfig, env: EnvType): RollupWatchOptions {
  const { isEnvProduction } = envExtract(env)

  const outputCommon: OutputOptions = {
    // Do not let Rollup call Object.freeze() on namespace import objects
    // (i.e. import * as namespaceImportObject from...) that are accessed dynamically.
    freeze: false,
    // Respect tsconfig esModuleInterop when setting __esModule.
    name: config.name,
    sourcemap: true,
    globals: { react: 'React', 'react-native': 'ReactNative' },
    exports: 'named'
  }

  return {
    input: FullPath.appIndex,
    output: [{
      ...outputCommon,
      file: `${FullPath.appBuild}/${config.name}.cjs.js`,
      format: 'cjs',
      plugins: (isEnvProduction && config.tenser) ? [terser()] : []
    }, {
      ...outputCommon,
      file: `${FullPath.appBuild}/${config.name}.esm.js`,
      format: 'esm'
    }],
    plugins: [
      isEnvProduction && clean([FullPath.appBuild]),
      peerDepsExternal(),
      resolve({
        mainFields: [
          'module',
          'main',
          'browser'
        ],
        extensions: [...RESOLVE_DEFAULTS.extensions, '.jsx']
      }),
      // all bundled external modules need to be converted from CJS to ESM
      commonjs({
        // use a regex to make sure to include eventual hoisted packages
        include: /\/node_modules\//
      }),
      json(),
      typescript({
        tsconfig: FullPath.defaultTsBuildPath,
        tsconfigDefaults: {
          exclude: [
            // all TS test files, regardless whether co-located or in test/ etc
            '**/*.spec.ts',
            '**/*.test.ts',
            '**/*.spec.tsx',
            '**/*.test.tsx',
            '**/*.stories.tsx',
            // TS defaults below
            'node_modules',
            'bower_components',
            'jspm_packages',
            'example'
          ],
          compilerOptions: {
            sourceMap: true,
            declaration: true,
            declarationMap: true,
            jsx: 'react'
          }
        },
        check: true
      }),
      sourceMaps()
    ].filter(Boolean)
  }
}
