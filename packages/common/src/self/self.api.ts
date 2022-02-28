import axios from 'axios'
import { ProjectFolderEntity, TeamEntity, UserEntity } from '../entity'
import { SELF_PREFIX } from '../prefix'

export const SELF_INFO_PATH = 'info'
export const FULL_SELF_INFO_PATH = `${SELF_PREFIX}/${SELF_INFO_PATH}`

/**
 * 获得自己的用户数据
 *
 * @returns 用户数据
 */
export const getSelfInfo = () =>
  axios.get<UserEntity>(FULL_SELF_INFO_PATH)

export const SELF_TEAMS_PATH = 'team'
export const FULL_SELF_TEAM_PATHS = `${SELF_PREFIX}/${SELF_TEAMS_PATH}`

/**
 * 获得自己加入的全部团队
 *
 * @returns 当前用户加入的所有团队
 */
export const getSelfTeams = () =>
  axios.get<TeamEntity[]>(FULL_SELF_TEAM_PATHS)

export const SELF_FOLDERS_PATH = 'folder'
export const FULL_SELF_FOLDER_PATHS = `${SELF_PREFIX}/${SELF_FOLDERS_PATH}`

export const getSelfFolders = () =>
  axios.get<ProjectFolderEntity[]>(FULL_SELF_FOLDER_PATHS)
