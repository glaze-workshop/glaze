import React, { FC, memo } from 'react'
import EditorStage from '../../../../components/EditorStage'

export interface CenterProps {

}
const Center:FC<CenterProps> = () => {
  return (
    <EditorStage/>
  )
}
export default memo(Center)
