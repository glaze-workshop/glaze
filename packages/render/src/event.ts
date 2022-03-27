export function registerEvents() {
  document.body.addEventListener('click', (e) => {
    const path = e.composedPath() as HTMLElement[]
    const nodeRef = path.find((el) => el.dataset?.glazeId)

    if (nodeRef) {
      const node = window.GLAZE_NODES[nodeRef.dataset.glazeId!]
      window.GLAZE_REGISTERED_PLUGIN_MAP.forEach(([, config]) => {
        config?.click?.(e, node, nodeRef)
      })
    }
  })

  window.addEventListener('scroll', (e) => {
    window.GLAZE_REGISTERED_PLUGIN_MAP.forEach(([, config]) => {
      config?.scroll?.(e)
    })
  })
}
