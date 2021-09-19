import React, { FC, memo, useRef, useEffect, useCallback } from 'react'
import * as PIXI from 'pixi.js'
const app = new PIXI.Application({ width: 640, height: 360 })
const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 36,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffffff', '#00ff99'], // gradient
  stroke: '#4a1850',
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round'
})

const richText = new PIXI.Text('Rich text with a lot of options and across multiple lines', style)
richText.x = 50
richText.y = 220

const skewStyle = new PIXI.TextStyle({
  fontFamily: 'Arial',
  dropShadow: true,
  dropShadowAlpha: 0.8,
  dropShadowAngle: 2.1,
  dropShadowBlur: 4,
  dropShadowColor: '0x111111',
  dropShadowDistance: 10,
  fill: ['#ffffff'],
  stroke: '#004620',
  fontSize: 60,
  fontWeight: 'lighter',
  lineJoin: 'round',
  strokeThickness: 12
})

const skewText = new PIXI.Text('SKEW IS COOL', skewStyle)
skewText.skew.set(0.65, -0.3)
skewText.anchor.set(0.5, 0.5)
skewText.x = 300
skewText.y = 480

export interface CenterProps {

}
const Center:FC<CenterProps> = () => {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = divRef.current
    node?.appendChild(app.view)
    if (divRef.current) {
      app.resizeTo = divRef.current
      app.resize()
    }
    app.stage.addChild(richText, skewText)

    return () => { node?.removeChild(app.view) }
  }, [])
  return (
    <div ref={divRef} className="w-full h-full">
    </div>
  )
}
export default memo(Center)
