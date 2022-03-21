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
import {
  LayoutSelectorProps,
  LayoutNumberCounterProps
} from './layout.interface'
import { LengthUnit } from '../../../../schema/length'

export interface LayoutPanelUnitProps {
  selectorProps: LayoutSelectorProps
  numberCounterProps: LayoutNumberCounterProps
  yjsMapUpdater: (yMap: Y.Map<any>, newValue: any) => void
  yMap: Y.Map<any>
}

const LayoutPanelUnit: FC<LayoutPanelUnitProps> = ({
  selectorProps,
  numberCounterProps,
  yjsMapUpdater,
  yMap
}: LayoutPanelUnitProps) => {
  const [selectorValue, setSelectorValue] = useState('')
  const [numberValue, setNumberValue] = useState(0)

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
      <Select
        placeholder={selectorValue}
        value={selectorValue}
        onChange={handleSelectChange}
      >
        {selectorProps.fullOptions
          .filter((opt) => opt !== selectorValue)
          .map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
      </Select>
      {selectorValue !== LengthUnit.AUTO ? (
        <NumberInput
          value={numberValue}
          onChange={handleNumberCounterChange}
          marginBottom="10px"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper
              bg="green.200"
              _active={{ bg: 'green.300' }}
              children="+"
            />
            <NumberDecrementStepper
              bg="pink.200"
              _active={{ bg: 'pink.300' }}
              children="-"
            />
          </NumberInputStepper>
        </NumberInput>
      ) : null}
    </>
  )
}

export default memo(LayoutPanelUnit)
