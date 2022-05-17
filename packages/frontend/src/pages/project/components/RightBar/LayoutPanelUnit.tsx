import React, { FC, useState, useEffect, ChangeEvent, memo } from 'react'
import * as Y from 'yjs'
import {
  Select,
  NumberInput,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputField
} from '@chakra-ui/react'
import { LayoutSelectorProps, LayoutNumberCounterProps, YMapUpdater } from './layout.interface'
import { LengthUnit, Length } from '../../../../schema/length'
import { PositionType } from '../../../../schema/layout'
import { useShadowState } from '../../../../hooks/utils.hook'

export interface LayoutPanelUnitProps {
  selectorProps: LayoutSelectorProps
  numberCounterProps: LayoutNumberCounterProps
  yjsMapUpdater: any
  yMap: Y.Map<any>
}

const LayoutPanelUnit: FC<LayoutPanelUnitProps> = ({
  selectorProps,
  numberCounterProps,
  yjsMapUpdater,
  yMap
}: LayoutPanelUnitProps) => {
  const [selectorValue, setSelectorValue] = useShadowState(selectorProps.defaultValue)
  const [numberValue, setNumberValue] = useShadowState(numberCounterProps.defaultValue)

  useEffect(() => {
    setSelectorValue(selectorProps.defaultValue)
  }, [selectorProps])

  useEffect(() => {
    setNumberValue(numberCounterProps.defaultValue)
  }, [numberCounterProps])

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.options[e.target.options.selectedIndex].value
    setSelectorValue(newValue)
    yjsMapUpdater(yMap, [newValue, numberValue])
  }

  const handleNumberCounterChange = (value: any) => {
    setNumberValue(value)
    yjsMapUpdater(yMap, [selectorValue, value])
  }

  return (
    <>
      <Select placeholder={selectorValue} value={selectorValue} onChange={handleSelectChange}>
        {selectorProps.fullOptions
          .filter((opt) => opt !== selectorValue)
          .map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
      </Select>
      {selectorValue !== LengthUnit.AUTO ? (
        <NumberInput value={numberValue} onChange={handleNumberCounterChange} marginBottom="10px">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper bg="green.200" _active={{ bg: 'green.300' }} children="+" />
            <NumberDecrementStepper bg="pink.200" _active={{ bg: 'pink.300' }} children="-" />
          </NumberInputStepper>
        </NumberInput>
      ) : null}
    </>
  )
}

export default memo(LayoutPanelUnit)
