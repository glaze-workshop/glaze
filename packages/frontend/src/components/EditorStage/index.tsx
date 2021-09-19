import React, { FC, memo } from 'react'
import { useEffect } from '.pnpm/@storybook+addons@6.3.7_react-dom@17.0.2+react@17.0.2/node_modules/@storybook/addons'

export interface EditorStageProps {

}
const EditorStage:FC<EditorStageProps> = () => {
  useEffect(() => {

  }, [])
  return <div>hi</div>
}
export default memo(EditorStage)
