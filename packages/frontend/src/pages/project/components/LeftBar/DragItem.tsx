import React, { FC, useState } from 'react'
import { FieldNode } from '../../../../schema/config'
import { Box } from '@chakra-ui/react'
import cl from 'classnames'
import { Rnd } from 'react-rnd'

export interface DragItemProps {
  fieldItem: FieldNode
}

const DragItem: FC<DragItemProps> = ({ fieldItem }: DragItemProps) => {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: '100%',
        height: '40px'
      }}
      onDrag={(e) => e && setIsDragging(true)}
      onDragStop={(e) => e && setIsDragging(false)}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        w="100%"
        h="40px"
        bg="gray.50"
        border="1px"
        borderColor="gray.100"
        shadow="sm"
        fontSize="medium"
        cursor="move"
        rounded="md"
        className={cl('hover:border-indigo-500', {
          'opacity-50': isDragging
        })}
      >
        {fieldItem.type}
      </Box>
    </Rnd>
  )
}

export default DragItem
