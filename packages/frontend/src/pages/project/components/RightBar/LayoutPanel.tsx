import React, { FC, useState, useEffect, memo } from 'react'
import * as Y from 'yjs'
import {
  Tag,
  Box,
  Select,
  Accordion,
  AccordionPanel,
  AccordionIcon,
  AccordionItem,
  AccordionButton
} from '@chakra-ui/react'
import { positionOption } from './panel'
import { PositionType } from 'packages/frontend/src/schema/layout'
import NumberCounter from './NumberCounter'

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
    // console.log('layoutPanel position', positionInfo)
    // console.log('layoutPanel width', wInfo)
    // console.log('layoutPanel height', hInfo)
    setPosInfo(positionInfo)
    setWidthInfo(wInfo)
    setHeightInfo(hInfo)
  })

  const yjsMapUpdater = (
    yMap: Y.Map<any>,
    key: string,
    newValue: any
  ): void => {
    yMap.set(key, newValue)
  }

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
                <Select placeholder={posInfo.type[0]}>
                  {posOption
                    .filter((pos) => pos !== posInfo.type[0])
                    .map((item) => (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    ))}
                </Select>
                {/* <NumberCounter defaultValue={posInfo[posInfo.type[0]]} /> */}
                <Select placeholder={posInfo.type[1]}>
                  {posOption
                    .filter((pos) => pos !== posInfo.type[1])
                    .map((item) => (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    ))}
                </Select>
                {/* <NumberCounter defaultValue={posInfo[posInfo.type[1]]} /> */}
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
              <>
                <Select placeholder={widthInfo[0]}></Select>
                <NumberCounter
                  defaultValue={widthInfo[1]}
                  yMap={layoutInfo}
                  yjsMapUpdater={yjsMapUpdater}
                />
              </>
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
              <>
                <Select placeholder={heightInfo[0]}></Select>
                {/* <NumberCounter defaultValue={heightInfo[1]} /> */}
              </>
            )}
          </AccordionPanel>
        </AccordionItem>
        {/** height panel */}
      </Accordion>
    </>
  )
}

export default memo(LayoutPanel)
