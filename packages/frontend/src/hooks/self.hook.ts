import { SelfApi, Entity } from '@glaze/common'
import { useQuery } from 'react-query'

/**
 * 获得当前用户
 *
 * @returns 当前用户
 */
export const useCurrentUser = () => {
  return useQuery(SelfApi.FULL_SELF_INFO_PATH, SelfApi.getSelfInfo)
}

/**
 * 获得当前角色
 */
export const useUserTeams = () => {
  return useQuery(SelfApi.FULL_SELF_TEAM_PATHS, SelfApi.getSelfTeams)
}
