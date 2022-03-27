import { ClickData, GlazeMessageType, isGlazeMessage, SetClickDataMessage } from '@glaze/types'
import { RefObject, useCallback, useLayoutEffect, useRef } from 'react'

export function useGlazeMessageListener(
  iframeRef: RefObject<HTMLIFrameElement>,
  clickEvents: ClickData[] | undefined
) {
  const clickEventsRef = useRef<ClickData[]>(clickEvents || [])
  clickEventsRef.current = clickEvents || []

  const sentClickEvents = useCallback(() => {
    const clickEventMessage: SetClickDataMessage = {
      type: GlazeMessageType.SET_CLICK_DATA,
      data: clickEventsRef.current
    }
    iframeRef.current?.contentWindow?.postMessage(clickEventMessage, '*')
  }, [iframeRef])

  useLayoutEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (isGlazeMessage(e.data)) {
        const { type } = e.data
        if (type === GlazeMessageType.HEATMAP_READY) {
          console.log('HEATMAP_READY')
          sentClickEvents()
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [sentClickEvents])

  useLayoutEffect(() => {
    clickEventsRef.current = clickEvents || []
    sentClickEvents()
    console.log('sentClickEvents', clickEventsRef.current)
  }, [clickEvents, sentClickEvents])
}
