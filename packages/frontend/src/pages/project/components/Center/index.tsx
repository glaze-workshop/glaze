import GlazeEditor from '../../../../components/GlazeEditor'
import React, { FC, memo } from 'react'
import { useParams } from 'react-router-dom'

export interface CenterProps {}
const Center: FC<CenterProps> = () => {
  return <GlazeEditor />
}
export default memo(Center)
