/** An RGBA color */
export interface Color {
  /** Red channel value, between 0 and 1 */
  r: number;

  /** Green channel value, between 0 and 1 */
  g: number;

  /** Blue channel value, between 0 and 1 */
  b: number;

  /** Alpha channel value, between 0 and 1 */
  a: number;
}

/** A rectangle that expresses a bounding box in absolute coordinates */
export interface Rectangle {
  /** X coordinate of top left corner of the rectangle */
  x: number;

  /** Y coordinate of top left corner of the rectangle */
  y: number;

  /** Width of the rectangle */
  width: number;

  /** Height of the rectangle */
  height: number;
}

/** Information about the arc properties of an ellipse. 0° is the x axis and increasing angles rotate clockwise */
export interface ArcData {
  /** Start of the sweep in radians */
  startingAngle: number;

  /** End of the sweep in radians */
  endingAngle: number;

  /** Inner radius value between 0 and 1 */
  innerRadius: number;
}

/** Enum describing how layer blends with layers below */
export enum BlendMode {
  //#region Normal blends
  PASS_THROUGH = 'PASS_THROUGH',
  NORMAL = 'NORMAL',
  //#endregion

  //#region Darken
  DARKEN = 'DARKEN',
  MULTIPLY = 'MULTIPLY',
  LINEAR_BURN = 'LINEAR_BURN',
  COLOR_BURN = 'COLOR_BURN',
  //#endregion

  //#region Lighten
  LIGHTEN = 'LIGHTEN',
  SCREEN = 'SCREEN',
  LINEAR_DODGE = 'LINEAR_DODGE',
  COLOR_DODGE = 'COLOR_DODGE',
  //#endregion

  //#region Contrast
  OVERLAY = 'OVERLAY',
  SOFT_LIGHT = 'SOFT_LIGHT',
  HARD_LIGHT = 'HARD_LIGHT',
  //#endregion

  //#region Inversion
  DIFFERENCE = 'DIFFERENCE',
  EXCLUSION = 'EXCLUSION',
  //#endregion

  //#region Component
  HUE='HUE',
  SATURATION='SATURATION',
  COLOR='COLOR',
  LUMINOSITY='LUMINOSITY',
  //#endregion
}

/** A 2d vector */
export interface Vector {
  /** X coordinate of the vector */
  x: number;

  /** Y coordinate of the vector */
  y: number;
}

/** A width and a height */
export interface Size {
  /** the width of a size */
  width: number;

  /** the height of a size */
  height: number;
}

/**
 * A 2D affine transformation matrix that can be used to 
 * calculate the affine transforms applied to a layer, 
 * including scaling, rotation, shearing, and translation.
 * 
 * The form of the matrix is given as an array of 2 arrays of 3 numbers each. 
 * E.g. the identity matrix would be [[1, 0, 0], [0, 1, 0]].
 */
export type Transform = number[][]

/** Defines the image filters applied to an image paint. All values are from -1 to 1. */
export interface ImageFilters {
  exposure: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  highlights: number;
  shadows: number;
}

/** A relative offset within a frame */
export interface FrameOffset {
  /** Unique id specifying the frame. */
  node_id: string;

  /** 2d vector offset within the frame. */
  node_offset: Vector;
}

/** A position color pair representing a gradient stop */
export interface ColorStop {
  /** Value between 0 and 1 representing position along gradient axis */
  position: number;

  /** Color attached to corresponding position */
  color: Color;
}

/** A description of a main component. Helps you identify which component instances are attached to */
export interface Component {
  /**  */
  key: string;

  name: string;

  description: string;
}

