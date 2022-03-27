import { PLUGIN_PREFIX } from '../prefix'
import axios from 'axios'
import { GlazePluginDto } from './plugin.dto'
import { GlazePluginEntity } from '../entity/plugin'
import { PermissionDeniedError } from '../errors'
import { compile } from 'path-to-regexp'

export const PLUGIN_PATH = ''
export const FULL_PLUGIN_PATH = PLUGIN_PREFIX

export const createOrUpdatePlugin = (glazePluginDto: GlazePluginDto) =>
  axios.post<GlazePluginEntity | PermissionDeniedError>(
    FULL_PLUGIN_PATH,
    glazePluginDto
  )

export interface GetPluginQueryParams {
  ownerTeamId?: number
}

export const getPlugins = (query: GetPluginQueryParams = {}) =>
  axios.get<GlazePluginEntity[]>(FULL_PLUGIN_PATH, { params: query })

export const PLUGIN_PATH_WITH_ID = ':pluginId'
export const FULL_PLUGIN_PATH_WITH_ID = `${PLUGIN_PREFIX}/${PLUGIN_PATH_WITH_ID}`
export const FULL_PLUGIN_PATH_WITH_ID_TO_PATH = (pluginId: string) =>
  compile<{ pluginId: string }>(FULL_PLUGIN_PATH_WITH_ID)({
    pluginId: encodeURIComponent(pluginId)
  })

export const getPluginById = (pluginId: string) =>
  axios.get<GlazePluginEntity>(FULL_PLUGIN_PATH_WITH_ID_TO_PATH(pluginId))
