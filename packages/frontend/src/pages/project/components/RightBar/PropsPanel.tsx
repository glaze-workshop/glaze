import React, { FC } from 'react'
import { Tag } from '@chakra-ui/react'

export interface PropsPanelProps {}

const PropsPanel: FC<PropsPanelProps> = () => {
  return (
    <Tag size="md" variant="solid" colorScheme="teal" margin="10px 0" width="60px">
      Props
    </Tag>
  )
}

export default PropsPanel
