import { GlazePath } from './path'
import { GlazeConfig } from '@glaze/types'

export function requireOrNull<T> (path: string): T | null {
  try {
    return require(path)
  } catch (e) {
    return null
  }
}

export function readPluginConfigFile () {
  return requireOrNull<GlazeConfig>(GlazePath.pluginConfigPath)
}
