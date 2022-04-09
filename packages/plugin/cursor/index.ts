import '@glaze/types'

window.GLAZE_ACTION.registerPlugin('@glaze-plugin/cursor', (config) => {
  document.body.style.cursor = `url(${config.url}), auto`
})
