
export interface Point {
  x: number
  y: number
}

export interface Transform {
  /** the translation amount tx along the x-axis. */
  x: number
  /** the translation amount ty along the y-axis */
  y: number
  /** the scale factor k */
  k: number
}

export const InitTransform: Transform = {
  x: 0,
  y: 0,
  k: 1
}

/**
 * Returns the transformation of the specified point
 * which is a two-element array of numbers [x, y].
 * The returned point is equal to [xk + tx, yk + ty].
 *
 * @param transform
 * @param point
 */
export function applyTransform (transform: Transform, point: Point): Point {
  return {
    x: point.x * transform.k + transform.x,
    y: point.y * transform.k + transform.y
  }
}

/**
 * Returns the inverse transformation of the specified point
 * which is a two-element array of numbers [x, y].
 * The returned point is equal to [(x - tx) / k, (y - ty) / k].
 *
 * @param transform
 * @param point
 */
export function invertTransform (transform: Transform, point: Point): Point {
  return {
    x: (point.x - transform.x) / transform.k,
    y: (point.y - transform.y) / transform.k
  }
}
