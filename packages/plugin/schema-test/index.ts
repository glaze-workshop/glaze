import '@glaze/types'

window.GLAZE_ACTION.registerPlugin('@glaze-plugin/schema-test', (config) => {
  console.log('@glaze-plugin/schema-test', config)

  return {
    click: (e, node, nodeRef) => {
      console.log('@glaze-plugin/schema-test', e, node, nodeRef)
    },
  }
})
