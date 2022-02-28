import { useMatch, useResolvedPath } from 'react-router-dom'

export function useCurrentRouterMatch (to: string) {
  const resolved = useResolvedPath(to)
  return useMatch({ path: resolved.pathname, end: true })
}
