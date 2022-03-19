import { useQuery } from 'react-query'
import { useMemo } from 'react'
import { useProjectInfoUnderParam } from './project.hook'
import { DeploymentApi } from '@glaze/common'

export function useProjectDeploymentInfo () {
  const { projectId } = useProjectInfoUnderParam()
  const deploymentQueryInfo = useQuery([DeploymentApi.FULL_DEPLOYMENT_PATH, projectId], () => DeploymentApi.getProjectDeployment(projectId))
  const deploymentInfo = useMemo(() => deploymentQueryInfo.data?.data, [deploymentQueryInfo.data])

  return {
    deploymentInfo,
    deploymentQueryInfo
  }
}
