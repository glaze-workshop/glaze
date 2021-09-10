import type { BlendMode, Color, Vector } from './property'

/** Type of effect as a string enum, see {@link Effect} */
export enum EffectType {
  INNER_SHADOW = 'INNER_SHADOW',
  DROP_SHADOW = 'DROP_SHADOW',
  LAYER_BLUR = 'LAYER_BLUR',
  BACKGROUND_BLUR = 'BACKGROUND_BLUR'
}

/** A visual effect such as a shadow or blur */
export interface AbstractEffect {
  /** Type of effect as a string enum */
  type: EffectType

  /** Is the effect active? */
  visible: boolean

  /** Radius of the blur effect (applies to shadows as well) */
  radius: number
}

export interface ShadowEffect extends AbstractEffect {
  /** The color of the shadow */
  color: Color

  /** Blend mode of the shadow */
  blendMode: BlendMode

  /** How far the shadow is projected in the x and y directions */
  offset: Vector

  /** How far the shadow spreads */
  spread: number

  /** Whether to show the shadow behind translucent or transparent pixels (applies only to drop shadows) */
  showShadowBehindNode: boolean
}

export interface InnerShadowEffect extends ShadowEffect {
  type: EffectType.INNER_SHADOW
}

export interface DropShadowEffect extends ShadowEffect {
  type: EffectType.DROP_SHADOW
}

export interface LayerBlurEffect extends AbstractEffect {
  type: EffectType.LAYER_BLUR
}

export interface BackgroundBlurEffect extends AbstractEffect {
  type: EffectType.BACKGROUND_BLUR
}

/** A visual effect such as a shadow or blur */
export type Effect = InnerShadowEffect | DropShadowEffect | LayerBlurEffect | BackgroundBlurEffect
