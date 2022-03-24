import {
  isGlazeMessage,
  GlazeMessageType,
  HeatmapReadyMessage,
} from '@glaze/types'
import type { Subscription } from 'rxjs'
import { HeatmapControl } from './HeatmapControl'

window.GLAZE_ACTION.registerNodeListener((nodeMap) => {
  console.log('ready', nodeMap)
  const subscriberList: Subscription[] = []
  const heatmapControl = new HeatmapControl()

  function handleMessage(e: MessageEvent) {
    if (isGlazeMessage(e.data)) {
      if (e.data.type === GlazeMessageType.SET_CLICK_DATA) {
        const { data } = e.data

        subscriberList.forEach((subscriber) => subscriber.unsubscribe())
        heatmapControl.cleanMap()
        subscriberList.length = 0
        data.forEach((eachEvent) => {
          subscriberList.push(
            nodeMap.observeKey(eachEvent.nodeId).subscribe((nodeInfo) => {
              if (nodeInfo) {
                const [, nodeRef] = nodeInfo
                const { left, top } = nodeRef.getBoundingClientRect()
                const realLeft = window.scrollX + left
                const realTop = window.scrollY + top
                heatmapControl.set(`${eachEvent.id}_${eachEvent.nodeId}`, {
                  x: realLeft + eachEvent.position.x,
                  y: realTop + eachEvent.position.y,
                  value: 1,
                })
              }
            })
          )
        })
      }
    }
  }

  window.addEventListener('message', handleMessage)
  const readyMessage: HeatmapReadyMessage = {
    type: GlazeMessageType.HEATMAP_READY,
    data: undefined,
  }
  window.parent?.postMessage(readyMessage, '*')
  console.log('HEATMAP_READY_SENT')

  return () => {
    window.removeEventListener('message', handleMessage)
    heatmapControl.destroy()
  }
})
