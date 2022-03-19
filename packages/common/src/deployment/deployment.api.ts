import { compile } from 'path-to-regexp'
import { DEPLOYMENT_PREFIX, PROJECT_PREFIX } from '../prefix'
import axios from 'axios'
import { DeploymentEntity } from '../entity'
import { DeploymentPathDuplicationError } from '../errors'

export const DEPLOYMENT_PATH = ':projectId'
export const FULL_DEPLOYMENT_PATH = `${DEPLOYMENT_PREFIX}/${DEPLOYMENT_PATH}`
export const FULL_DEPLOYMENT_PATH_TO_PATH = compile<{projectId: number}>(FULL_DEPLOYMENT_PATH)

export const getProjectDeployment = (projectId: number) =>
  axios.get<DeploymentEntity | null>(FULL_DEPLOYMENT_PATH_TO_PATH({ projectId }))

export const initDeployProject = (projectId: number) =>
  axios.post<DeploymentEntity>(FULL_DEPLOYMENT_PATH_TO_PATH({ projectId }))

export const updateProjectDeployment = (projectId: number) =>
  axios.put<DeploymentEntity>(FULL_DEPLOYMENT_PATH_TO_PATH({ projectId }))

export const DEPLOYMENT_PATH_PATH = `${DEPLOYMENT_PATH}/path`
export const FULL_DEPLOYMENT_PATH_PATH = `${DEPLOYMENT_PREFIX}/${DEPLOYMENT_PATH_PATH}`
export const FULL_DEPLOYMENT_PATH_PATH_TO_PATH = compile<{projectId: number}>(FULL_DEPLOYMENT_PATH_PATH)

export type PathDTO = {projectId: number; path: string}
export const updateProjectDeploymentPath = ({ projectId, path }: PathDTO) =>
  axios.put<DeploymentEntity | DeploymentPathDuplicationError>(FULL_DEPLOYMENT_PATH_PATH_TO_PATH({ projectId }), { path })

export const DEPLOYMENT_RENDER_PATH = '/render/:path'
