import { useQuery } from 'react-query'
import { useMemo } from 'react'
import { useProjectInfoUnderParam } from './project.hook'
import { DeploymentApi, DeploymentDto } from '@glaze/common'
import dayjs from 'dayjs'
import {
  FULL_DEPLOYMENT_ANALYSIS_PATH_TO_PATH,
  FULL_DEPLOYMENT_CLICK_EVENT_PATH_TO_PATH
} from '@glaze/common/src/deployment/deployment.api'

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

export function useProjectAnalysis(projectId: number, start: Date, end: Date) {
  console.log(start, end)
  const realEnd = dayjs(end).endOf('day').toDate()

  const startNum = start.getTime()
  const endNum = realEnd.getTime()

  const allDaysBetween = useMemo(() => {
    const dayjsStart = dayjs(startNum)
    const dayjsEnd = dayjs(end)

    const list = [dayjsStart]
    while (list[list.length - 1].isBefore(dayjsEnd)) {
      list.push(list[list.length - 1].add(1, 'day'))
    }
    return list
  }, [startNum, end])

  const deploymentAnalysisQuery = useQuery(
    [FULL_DEPLOYMENT_ANALYSIS_PATH_TO_PATH({ projectId }), start, end],
    () => DeploymentApi.getProjectDeploymentAnalysis(projectId, startNum, endNum)
  )
  const deploymentAnalysis = useMemo(
    () => deploymentAnalysisQuery.data?.data,
    [deploymentAnalysisQuery.data]
  )

  const chartData = useMemo<DeploymentDto.EachDayDeploymentAnalysis[]>(() => {
    console.log('allDaysBetween', allDaysBetween)
    return allDaysBetween.map((day) => {
      const dayDeployment = deploymentAnalysis?.eachDay.find((each) => day.isSame(each.day, 'day'))
      return {
        requestCount: 0,
        userCount: 0,
        size: 0,
        ...dayDeployment,
        day: day.format('MM-DD')
      }
    })
  }, [allDaysBetween, deploymentAnalysis?.eachDay])

  return { deploymentAnalysis, deploymentAnalysisQuery, chartData }
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
