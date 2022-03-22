import axios from 'axios'
import { compile } from 'path-to-regexp'
import { DeploymentEntity, ProjectEntity } from '../entity'
import { GlazePluginEntity } from '../entity/plugin'
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

export const PROJECT_USED_PLUGIN_PATH = `${PROJECT_PATH_WITH_ID}/plugin`
export const FULL_PROJECT_USED_PLUGIN_PATH = `${PROJECT_PREFIX}/${PROJECT_USED_PLUGIN_PATH}`
export const FULL_PROJECT_USED_PLUGIN_PATH_TO_PATH = compile<{id: number}>(PROJECT_USED_PLUGIN_PATH)

/**
 * 获得项目使用中的全部插件
 * @param id 项目 id
 * @returns
 */
export const getProjectPlugins = (id: number) =>
  axios.get<GlazePluginEntity[]>(FULL_PROJECT_USED_PLUGIN_PATH_TO_PATH({ id }))

export const PROJECT_USED_PLUGIN_PATH_WITH_ID = `${PROJECT_USED_PLUGIN_PATH}/:pluginId`
export const FULL_PROJECT_USED_PLUGIN_PATH_WITH_ID = `${PROJECT_USED_PLUGIN_PATH}/${PROJECT_USED_PLUGIN_PATH_WITH_ID}`
export const FULL_PROJECT_USED_PLUGIN_PATH_WITH_ID_TO_PATH = (projectId: number, pluginId: string) =>
  compile<{id: number; pluginId: string}>(FULL_PROJECT_USED_PLUGIN_PATH_WITH_ID)({ id: projectId, pluginId: encodeURIComponent(pluginId) })

/**
 * 获得项目使用的具体插件的详情
 * @param projectId 项目 id
 * @param pluginId 插件 id
 * @returns
 */
export const getProjectPlugin = (projectId: number, pluginId: string) =>
  axios.get<GlazePluginEntity>(FULL_PROJECT_USED_PLUGIN_PATH_WITH_ID_TO_PATH(projectId, pluginId))

/**
 * 更新项目使用的具体插件配置（并启用插件）
 * @param projectId 项目 id
 * @param pluginId 插件 id
 * @param config 配置
 * @returns
 */
export const updateProjectPluginSettings = (projectId: number, pluginId: string, config: Record<string, any>) =>
  axios.put<GlazePluginEntity>(FULL_PROJECT_USED_PLUGIN_PATH_WITH_ID_TO_PATH(projectId, pluginId), config)

export const deletePluginInProject = (projectId: number, pluginId: string) =>
  axios.delete(FULL_PROJECT_USED_PLUGIN_PATH_WITH_ID_TO_PATH(projectId, pluginId))
