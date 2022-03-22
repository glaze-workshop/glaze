import { PLUGIN_PREFIX } from '../prefix'
import axios from 'axios'
import { GlazePluginDto } from './plugin.dto'
import { GlazePluginEntity } from '../entity/plugin'
import { PermissionDeniedError } from '../errors'

export const PLUGIN_PATH = ''
export const FULL_PLUGIN_PATH = PLUGIN_PREFIX

export const createOrUpdatePlugin = (glazePluginDto: GlazePluginDto) =>
  axios.post<GlazePluginEntity | PermissionDeniedError>(FULL_PLUGIN_PATH, glazePluginDto)
