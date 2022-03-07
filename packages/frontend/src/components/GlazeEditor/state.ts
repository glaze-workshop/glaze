import { BehaviorSubject } from 'rxjs'
import { LayoutConfig } from '../../schema/layout'
import * as Y from 'yjs'
import { NodeProxy, StructureProxy } from './yjs.hook'
import EditorSharedDocument from './EditorSharedDocument'
import { ComponentConfig } from '../../schema/config'
import React from 'react'
import FontConfig from '../BasicComponents/Font/config'
import Font from '../BasicComponents/Font'
import FrameConfig from '../BasicComponents/Frame/config'
import Frame from '../BasicComponents/Frame'
import ScreenConfig from '../BasicComponents/Screen/config'
import GlazeScreen from '../BasicComponents/Screen'

export interface SelectedNodeInfo {
  nodeProxy: NodeProxy
  parentStructureInfo?: Y.Map<any>
  structureProxy: StructureProxy
  wrapper: HTMLDivElement
}

export const SelectedNodeInfoSubject = new BehaviorSubject<SelectedNodeInfo | null>(null)

export const EditorPositionSubject = new BehaviorSubject<DOMRect | null>(null)

export interface ComponentFullInfo {
  config: ComponentConfig
  component: React.FunctionComponent<any>
}

export const AllComponentsSubject = new BehaviorSubject<Map<string, ComponentFullInfo>>(new Map([
  [FontConfig.id, { config: FontConfig, component: Font }],
  [FrameConfig.id, { config: FrameConfig, component: Frame }],
  [ScreenConfig.id, { config: ScreenConfig, component: GlazeScreen }]
]))
