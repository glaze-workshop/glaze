import React, { FC, useEffect } from 'react'
import { FieldNode } from '../../../../schema/config'
import DragItem from './DragItem'
import { Box } from '@chakra-ui/react'
import { useCustomComponentList } from '../../../../components/GlazeEditor/customSupport'

export interface DragPanelProps {}

// Drag Panel for Custom components
export const CustomDragPanel: FC<DragPanelProps> = ({}) => {
  const componentList = useCustomComponentList()

  useEffect(() => {
    console.log('componentList', componentList)
  }, [componentList])

  return (
    <Box position="relative" w="90%" h="100%" margin="0 auto">
      {componentList.map((item, i) => (
        <DragItem key={item.id} fieldItem={{ type: item.name }} index={i} componentId={item.id} />
      ))}
    </Box>
  )
}
