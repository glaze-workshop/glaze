import React from 'react'
import CustomComponent from '.'

export interface BoundComponentProps {}

const CustomComponentHOC = (componentName: string) => {
  const BoundComponent = () => {
    return <CustomComponent componentName={componentName} />
  }

  return BoundComponent
}

export default CustomComponentHOC
