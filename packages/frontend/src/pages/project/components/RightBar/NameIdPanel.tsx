import React, { FC, memo } from 'react'
import { Tag } from '@chakra-ui/react'

export interface NameIdPanelProps {
  nameInfo: string
  idInfo: string
}

const NameIdPanel: FC<NameIdPanelProps> = ({ nameInfo, idInfo }: NameIdPanelProps) => {
  return (
    <>
      <Tag size="lg" variant="solid" colorScheme="teal" marginBottom="10px">
        元素 : {nameInfo}
      </Tag>
      <Tag size="sm" variant="solid" colorScheme="teal">
        id : {idInfo}
      </Tag>
    </>
  )
}

export default memo(NameIdPanel)
