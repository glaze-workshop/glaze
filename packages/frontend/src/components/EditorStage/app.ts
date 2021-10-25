import { Application, Text, TextStyle } from 'pixi.js'

export const PixiApplication = new Application({ width: 100, height: 100 })
PixiApplication.view.style.width = '100%'
PixiApplication.view.style.height = '100%'

export const PixiApplicationResizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.target !== PixiApplication.view) {
      PixiApplication.renderer.resize(entry.contentRect.width, entry.contentRect.height)
      PixiApplication.render()
    }
  }
})

const style = new TextStyle({
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

const richText = new Text('Rich text with a lot of options and across multiple lines', style)
richText.x = 50
richText.y = 220

const skewStyle = new TextStyle({
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

const skewText = new Text('SKEW IS COOL', skewStyle)
skewText.skew.set(0.65, -0.3)
skewText.anchor.set(0.5, 0.5)
skewText.x = 300
skewText.y = 480
PixiApplication.stage.addChild(richText, skewText)
