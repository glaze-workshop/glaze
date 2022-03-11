import React, { FC } from 'react'
import { FieldNode } from '../../../../schema/config'
import DragItem from './DragItem'

export interface DragPanelProps {
  fields: FieldNode[]
}

export const DragPanel: FC<DragPanelProps> = ({ fields }: DragPanelProps) => {
  return (
    <>
      {fields.map((item) => (
        <DragItem key={item.type} fieldItem={item} />
      ))}
    </>
  )
}
