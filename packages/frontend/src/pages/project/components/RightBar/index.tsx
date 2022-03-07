import { Box } from '@chakra-ui/react'
import React, { FC, memo } from 'react'

export interface RightBarProps {

}
const RightBar:FC<RightBarProps> = () => {
  return (
    <Box w="300px" className="border-l">
      Right Bar
    </Box>
  )
}
export default memo(RightBar)
