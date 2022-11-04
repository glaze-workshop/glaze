import h337, { DataPoint } from 'heatmap.js'

export type DataType = DataPoint<'value', 'x', 'y'>

export class HeatmapControl {
  heatmap: h337.Heatmap<'value', 'x', 'y'>
  canvas: Element

  nodeMap = new Map<string, DataType>()

  constructor() {
    this.heatmap = h337.create({
      container: document.body,
    })
    this.canvas = document.querySelector('body > canvas.heatmap-canvas')
  }

  set(id: string, data: DataType) {
    this.nodeMap.set(id, data)
    this.mapChangeCallback()
  }

  delete(id: string) {
    this.nodeMap.delete(id)
    this.mapChangeCallback()
  }

  cleanMap() {
    this.nodeMap.clear()
    this.mapChangeCallback()
  }

  mapChangeCallback() {
    const data = Array.from(this.nodeMap.values())
    this.setData(data)
  }

  setData(data: DataType[]) {
    this.heatmap.setData({
      max: 1,
      min: 0,
      data,
    })
  }

  destroy() {
    this.canvas.remove()
  }
}
