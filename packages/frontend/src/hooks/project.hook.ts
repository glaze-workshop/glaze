import { ProjectApi } from '@glaze/common'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export function useProjectInfo (projectId: number) {
  return useQuery([ProjectApi.FULL_PROJECT_PATH_WITH_ID, projectId], () => ProjectApi.getProject(projectId))
}

export function useProjectInfoUnderParam () {
  const { projectId } = useParams<{projectId: string}>()
  const projectIdNum = useMemo(() => Number(projectId), [projectId])
  const projectQuery = useProjectInfo(projectIdNum)
  const projectInfo = useMemo(() => projectQuery.data?.data, [projectQuery.data])

  return {
    projectInfo,
    projectQuery,
    projectId: projectIdNum
  }
}
