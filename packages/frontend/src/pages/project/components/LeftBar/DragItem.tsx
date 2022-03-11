import React, { FC } from 'react'
import { FieldNode } from '../../../../schema/config'
import cl from 'classnames'

export interface DragItemProps {
  fieldItem: FieldNode
}

const DragItem: FC<DragItemProps> = ({ fieldItem }: DragItemProps) => {
  return (
    <div
      className={cl(
        'p-2 border border-gray-200 text-center text-gray-600 shadow-sm rounded-sm bg-gray-50 cursor-move hover:bg-gray-100 hover:text-gray-900 hover:border-indigo-500'
      )}
    >
      {fieldItem.type}
    </div>
  )
}

export default DragItem
