import React, { FC, memo, useRef, useEffect } from 'react'
import { Application, TextStyle, Text } from 'pixi.js'
import * as PIXI from 'pixi.js'
import EditorStage from '../../../../components/EditorStage';

(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
    (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })

export interface CenterProps {

}
const Center:FC<CenterProps> = () => {
  return (
    <EditorStage/>
  )
}
export default memo(Center)
