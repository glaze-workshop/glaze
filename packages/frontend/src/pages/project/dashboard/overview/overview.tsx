import React, { FC, useCallback } from 'react'
import { useProjectInfoUnderParam } from '../../../../hooks/project.hook'
import { useProjectDeploymentInfo } from '../../../../hooks/deployment.hook'
import { useMutation } from 'react-query'
import { DeploymentApi, notEmpty } from '@glaze/common'
import { Button } from '@chakra-ui/react'
import { updateProjectDeployment } from '@glaze/common/src/deployment/deployment.api'

export interface OverviewProps {

}
const Overview:FC<OverviewProps> = () => {
  const { projectInfo, projectId } = useProjectInfoUnderParam()
  const { deploymentInfo, deploymentQueryInfo } = useProjectDeploymentInfo()

  const initProjectMutation = useMutation(DeploymentApi.initDeployProject, {
    onSuccess: () => {
      deploymentQueryInfo.refetch()
    }
  })

  const initDeployProject = useCallback(() => {
    initProjectMutation.mutate(projectId)
  }, [initProjectMutation, projectId])

  const updateProjectDeploymentMutation = useMutation(DeploymentApi.updateProjectDeployment, {
    onSuccess: () => {
      deploymentQueryInfo.refetch()
    }
  })

  const updateDeployProject = useCallback(() => {
    updateProjectDeploymentMutation.mutate(projectId)
  }, [updateProjectDeploymentMutation, projectId])

  return notEmpty(deploymentInfo)
    ? (
      <div>
        <p>{`${deploymentInfo.path}.glaze.localhost`}</p>
        <Button isLoading={updateProjectDeploymentMutation.isLoading} onClick={updateDeployProject}>部署项目</Button>
      </div>
      )
    : (
        deploymentQueryInfo.isLoading
          ? <p>Loading...</p>
          : <Button isLoading={initProjectMutation.isLoading} onClick={initDeployProject}>部署项目</Button>
      )
}
export default Overview
