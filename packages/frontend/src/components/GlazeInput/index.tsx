import React, { ChangeEventHandler, FC, useCallback } from 'react'
import {
  Input
} from '@chakra-ui/react'

export interface GlazeInputNumberProps {
  value: string
  onChange?: (value: string) => unknown
}

const GlazeInput: FC<GlazeInputNumberProps> = ({ value, onChange }) => {
  const onChangeCallback = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    onChange?.(event.target.value)
  }, [onChange])
  return (
    <Input size="sm" value={value} onChange={onChangeCallback} />
  )
}

export default GlazeInput
