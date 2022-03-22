import { TeamApi } from '@glaze/common'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export function useTeamParamId (): number {
  const { teamId: teamIdRaw } = useParams<{teamId: string}>()
  return Number(teamIdRaw)
}

export function useTeamInfo (teamId: number) {
  const teamQuery = useQuery(TeamApi.FULL_TEAM_PATH_WITH_ID_TO_PATH({ id: teamId }), () => TeamApi.getTeam(teamId))
  const teamInfo = useMemo(() => teamQuery.data?.data, [teamQuery.data])
  return { teamQuery, teamInfo }
}
