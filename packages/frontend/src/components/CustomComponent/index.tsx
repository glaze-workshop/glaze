/* eslint-disable multiline-ternary */

import { FC, Suspense } from 'react'
import { CustomComponentInfo } from '../GlazeEditor/customSupport'
import ErrorBoundary from './ErrorBoundary'

interface CustomComponentProps {
  $componentInfo: CustomComponentInfo
}

const CustomComponent: FC<CustomComponentProps> = ({
  $componentInfo: { error, errorMsg, info, Component },
  ...props
}) => {
  return error ? (
    <h1>{errorMsg || `Request for ${info?.id} error`}</h1>
  ) : (
    <Suspense>
      {Component && (
        <ErrorBoundary errorContent={`Something wrong in ${info?.id}`}>
          <Component {...props} />
        </ErrorBoundary>
      )}
    </Suspense>
  )
}

export default CustomComponent
