export const wsUrl = () => {
  const protocolPrefix = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocolPrefix}//localhost:3000`
}
