/* eslint-disable multiline-ternary */

import React, { FC, Suspense, useEffect } from 'react'
import { Log } from '../../utils/log'
import { useCustomComponent } from '../GlazeEditor/customSupport'

interface CustomComponentProps {
  componentName: string
}

const CustomComponent: FC<CustomComponentProps> = ({ componentName }) => {
  const { loading, error, info, Component } = useCustomComponent(componentName)

  useEffect(() => {
    Log.EditorCustomComponent(`${componentName} info`, info)
  }, [info])

  const fallback = `Component ${componentName} loading...`

  return error ? (
    <h1>Something wrong with {componentName}</h1>
  ) : (
    <Suspense fallback={fallback}>{Component && <Component />}</Suspense>
  )
}

export default CustomComponent
