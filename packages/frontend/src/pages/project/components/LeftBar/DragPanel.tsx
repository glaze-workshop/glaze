import React, { FC } from 'react'
import { FieldNode } from '../../../../schema/config'
import DragItem from './DragItem'
import { Box } from '@chakra-ui/react'

export interface DragPanelProps {
  fields: FieldNode[]
}

export const DragPanel: FC<DragPanelProps> = ({ fields }: DragPanelProps) => {
  return (
    <Box position="relative" w="90%" h="100%" margin="0 auto">
      {fields.map((item) => (
        <DragItem key={item.type} fieldItem={item} />
      ))}
    </Box>
  )
}
