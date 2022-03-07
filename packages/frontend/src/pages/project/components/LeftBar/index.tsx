import { Box } from '@chakra-ui/react'
import React, { FC, memo } from 'react'

export interface LeftBarProps {

}
const LeftBar:FC<LeftBarProps> = () => {
  return (
    <Box w="300px" className="border-r">
      Left Bar
    </Box>
  )
}
export default memo(LeftBar)
