import { useEffect } from 'react'
import { ObservableMap } from '../../types/src'
import { GlazeNodeMap } from '../../types/src/listener'
import { GlazeNode } from '@glaze/types'

export const NodeMap: GlazeNodeMap = new ObservableMap()

export function useNodeListener() {
  useEffect(() => {
    const unsubscribes = window.GLAZE_NODE_LISTENER.map((listener) =>
      listener(NodeMap)
    )

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe?.())
    }
  })
}

export function useNodeInfoObserve(
  node: GlazeNode,
  wrapperRef: React.RefObject<HTMLDivElement>
) {
  useEffect(() => {
    if (wrapperRef.current) {
      NodeMap.set(node.id, [node, wrapperRef.current])
    }
  })

  useEffect(() => {
    return () => {
      NodeMap.delete(node.id)
    }
  })
}
