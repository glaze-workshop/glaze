import { useQuery } from 'react-query'
import { useMemo } from 'react'
import { useProjectInfoUnderParam } from './project.hook'
import { DeploymentApi } from '@glaze/common'

export function useProjectDeploymentInfo () {
  const { projectId } = useProjectInfoUnderParam()
  const key = useMemo(() => DeploymentApi.FULL_DEPLOYMENT_PATH_TO_PATH({ projectId }), [projectId])
  const deploymentQueryInfo = useQuery(key, () => DeploymentApi.getProjectDeployment(projectId))
  const deploymentInfo = useMemo(() => deploymentQueryInfo.data?.data, [deploymentQueryInfo.data])

  return {
    deploymentInfo,
    deploymentQueryInfo,
    projectId
  }
}
