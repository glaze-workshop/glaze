import {
  applyTransform,
  InitTransform,
  invertTransform,
  Point,
  Transform,
} from './transform'
import { BehaviorSubject } from 'rxjs'

export interface ZoomConfig {
  /** 缩放大小 */
  scaleExtent: [number, number]
  /** 默认缩放 */
  defaultTransform: Transform
}

export function initZoomConfig(config: Partial<ZoomConfig>): ZoomConfig {
  return {
    scaleExtent: [0.2, 8],
    defaultTransform: InitTransform,
    ...config,
  }
}

export class Zoom {
  readonly #subject: BehaviorSubject<Transform>
  readonly #config: ZoomConfig

  constructor(config: Partial<ZoomConfig> = {}) {
    this.#config = initZoomConfig(config)
    this.#subject = new BehaviorSubject<Transform>(
      this.#config.defaultTransform
    )
  }

  get transform() {
    return this.#subject.value
  }

  get subject() {
    return this.#subject
  }

  subscribe(next: (value: Transform) => void) {
    return this.#subject.subscribe(next)
  }

  apply(point: Point) {
    return applyTransform(this.transform, point)
  }

  invert(point: Point) {
    return invertTransform(this.transform, point)
  }

  scrollX(x: number) {
    this.nextTransform({
      ...this.transform,
      x: this.transform.x + x,
    })
  }

  scrollY(y: number) {
    this.nextTransform({
      ...this.transform,
      y: this.transform.y + y,
    })
  }

  translateTo(x: number, y: number, point: Point) {
    this.nextTransform({
      x: point.x - this.transform.k * x,
      y: point.y - this.transform.k * y,
      k: this.transform.k,
    })
  }

  scaleBy(k: number, point: Point) {
    const safeK = this.getSafeK(k)
    const invertedPoint = this.invert(point)

    this.nextTransform({
      x: point.x - invertedPoint.x * safeK,
      y: point.y - invertedPoint.y * safeK,
      k: safeK,
    })
  }

  nextTransform(transform: Transform) {
    if (
      this.transform.k !== transform.k ||
      this.transform.x !== transform.x ||
      this.transform.y !== transform.y
    ) {
      this.#subject.next(transform)
    }
  }

  getSafeK(k: number) {
    return Math.max(
      this.#config.scaleExtent[0],
      Math.min(this.#config.scaleExtent[1], k)
    )
  }
}
