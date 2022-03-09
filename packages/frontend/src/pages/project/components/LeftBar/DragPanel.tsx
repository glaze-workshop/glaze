import React, { FC } from 'react'
import { FieldNode } from '../../../../schema/config'

export interface DragPanelProps {
  fields: FieldNode[]
}

export const DragPanel: FC<DragPanelProps> = ({ fields }: DragPanelProps) => {
  return <div>DragPanel</div>
}
