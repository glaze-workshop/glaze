import { compile } from 'path-to-regexp'
import { DEPLOYMENT_PREFIX } from '../prefix'
import axios from 'axios'
import { DeploymentEntity } from '../entity'
import { DeploymentPathDuplicationError } from '../errors'
import {
  BasicDeploymentAnalysis,
  DeploymentClickEventDto,
  FullDeploymentAnalysis
} from './deployment.dto'
import { ClickData } from '@glaze/types'
import { number } from 'lib0'

export const DEPLOYMENT_PATH = ':projectId'
export const FULL_DEPLOYMENT_PATH = `${DEPLOYMENT_PREFIX}/${DEPLOYMENT_PATH}`
export const FULL_DEPLOYMENT_PATH_TO_PATH =
  compile<{ projectId: number }>(FULL_DEPLOYMENT_PATH)

export const getProjectDeployment = (projectId: number) =>
  axios.get<DeploymentEntity | null>(
    FULL_DEPLOYMENT_PATH_TO_PATH({ projectId })
  )

export const initDeployProject = (projectId: number) =>
  axios.post<DeploymentEntity>(FULL_DEPLOYMENT_PATH_TO_PATH({ projectId }))

export const updateProjectDeployment = (projectId: number) =>
  axios.put<DeploymentEntity>(FULL_DEPLOYMENT_PATH_TO_PATH({ projectId }))

export const DEPLOYMENT_PATH_PATH = `${DEPLOYMENT_PATH}/path`
export const FULL_DEPLOYMENT_PATH_PATH = `${DEPLOYMENT_PREFIX}/${DEPLOYMENT_PATH_PATH}`
export const FULL_DEPLOYMENT_PATH_PATH_TO_PATH = compile<{ projectId: number }>(
  FULL_DEPLOYMENT_PATH_PATH
)

export type PathDTO = { projectId: number; path: string }
export const updateProjectDeploymentPath = ({ projectId, path }: PathDTO) =>
  axios.put<DeploymentEntity | DeploymentPathDuplicationError>(
    FULL_DEPLOYMENT_PATH_PATH_TO_PATH({ projectId }),
    { path }
  )

export const DEPLOYMENT_RENDER_PATH = '/render/:path'
export const DEPLOYMENT_HEATMAP_RENDER_PATH = '/render/:path/heatmap'

export const DEPLOYMENT_ANALYSIS_PATH = `${DEPLOYMENT_PATH}/analysis`
export const FULL_DEPLOYMENT_ANALYSIS_PATH = `${DEPLOYMENT_PREFIX}/${DEPLOYMENT_ANALYSIS_PATH}`
export const FULL_DEPLOYMENT_ANALYSIS_PATH_TO_PATH = compile<{
  projectId: number
}>(FULL_DEPLOYMENT_ANALYSIS_PATH)
export const getProjectDeploymentAnalysis = (
  projectId: number,
  start: number,
  end: number
) =>
  axios.get<FullDeploymentAnalysis>(
    FULL_DEPLOYMENT_ANALYSIS_PATH_TO_PATH({ projectId }),
    { params: { start, end } }
  )

export const DEPLOYMENT_ANALYSIS_BASIC_PATH = `${DEPLOYMENT_ANALYSIS_PATH}/basic`
export const FULL_DEPLOYMENT_ANALYSIS_BASIC_PATH = `${DEPLOYMENT_PREFIX}/${DEPLOYMENT_ANALYSIS_BASIC_PATH}`
export const FULL_DEPLOYMENT_ANALYSIS_BASIC_PATH_TO_PATH = compile<{
  projectId: number
}>(FULL_DEPLOYMENT_ANALYSIS_BASIC_PATH)
export const getProjectDeploymentAnalysisBasic = (projectId: number) =>
  axios.get<BasicDeploymentAnalysis | void>(
    FULL_DEPLOYMENT_ANALYSIS_BASIC_PATH_TO_PATH({ projectId })
  )

export const DEPLOYMENT_CLICK_EVENT_PATH = `${DEPLOYMENT_PATH}/event/click`
export const FULL_DEPLOYMENT_CLICK_EVENT_PATH = `${DEPLOYMENT_PREFIX}/${DEPLOYMENT_CLICK_EVENT_PATH}`
export const FULL_DEPLOYMENT_CLICK_EVENT_PATH_TO_PATH = compile<{
  projectId: number
}>(FULL_DEPLOYMENT_CLICK_EVENT_PATH)
export const uploadClickEvent = (
  projectId: number,
  event: DeploymentClickEventDto
) =>
  axios.post<DeploymentClickEventDto>(
    FULL_DEPLOYMENT_CLICK_EVENT_PATH_TO_PATH({ projectId }),
    event
  )

export const getClickEvents = (projectId: number, start: number, end: number) =>
  axios.get<ClickData[]>(
    FULL_DEPLOYMENT_CLICK_EVENT_PATH_TO_PATH({ projectId }),
    { params: { start, end } }
  )
