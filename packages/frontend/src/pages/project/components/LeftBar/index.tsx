import React, { FC, memo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { icons } from './icon'

export interface LeftBarProps {}
const LeftBar: FC<LeftBarProps> = () => {
  const [type, setType] = useState('basic')

  return (
    <Box w="300px" className="border-r">
      Left Bar
    </Box>
  )
}
export default memo(LeftBar)
