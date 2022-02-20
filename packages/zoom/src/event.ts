import { Zoom } from './zoom'
import { Point } from './transform'
import normalizeWheel from 'normalize-wheel'

export interface ZoomEventHandlerConfig {
  zoomRatio: number
  scrollRatio: number
}

export function initZoomEventHandlerConfig (config: Partial<ZoomEventHandlerConfig>): ZoomEventHandlerConfig {
  return {
    zoomRatio: 0.02,
    scrollRatio: 0.5,
    ...config
  }
}

export class ZoomEventHandler {
  readonly #zoom: Zoom
  readonly #config: ZoomEventHandlerConfig

  constructor (zoom: Zoom, config: Partial<ZoomEventHandlerConfig> = {}) {
    this.#zoom = zoom
    this.#config = initZoomEventHandlerConfig(config)
  }

  get transform () {
    return this.#zoom.transform
  }

  /**
   * ctrl + mousewheel = zoom
   *
   * shift + mousewheel = scroll vertically
   *
   * mousewheel = scroll horizontally
   *
   * @param event
   */
  onWheel (event: WheelEvent) {
    event.preventDefault()
    const e = normalizeWheel(event)
    if (event.ctrlKey) {
      const k = this.transform.k * Math.pow(2, this.#config.zoomRatio * -e.pixelY)
      const p: Point = { x: event.clientX, y: event.clientY }
      this.#zoom.scaleBy(k, p)
    } else if (event.shiftKey) {
      this.#zoom.scrollX(e.pixelY * this.#config.scrollRatio)
    } else {
      this.#zoom.scrollY(e.pixelY * this.#config.scrollRatio)
    }
  }
}
