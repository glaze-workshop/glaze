import React, { FC, memo, useCallback, useMemo } from 'react'
import * as Y from 'yjs'
import { FormControl, FormLabel, Tag } from '@chakra-ui/react'
import { LayoutConfig, LengthUnit, PositionType } from '@glaze/types'
import { useYjsMapProxy } from '../../../../components/GlazeEditor/yjs.hook'
import SelectAndNum from './SelectAndNum'
import { notEmpty } from '@glaze/common'
import { BehaviorSubject } from 'rxjs'
import { useObservableEagerState } from 'observable-hooks'

export const layoutChange$ = new BehaviorSubject<number>(0)
export const triggerRightLayoutChange = () => layoutChange$.next(layoutChange$.value + 1)

export interface LayoutPanelProps {
  layoutInfo: Y.Map<any>
}

const LayoutPanel: FC<LayoutPanelProps> = ({ layoutInfo }: LayoutPanelProps) => {
  useObservableEagerState(layoutChange$)

  const layout = useYjsMapProxy<LayoutConfig>(layoutInfo)

  const position = layout.position
  const width = layout.width
  const height = layout.height

  const leftRightValue = useMemo<[PositionType, number]>(() => {
    if (notEmpty(position.right)) {
      return [PositionType.RIGHT, position.right]
    } else {
      return [PositionType.LEFT, position.left ?? 0]
    }
  }, [position.left, position.right])

  const topBottomValue = useMemo<[PositionType, number]>(() => {
    if (notEmpty(position.bottom)) {
      return [PositionType.BOTTOM, position.bottom]
    } else {
      return [PositionType.TOP, position.top ?? 0]
    }
  }, [position.bottom, position.top])

  const handlePositionChange = useCallback(
    ([p, n]: [PositionType, number]) => {
      switch (p) {
        case PositionType.TOP:
          position.top = n
          position.bottom = null
          break
        case PositionType.BOTTOM:
          position.bottom = n
          position.top = null
          break
        case PositionType.LEFT:
          position.left = n
          position.right = null
          break
        case PositionType.RIGHT:
          position.right = n
          position.left = null
          break
      }
      layout.position = position
      triggerRightLayoutChange()
    },
    [layout, position]
  )

  const handleWidthChange = useCallback(
    ([l, n]: [`${LengthUnit}`, number]) => {
      if (l === LengthUnit.AUTO) {
        layout.width = [l]
      } else {
        layout.width = [l, n]
      }
      triggerRightLayoutChange()
    },
    [layout]
  )

  const handleHeightChange = useCallback(
    ([l, n]: [`${LengthUnit}`, number]) => {
      if (l === LengthUnit.AUTO) {
        layout.height = [l]
      } else {
        layout.height = [l, n]
      }
      triggerRightLayoutChange()
    },
    [layout]
  )

  return (
    <>
      <FormControl>
        <FormLabel>Position</FormLabel>
        <SelectAndNum<PositionType>
          value={leftRightValue}
          onChange={handlePositionChange}
          options={[
            <option key={PositionType.LEFT} value={PositionType.LEFT}>
              left
            </option>,
            <option key={PositionType.RIGHT} value={PositionType.RIGHT}>
              right
            </option>
          ]}
        />
        <SelectAndNum<PositionType>
          value={topBottomValue}
          onChange={handlePositionChange}
          options={[
            <option key={PositionType.TOP} value={PositionType.TOP}>
              top
            </option>,
            <option key={PositionType.BOTTOM} value={PositionType.BOTTOM}>
              bottom
            </option>
          ]}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Width</FormLabel>
        <SelectAndNum<`${LengthUnit}`>
          value={width}
          onChange={handleWidthChange}
          options={[
            <option key={LengthUnit.FIXED} value={LengthUnit.FIXED}>
              fixed
            </option>,
            <option key={LengthUnit.PERCENT} value={LengthUnit.PERCENT}>
              percent
            </option>,
            <option key={LengthUnit.AUTO} value={LengthUnit.AUTO}>
              auto
            </option>
          ]}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Height</FormLabel>
        <SelectAndNum<`${LengthUnit}`>
          value={height}
          onChange={handleHeightChange}
          options={[
            <option key={LengthUnit.FIXED} value={LengthUnit.FIXED}>
              fixed
            </option>,
            <option key={LengthUnit.PERCENT} value={LengthUnit.PERCENT}>
              percent
            </option>,
            <option key={LengthUnit.AUTO} value={LengthUnit.AUTO}>
              auto
            </option>
          ]}
        />
      </FormControl>

      {/* <Accordion allowMultiple> */}
      {/*   /!** position panel *!/ */}
      {/*   <AccordionItem> */}
      {/*     <h2> */}
      {/*       <AccordionButton> */}
      {/*         <Box flex="1" textAlign="left"> */}
      {/*           position */}
      {/*         </Box> */}
      {/*         <AccordionIcon /> */}
      {/*       </AccordionButton> */}
      {/*     </h2> */}
      {/*     <AccordionPanel pb={4}> */}
      {/*       {posInfo && ( */}
      {/*         <> */}
      {/*           <LayoutPanelUnit */}
      {/*             selectorProps={{ */}
      {/*               defaultValue: posInfo.type[0], */}
      {/*               fullOptions: */}
      {/*                 posInfo.type[0] === PositionType.LEFT || */}
      {/*                 posInfo.type[0] === PositionType.RIGHT */}
      {/*                   ? LRposOption */}
      {/*                   : TBposOption */}
      {/*             }} */}
      {/*             numberCounterProps={{ */}
      {/*               defaultValue: posInfo[posInfo.type[0]] */}
      {/*             }} */}
      {/*             yjsMapUpdater={positionUpdater} */}
      {/*             yMap={layoutInfo} */}
      {/*           /> */}
      {/*           <LayoutPanelUnit */}
      {/*             selectorProps={{ */}
      {/*               defaultValue: posInfo.type[1], */}
      {/*               fullOptions: */}
      {/*                 posInfo.type[1] === PositionType.LEFT || */}
      {/*                 posInfo.type[1] === PositionType.RIGHT */}
      {/*                   ? LRposOption */}
      {/*                   : TBposOption */}
      {/*             }} */}
      {/*             numberCounterProps={{ */}
      {/*               defaultValue: posInfo[posInfo.type[1]] */}
      {/*             }} */}
      {/*             yjsMapUpdater={positionUpdater} */}
      {/*             yMap={layoutInfo} */}
      {/*           /> */}
      {/*         </> */}
      {/*       )} */}
      {/*     </AccordionPanel> */}
      {/*   </AccordionItem> */}
      {/*   /!** position panel *!/ */}
      {/*   /!** width panel *!/ */}
      {/*   <AccordionItem> */}
      {/*     <h2> */}
      {/*       <AccordionButton> */}
      {/*         <Box flex="1" textAlign="left"> */}
      {/*           width */}
      {/*         </Box> */}
      {/*         <AccordionIcon /> */}
      {/*       </AccordionButton> */}
      {/*     </h2> */}
      {/*     <AccordionPanel pb={4}> */}
      {/*       {widthInfo && ( */}
      {/*         <LayoutPanelUnit */}
      {/*           selectorProps={{ */}
      {/*             defaultValue: widthInfo[0], */}
      {/*             fullOptions: lengthOption */}
      {/*           }} */}
      {/*           numberCounterProps={{ */}
      {/*             defaultValue: widthInfo[1] */}
      {/*           }} */}
      {/*           yjsMapUpdater={widthUpdater} */}
      {/*           yMap={layoutInfo} */}
      {/*         /> */}
      {/*       )} */}
      {/*     </AccordionPanel> */}
      {/*   </AccordionItem> */}
      {/*   /!** width panel *!/ */}
      {/*   /!** height panel *!/ */}
      {/*   <AccordionItem> */}
      {/*     <h2> */}
      {/*       <AccordionButton> */}
      {/*         <Box flex="1" textAlign="left"> */}
      {/*           height */}
      {/*         </Box> */}
      {/*         <AccordionIcon /> */}
      {/*       </AccordionButton> */}
      {/*     </h2> */}
      {/*     <AccordionPanel> */}
      {/*       {heightInfo && ( */}
      {/*         <LayoutPanelUnit */}
      {/*           selectorProps={{ */}
      {/*             defaultValue: heightInfo[0], */}
      {/*             fullOptions: lengthOption */}
      {/*           }} */}
      {/*           numberCounterProps={{ */}
      {/*             defaultValue: heightInfo[1] */}
      {/*           }} */}
      {/*           yjsMapUpdater={heightUpdater} */}
      {/*           yMap={layoutInfo} */}
      {/*         /> */}
      {/*       )} */}
      {/*     </AccordionPanel> */}
      {/*   </AccordionItem> */}
      {/*   /!** height panel *!/ */}
      {/* </Accordion> */}
    </>
  )
}

export default memo(LayoutPanel)
