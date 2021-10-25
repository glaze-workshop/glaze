import React, { FC, memo, RefCallback, useCallback, useEffect, useRef } from 'react'
import { PixiApplication, PixiApplicationResizeObserver } from './app'

export interface EditorStageProps {

}
const EditorStage:FC<EditorStageProps> = () => {
  const updateDevRef: RefCallback<HTMLDivElement> = useCallback((ref) => {
    console.log(ref)
    if (ref?.children && !Array.from(ref?.children).includes(PixiApplication.view)) {
      ref.appendChild(PixiApplication.view)
      PixiApplicationResizeObserver.observe(ref)
    }
  }, [])

  return <div className="overflow-hidden flex-1" ref={updateDevRef} />
}
export default memo(EditorStage)
