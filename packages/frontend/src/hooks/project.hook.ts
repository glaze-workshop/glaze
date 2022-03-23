import { ProjectApi } from '@glaze/common'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export function useProjectInfo(projectId: number) {
  return useQuery([ProjectApi.FULL_PROJECT_PATH_WITH_ID, projectId], () =>
    ProjectApi.getProject(projectId)
  )
}

export function useProjectInfoUnderParam() {
  const { projectId } = useParams<{ projectId: string }>()
  const projectIdNum = useMemo(() => Number(projectId), [projectId])
  const projectQuery = useProjectInfo(projectIdNum)
  const projectInfo = useMemo(() => projectQuery.data?.data, [projectQuery.data])

  return {
    projectInfo,
    projectQuery,
    projectId: projectIdNum
  }
}

export function useProjectUsedPlugins(projectId: number) {
  const pluginsQuery = useQuery(
    ProjectApi.FULL_PROJECT_USED_PLUGIN_PATH_TO_PATH({ id: projectId }),
    () => ProjectApi.getProjectPlugins(projectId)
  )
  const pluginsInfo = useMemo(() => pluginsQuery.data?.data, [pluginsQuery.data])
  return { pluginsInfo, pluginsQuery }
}

export function useProjectUsedPlugin(projectId: number, pluginId: string) {
  const projectUsedPluginQuery = useQuery(
    ProjectApi.FULL_PROJECT_USED_PLUGIN_PATH_WITH_ID_TO_PATH(projectId, pluginId),
    () => ProjectApi.getProjectPluginRelationship(projectId, pluginId)
  )
  const projectUsedPluginInfo = useMemo(
    () => projectUsedPluginQuery.data?.data,
    [projectUsedPluginQuery.data]
  )
  return { projectUsedPluginInfo, projectUsedPluginQuery }
}
