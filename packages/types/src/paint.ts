import type { Color, BlendMode, Vector } from './property'

/** Type of paint as a string enum */
export enum PaintType {
  SOLID = 'SOLID',
  GRADIENT_LINEAR = 'GRADIENT_LINEAR',
  GRADIENT_RADIAL = 'GRADIENT_RADIAL',
  GRADIENT_ANGULAR = 'GRADIENT_ANGULAR',
  GRADIENT_DIAMOND = 'GRADIENT_DIAMOND',
  IMAGE = 'IMAGE',
  EMOJI = 'EMOJI',
}

/** A solid color, gradient, or image texture that can be applied as fills or strokes */
export interface AbstractPaint {
  /** Type of paint as a string enum */
  type: PaintType

  /** Is the paint enabled? */
  visible: boolean

  /** Overall opacity of paint (colors within the paint can also have opacity values which would blend with this), 0..1 */
  opacity: number
}

export interface SolidPaint extends AbstractPaint {
  type: PaintType.SOLID

  /** Solid color of the paint */
  color: Color
}

export interface GradientPaints extends AbstractPaint {
  type: PaintType.GRADIENT_LINEAR | PaintType.GRADIENT_RADIAL | PaintType.GRADIENT_ANGULAR | PaintType.GRADIENT_DIAMOND

  /** How this node blends with nodes behind it in the scene (see {@link BlendMode}) */
  blendMode: BlendMode

  /**
   * his field contains three vectors, each of which are a position in normalized object space
   * (normalized object space is if the top left corner of the bounding box of the object is (0, 0) and the bottom right is (1,1)).
   * The first position corresponds to the start of the gradient (value 0 for the purposes of calculating gradient stops),
   * the second position is the end of the gradient (value 1),
   * and the third handle position determines the width of the gradient. See image examples below:
   */
  gradientHandlePositions: Vector

}
