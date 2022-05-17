import { FC, memo } from 'react'

export interface GlazeComponentConfigProps {}

const GlazeComponentConfig: FC<GlazeComponentConfigProps> = () => {
  return <div>hi</div>
}

export default memo(GlazeComponentConfig)
