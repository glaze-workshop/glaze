import { EditorComponentInfo } from '@glaze/common'
import { LazyExoticComponent } from 'react'

export interface CustomComponentInfo {
  loading: boolean
  error: boolean
  errorMsg?: string
  info?: EditorComponentInfo
  Component?: LazyExoticComponent<any>
}

export interface CustomComponentMeta {
  id: string
  name: string
}
