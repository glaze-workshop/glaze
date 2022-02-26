import axios from 'axios'
import { TEAM_PREFIX } from '../prefix'
import { TeamCreationDTO, TeamUpdateDTO } from './team.dto'
import { compile } from 'path-to-regexp'
import { GlazeTeamRole } from '../entity'

export const TEAM_PATH = ''
export const FULL_TEAM_PATH = `${TEAM_PREFIX}`

/**
 * 创建团队
 * @param teamDTO 团队信息
 */
export const createTeam = (teamDTO: TeamCreationDTO) => axios.post(FULL_TEAM_PATH, teamDTO)

/**
 * 获得用户加入的全部团队
 * @param userId 用户id
 * @returns 用户加入的全部团队
 */
export const getTeams = (userId: number) => axios.get(FULL_TEAM_PATH, { params: { userId } })

export const TEAM_PATH_WITH_ID = ':id'
export const FULL_TEAM_PATH_WITH_ID = `${TEAM_PREFIX}/${TEAM_PATH_WITH_ID}`
export const FULL_TEAM_PATH_WITH_ID_TO_PATH = compile<{id: number}>(FULL_TEAM_PATH_WITH_ID)

/**
 * 更新团队信息
 * @param id 团队 id
 * @param teamDTO
 * @returns
 */
export const updateTeam = (id: number, teamDTO: TeamUpdateDTO) =>
  axios.put(FULL_TEAM_PATH_WITH_ID_TO_PATH({ id }), teamDTO)

/**
 * 删除团队
 * @param id 团队 id
 * @returns
 */
export const deleteTeam = (id: number) =>
  axios.delete(FULL_TEAM_PATH_WITH_ID_TO_PATH({ id }))

export const TEAM_MEMBER_PATH = `${TEAM_PATH_WITH_ID}/member/:memberId`
export const FULL_TEAM_MEMBER_PATH = `${TEAM_PREFIX}/${TEAM_MEMBER_PATH}`
export const FULL_TEAM_MEMBER_PATH_TO_PATH = compile<{id: number; memberId: number}>(FULL_TEAM_MEMBER_PATH)

/**
 * 将成员加入团队
 * @param id 团队 id
 * @param memberId 成员 id
 * @returns
 */
export const joinTeam = (id: number, memberId: number) =>
  axios.post(FULL_TEAM_MEMBER_PATH_TO_PATH({ id, memberId }))

/**
 * 更新成员身份
 * @param id 团队 id
 * @param memberId 成员 id
 * @param role 成员身份
 * @returns
 */
export const updateTeamMemberRole = (id: number, memberId: number, role: GlazeTeamRole) =>
  axios.put(FULL_TEAM_MEMBER_PATH_TO_PATH({ id, memberId }), role)

/**
 * 删除成员
 * @param id 团队 id
 * @param memberId 成员
 * @returns
 */
export const deleteTeamMember = (id: number, memberId: number) =>
  axios.delete(FULL_TEAM_MEMBER_PATH_TO_PATH({ id, memberId }))
