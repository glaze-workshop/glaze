import { GlazeComponentProps } from '../../../schema/config'
import React, { FC } from 'react'

export interface FrameProps extends GlazeComponentProps {

}

const Frame:FC<FrameProps> = ({ className, style }) => {
  return <div className={className} style={{
    width: 200,
    height: 100,
    ...style
  }}></div>
}
export default Frame
