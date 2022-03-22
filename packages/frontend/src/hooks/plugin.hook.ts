import { PluginApi } from '@glaze/common'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export function usePlugins (ownerTeamId?: number) {
  const pluginsQuery = useQuery([PluginApi.FULL_PLUGIN_PATH, ownerTeamId], () => PluginApi.getPlugins({ ownerTeamId }))
  const pluginsInfo = useMemo(() => pluginsQuery.data?.data, [pluginsQuery.data])
  return { pluginsQuery, pluginsInfo }
}

export function usePluginParamId () {
  const { pluginId: pluginIdRaw } = useParams<{pluginId: string}>()
  return useMemo(() => decodeURIComponent(pluginIdRaw!), [pluginIdRaw])
}

export function usePluginById (pluginId: string) {
  const pluginQuery = useQuery(PluginApi.FULL_PLUGIN_PATH_WITH_ID_TO_PATH(pluginId), () => PluginApi.getPluginById(pluginId))
  const pluginInfo = useMemo(() => pluginQuery.data?.data, [pluginQuery.data])
  return { pluginQuery, pluginInfo }
}
