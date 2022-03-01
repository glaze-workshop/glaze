import axios from 'axios'
import { compile } from 'path-to-regexp'
import { ProjectEntity } from '../entity'
import { PROJECT_PREFIX } from '../prefix'
import { ProjectCreationDTO, ProjectUpdateDTO } from './project.dto'

export const PROJECT_PATH = ''
export const FULL_PROJECT_PATH = `${PROJECT_PREFIX}`

/**
 * 创建项目
 * @param projectDTO 创建 dto
 * @returns 创建项目
 */
export const createProject = (projectDTO: ProjectCreationDTO) =>
  axios.post<ProjectEntity>(FULL_PROJECT_PATH, projectDTO)

/**
 * 通过文件夹 id 获得项目列表
 * @param folderId 文件夹 id
 * @returns
 */
export const getProjects = (folderId: number) =>
  axios.get<ProjectEntity[]>(FULL_PROJECT_PATH, { params: { folderId } })

export const PROJECT_PATH_WITH_ID = ':id'
export const FULL_PROJECT_PATH_WITH_ID = `${PROJECT_PREFIX}/${PROJECT_PATH_WITH_ID}`
export const FULL_PROJECT_PATH_WITH_ID_TO_PATH = compile<{id: number}>(FULL_PROJECT_PATH_WITH_ID)

/**
 * 更新项目
 * @param projectDTO 项目更新dto
 * @returns
 */
export const updateProject = (projectDTO: ProjectUpdateDTO) => {
  return axios.put<ProjectEntity>(FULL_PROJECT_PATH_WITH_ID_TO_PATH({ id: projectDTO.id }), projectDTO)
}

/**
 * 获得项目详情
 * @param id 项目 id
 * @returns
 */
export const getProject = (id: number) =>
  axios.get<ProjectEntity | null>(FULL_PROJECT_PATH_WITH_ID_TO_PATH({ id }))

/**
 * 移除项目
 * @param id 项目 id
 * @returns
 */
export const deleteProject = (id: number) =>
  axios.delete(FULL_PROJECT_PATH_WITH_ID_TO_PATH({ id }))

export const PROJECT_ARCHIVE_PATH = `${PROJECT_PATH_WITH_ID}/archive`
export const FULL_PROJECT_ARCHIVE_PATH = `${PROJECT_PREFIX}/${PROJECT_ARCHIVE_PATH}`
export const FULL_PROJECT_ARCHIVE_PATH_TO_PATH = compile<{id: number}>(FULL_PROJECT_ARCHIVE_PATH)

/**
 * 存档项目
 * @param id 项目 id
 * @returns
 */
export const archiveProject = (id: number) =>
  axios.put(FULL_PROJECT_ARCHIVE_PATH_TO_PATH({ id }))
