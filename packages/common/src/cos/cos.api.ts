import { COS_PREFIX } from '../prefix'
import axios from 'axios'
import { CosBasicInfo, CredentialData } from './cos.dto'

export const COS_CREDENTIAL_PATH = 'credential'
export const FULL_COS_CREDENTIAL_PATH = `${COS_PREFIX}/${COS_CREDENTIAL_PATH}`

export const getUploadCredential = () =>
  axios.get<CredentialData>(FULL_COS_CREDENTIAL_PATH)

export const COS_BASIC_INFO_PATH = 'basic'
export const FULL_COS_BASIC_INFO_PATH = `${COS_PREFIX}/${COS_BASIC_INFO_PATH}`

export const getCosBasicInfo = () => axios.get<CosBasicInfo>(FULL_COS_BASIC_INFO_PATH)
