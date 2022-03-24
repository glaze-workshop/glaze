import { useQuery } from 'react-query'
import { useMemo } from 'react'
import { useProjectInfoUnderParam } from './project.hook'
import { DeploymentApi } from '@glaze/common'
import dayjs from 'dayjs'
import { FULL_DEPLOYMENT_CLICK_EVENT_PATH_TO_PATH } from '@glaze/common/src/deployment/deployment.api'

export function useProjectDeploymentInfo() {
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

export function useQueryClickEvents(projectId: number, start: Date, end: Date) {
  const realEnd = dayjs(end).endOf('day').toDate()

  const startNum = start.getTime()
  const endNum = realEnd.getTime()

  const clickEventsQuery = useQuery(
    [FULL_DEPLOYMENT_CLICK_EVENT_PATH_TO_PATH({ projectId }), start, end],
    () => DeploymentApi.getClickEvents(projectId, startNum, endNum)
  )
  const clickEvents = useMemo(() => clickEventsQuery.data?.data, [clickEventsQuery.data])
  return { clickEvents, clickEventsQuery }
}
