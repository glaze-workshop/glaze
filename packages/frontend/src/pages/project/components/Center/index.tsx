import GlazeEditor from '../../../../components/GlazeEditor'
import React, { FC, memo } from 'react'

export interface CenterProps {

}
const Center:FC<CenterProps> = () => {
  return (
    <GlazeEditor />
  )
}
export default memo(Center)