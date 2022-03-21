import React, { FC, useState, useEffect, memo } from 'react'
import * as Y from 'yjs'
import {
  Tag,
  Box,
  Accordion,
  AccordionPanel,
  AccordionIcon,
  AccordionItem,
  AccordionButton
} from '@chakra-ui/react'
import { positionOption, lengthOption } from './layout.panel'
import { PositionType } from 'packages/frontend/src/schema/layout'
import LayoutPanelUnit from './LayoutPanelUnit'
import { widthUpdater, heightUpdater, positionUpdater } from './yjsMapUpdater'

export interface LayoutPanelProps {
  layoutInfo: Y.Map<any>
}

const LayoutPanel: FC<LayoutPanelProps> = ({
  layoutInfo
}: LayoutPanelProps) => {
  const [posOption, setPosOption] =
    useState<Array<PositionType>>(positionOption)
  const [posInfo, setPosInfo] = useState<any>()
  const [widthInfo, setWidthInfo] = useState<any>()
  const [heightInfo, setHeightInfo] = useState<any>()

  useEffect(() => {
    const positionInfo = layoutInfo.get('position')
    const wInfo = layoutInfo.get('width')
    const hInfo = layoutInfo.get('height')
    setPosInfo(positionInfo)
    setWidthInfo(wInfo)
    setHeightInfo(hInfo)
    // console.log('posInfo', posInfo)
    // console.log('wInfo', widthInfo)
    // console.log('hInfo', heightInfo)
  })

  return (
    <>
      <Tag size="md" variant="solid" colorScheme="teal" marginBottom="10px">
        Layout
      </Tag>
      <Accordion allowMultiple>
        {/** position panel */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                position
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {posInfo && (
              <>
                {' '}
                <LayoutPanelUnit
                  selectorProps={{
                    defaultValue: posInfo.type[0],
                    fullOptions: posOption
                  }}
                  numberCounterProps={{
                    defaultValue: posInfo[posInfo.type[0]],
                    yMap: layoutInfo
                  }}
                  yjsMapUpdater={positionUpdater}
                />
                <LayoutPanelUnit
                  selectorProps={{
                    defaultValue: posInfo.type[1],
                    fullOptions: posOption
                  }}
                  numberCounterProps={{
                    defaultValue: posInfo[posInfo.type[1]],
                    yMap: layoutInfo
                  }}
                  yjsMapUpdater={positionUpdater}
                />
              </>
            )}
          </AccordionPanel>
        </AccordionItem>
        {/** position panel */}
        {/** width panel */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                width
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {widthInfo && (
              <LayoutPanelUnit
                selectorProps={{
                  defaultValue: widthInfo[0],
                  fullOptions: lengthOption
                }}
                numberCounterProps={{
                  defaultValue: widthInfo[1],
                  yMap: layoutInfo
                }}
                yjsMapUpdater={widthUpdater}
              />
            )}
          </AccordionPanel>
        </AccordionItem>
        {/** width panel */}
        {/** height panel */}
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                height
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            {heightInfo && (
              <LayoutPanelUnit
                selectorProps={{
                  defaultValue: heightInfo[0],
                  fullOptions: lengthOption
                }}
                numberCounterProps={{
                  defaultValue: heightInfo[1],
                  yMap: layoutInfo
                }}
                yjsMapUpdater={heightUpdater}
              />
            )}
          </AccordionPanel>
        </AccordionItem>
        {/** height panel */}
      </Accordion>
    </>
  )
}

export default memo(LayoutPanel)
