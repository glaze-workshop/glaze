import React, { FC } from 'react'

export interface LeftBarProps {

}
const LeftBar:FC<LeftBarProps> = () => {
  return (
    <div className="w-80 border-r">
      Left Bar
    </div>
  )
}
export default LeftBar
