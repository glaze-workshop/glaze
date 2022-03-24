import '@glaze/types'
import axios from 'axios'
import { DeploymentApi } from '@glaze/common'
import { nanoid } from 'nanoid'

axios.defaults.baseURL = 'https://api.localhost'

window.GLAZE_ACTION.registerPlugin('@glaze-plugin/click-heatmap', (config) => {
  console.log('@glaze-plugin/click-heatmap', config)

  return {
    click: (e, node, nodeRef) => {
      const { left, top } = nodeRef.getBoundingClientRect()
      const realLeft = window.scrollX + left
      const realTop = window.scrollY + top

      const { pageX, pageY } = e

      DeploymentApi.uploadClickEvent(window.GLAZE_PROJECT_ID, {
        id: nanoid(),
        deploymentId: window.GLAZE_DEPLOYMENT_ID,
        time: Date.now(),
        nodeId: node.id,
        path: location.pathname,
        position: { x: pageX - realLeft, y: pageY - realTop },
      })

      console.log('@glaze-plugin/click-heatmap', e, node, nodeRef)
    },
  }
})
