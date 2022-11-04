// export const createOrUpdateComponent = () =>
import { COMPONENT_PREFIX } from '../prefix'
import axios from 'axios'
import { PermissionDeniedError } from '../errors'
import { compile } from 'path-to-regexp'
import { GlazeComponentDto } from './component.dto'
import { GlazeComponentEntity } from '../entity'

export const COMPONENT_PATH = ''
export const FULL_COMPONENT_PATH = COMPONENT_PREFIX

export const createOrUpdateComponent = (glazeComponentDto: GlazeComponentDto) =>
  axios.post<GlazeComponentEntity | PermissionDeniedError>(
    FULL_COMPONENT_PATH,
    glazeComponentDto
  )

export interface GetComponentQueryParams {
  ownerTeamId?: number
  projectId?: number
}

export const getComponents = (query: GetComponentQueryParams = {}) => {
  console.log(query)
  return axios.get<GlazeComponentEntity[]>(FULL_COMPONENT_PATH, {
    params: query
  })
}

export const COMPONENT_PATH_WITH_ID = ':componentId'
export const FULL_COMPONENT_PATH_WITH_ID = `${COMPONENT_PREFIX}/${COMPONENT_PATH_WITH_ID}`
export const FULL_COMPONENT_PATH_WITH_ID_TO_PATH = (componentId: string) =>
  compile<{ componentId: string }>(FULL_COMPONENT_PATH_WITH_ID)({
    componentId: encodeURIComponent(componentId)
  })

export const getComponentById = (componentId: string) =>
  axios.get<GlazeComponentEntity>(
    FULL_COMPONENT_PATH_WITH_ID_TO_PATH(componentId)
  )
