import CustomComponent from '.'
import { CustomComponentInfo } from '../GlazeEditor/customSupport'
import { BehaviorSubject } from 'rxjs'
import { useObservableEagerState } from 'observable-hooks'

const CustomComponentHOC = (componentInfo$: BehaviorSubject<CustomComponentInfo>) => {
  return (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const component = useObservableEagerState(componentInfo$)
    return <CustomComponent $componentInfo={component} {...props} />
  }
}

export default CustomComponentHOC
