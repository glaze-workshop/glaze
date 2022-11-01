import { CSSProperties } from 'react'

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

export interface AbstractComponentControl<
  T extends ControlType = ControlType,
  D = unknown
> {
  name: GlazeString
  type: T
  default: D
}

export interface BooleanControl
  extends AbstractComponentControl<ControlType.BOOLEAN, boolean> {}

export interface NumberControl
  extends AbstractComponentControl<ControlType.NUMBER, number> {
  min: number
  max: number
}

export interface TextControl
  extends AbstractComponentControl<ControlType.TEXT, string> {}

//#region Font Info
export type FontParam = Pick<CSSProperties, 'color' | 'fontSize'>

export interface FontControl
  extends AbstractComponentControl<ControlType.FONT, FontParam> {}

export const fontToStyle = (font: FontParam): CSSProperties => font
//#endregion

//#region Background Info
export type BackgroundParam = Pick<
  CSSProperties,
  'backgroundImage' | 'backgroundColor'
>

export interface BackgroundControl
  extends AbstractComponentControl<ControlType.BACKGROUND, BackgroundParam> {}

export const backgroundToStyle = (background: BackgroundParam): CSSProperties =>
  background
//#endregion

export interface Option<T> {
  value: T
  description: GlazeString
}

export interface SelectControl<T = unknown>
  extends AbstractComponentControl<ControlType.SELECT, T> {
  options: T[]
}

export interface MultiSelectControl<T = unknown>
  extends AbstractComponentControl<ControlType.MULTI_SELECT, T[]> {
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
      : NonNullable<T> extends FontParam
      ? FontControl
      : NonNullable<T> extends BackgroundParam
      ? BackgroundControl
      : never)
