import React, { FC, memo, useState, useEffect } from 'react'
import * as Y from 'yjs'
import {
  NumberInput,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputField
} from '@chakra-ui/react'

export interface NumberCounterProps {
  defaultValue: any
  yMap: Y.Map<any>
  yjsMapUpdater: (yMap: Y.Map<any>, key: string, newValue: any) => void
}

const NumberCounter: FC<NumberCounterProps> = ({
  defaultValue,
  yMap,
  yjsMapUpdater
}: NumberCounterProps) => {
  const [value, setValue] = useState()

  const handleChange = (value: any) => {
    setValue(value)
    console.log('new panel W value', value)
    console.log('old yMap W value', yMap.get('width'))
    yjsMapUpdater(yMap, 'width', ['fixed', Number(value)])
    console.log('new yMap W value', yMap.get('width'))
  }

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <NumberInput value={value} onChange={handleChange} marginBottom="10px">
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
  )
}

export default memo(NumberCounter)
