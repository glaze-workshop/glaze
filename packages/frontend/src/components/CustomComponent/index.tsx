import React, { FC, Suspense } from 'react'

interface CustomComponentProps {
  componentName: string
}

const CustomComponent: FC<CustomComponentProps> = ({ componentName }) => {
  return (
    <Suspense fallback="component loading...">
      <div>CustomComponent {componentName}</div>
    </Suspense>
  )
}

export default CustomComponent
