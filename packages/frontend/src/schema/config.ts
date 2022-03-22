import type { CSSProperties } from 'react'
import { Length } from './length'
import previewFields from './preview'

export interface I18nString {
  zh: string
  en?: string
}

// export type GlazeString = string | I18nString
export type GlazeString = string

/**
 * @link https://storybook.js.org/docs/react/essentials/controls#annotation
 */
export enum ControlType {
  /** checkbox input */
  BOOLEAN = 'boolean',

  /** a numeric text box input */
  NUMBER = 'number',

  /** simple text input */
  TEXT = 'text',

  /** select dropdown input */
  SELECT = 'select',

  /**
   * TODO: 组件拖拽
   */
  COMPONENT = 'component',

  /**
   * multi-select dropdown input
   */
  MULTI_SELECT = 'multi_select',

  FONT = 'font',

  BACKGROUND = 'background',
}

export interface AbstractControl<
  T extends ControlType = ControlType,
  D = unknown
> {
  name: GlazeString
  type: T
  default: D
}

export interface BackgroundControl
  extends AbstractControl<ControlType.BACKGROUND, {background: string; backgroundImage: string}> {}

export interface BooleanControl
  extends AbstractControl<ControlType.BOOLEAN, boolean> {}

export interface NumberControl
  extends AbstractControl<ControlType.NUMBER, number> {
  min: number
  max: number
}

export interface TextControl
  extends AbstractControl<ControlType.TEXT, string> {}

export interface Option<T> {
  value: T
  description: GlazeString
}

export interface SelectControl<T = unknown>
  extends AbstractControl<ControlType.SELECT, T> {
  options: T[]
}

export interface MultiSelectControl<T = unknown>
  extends AbstractControl<ControlType.MULTI_SELECT, T[]> {
  options: T[]
}

export type Control<T> =
  | SelectControl<T>
  | MultiSelectControl<T>
  | (NonNullable<T> extends boolean
      ? BooleanControl
      : NonNullable<T> extends number
      ? NumberControl
      : NonNullable<T> extends string
      ? TextControl
      : never)

export type PropsConfig<P> = {
  [key in keyof P]: Control<P[key]>
}

export type DefaultSizeConfig = {
  width: Length
  height: Length
}

/**
 * 每个组件都有的配置信息
 */
export interface ComponentConfig<T = any> {
  id: string
  name: GlazeString
  props: PropsConfig<T>
  defaultSize: DefaultSizeConfig
  hasChildren?: boolean
}

export interface GlazeComponentProps {
  className?: string
  style?: CSSProperties
}

export interface FieldNode {
  type: keyof typeof previewFields
  h?: number
  displayName?: string
  module?: string
  props: Record<string, any>
}
