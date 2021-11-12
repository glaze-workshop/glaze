import { EnvType } from './type.js'

export function envExtract (env: EnvType) {
  return {
    isEnvDevelopment: env === 'development',
    isEnvProduction: env === 'production'
  }
}
