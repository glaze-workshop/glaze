import { Component, ReactNode } from 'react'
import { Subject } from 'rxjs'

interface ErrorBoundaryProps {
  errorContent: string | JSX.Element
  children?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState,
  { hasError: boolean } | null
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  getSnapshotBeforeUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.children !== this.props.children) {
      console.log('getSnapshotBeforeUpdate')
      return { hasError: false }
    }
    return null
  }

  componentDidUpdate(
    prevProps: Readonly<ErrorBoundaryProps>,
    prevState: Readonly<ErrorBoundaryState>,
    snapshot: { hasError: boolean } | null | undefined
  ) {
    if (snapshot) {
      this.setState(snapshot)
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      const content = this.props.errorContent
      return typeof content === 'string' ? <h1>{content}</h1> : content
    }

    return this.props.children
  }
}
