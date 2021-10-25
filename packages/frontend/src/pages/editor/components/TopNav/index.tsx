import React, { FC } from 'react'

export interface TopNavProps {
}

const TopNav:FC<TopNavProps> = () => {
  return (
    <div className="h-10 shadow-sm flex-shrink-0">
      <div>
        Top Nav
      </div>
    </div>
  )
}

export default TopNav
