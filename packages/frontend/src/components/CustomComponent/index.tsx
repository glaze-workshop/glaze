/* eslint-disable multiline-ternary */

import React, { FC, Suspense, useEffect } from 'react'
import { Log } from '../../utils/log'
import { useCustomComponent } from '../GlazeEditor/customSupport'
import ErrorBoundary from './ErrorBoundary'

interface CustomComponentProps {
  componentName: string
}

const CustomComponent: FC<CustomComponentProps> = ({ componentName }) => {
  // const { loading, error, errorMsg, info, Component } = useCustomComponent(componentName)

  // useEffect(() => {
  //   Log.EditorCustomComponent(`${componentName} info`, info)
  // }, [info])
  //
  // const fallback = `Component ${componentName} loading...`
  //
  // return error ? (
  //   <h1>{errorMsg || `Request for ${componentName} error`}</h1>
  // ) : (
  //   <Suspense fallback={fallback}>
  //     {Component && (
  //       <ErrorBoundary errorContent={`Something wrong in ${componentName}`}>
  //         <Component />
  //       </ErrorBoundary>
  //     )}
  //   </Suspense>
  // )
  return <></>
}

export default CustomComponent
