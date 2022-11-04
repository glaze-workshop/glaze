import { FC, useMemo } from 'react'
import { FormControl, FormLabel } from '@chakra-ui/react'
import * as Y from 'yjs'
import { AllComponentsSubject } from '../../../../components/GlazeEditor/state'
import { useObservableEagerState } from 'observable-hooks'
import { map } from 'rxjs'
import { ControlType } from '@glaze/types'
import BackgroundCtl from '../../../../components/GlazeEditor/ctl/BackgroundCtl'
import { useYjsRerender } from '../../../../components/GlazeEditor/yjs.hook'
import TextCtl from '../../../../components/GlazeEditor/ctl/TextCtl'
import FontCtl from '../../../../components/GlazeEditor/ctl/FontCtl'

export interface PropsPanelProps {
  propsInfo: Y.Map<any>
  componentId: string
}

const PropsPanel: FC<PropsPanelProps> = ({ propsInfo, componentId }) => {
  const component = useMemo(() => AllComponentsSubject.value.get(componentId), [componentId])
  // change when component config change
  useObservableEagerState(AllComponentsSubject.pipe(map((m) => m.get(componentId))))

  useYjsRerender(propsInfo)

  return component ? (
    <FormControl>
      <FormLabel>Props</FormLabel>
      {Object.keys(component.config.props).map((k) => {
        const prop = component.config.props[k]
        const changeProps = (v: any) => {
          propsInfo.set(k, v)
        }

        switch (prop.type) {
          case ControlType.BACKGROUND:
            return (
              <BackgroundCtl name={prop.name} value={propsInfo.get(k)} onChange={changeProps} />
            )
          case ControlType.TEXT:
            return <TextCtl name={prop.name} value={propsInfo.get(k)} onChange={changeProps} />
          case ControlType.FONT:
            return <FontCtl name={prop.name} value={propsInfo.get(k)} onChange={changeProps} />
        }
      })}
    </FormControl>
  ) : (
    <></>
  )
}

export default PropsPanel
