export function renderPluginJsFile (ownerTeamId: number) {
  return `// Generated by @glaze/sdk-toolkit

/**
 * @type {import('@glaze/types').GlazeConfig}
 */
const config = {
  plugins: [],

  // Never change this object.
  generated: {
    ownerTeamId: ${ownerTeamId}
  }
}

module.exports = config
`
}