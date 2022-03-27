import { FC, memo, useEffect, useRef } from 'react'
import flatpickr from 'flatpickr'
import { Input } from '@chakra-ui/react'
import * as _ from 'lodash'

export interface FlatPickerProps {
  initConfig?: flatpickr.Options.Options | undefined
  value?: Date[]
  onChange?: (date: Date[]) => void
}

const FlatPicker: FC<FlatPickerProps> = ({ initConfig, onChange, value }) => {
  const ref = useRef<HTMLInputElement>(null)
  const flatpickrRef = useRef<flatpickr.Instance>()
  useEffect(() => {
    if (ref.current) {
      flatpickrRef.current = flatpickr(ref.current, {
        defaultDate: value,
        ...initConfig
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    flatpickrRef.current?.setDate(value ?? [])
  }, [value])

  useEffect(() => {
    flatpickrRef.current?.config.onChange.push(onChange ?? _.noop)
    return () => {
      flatpickrRef.current?.config.onChange.pop()
    }
  }, [onChange])

  return <Input w="250px" ref={ref} />
}
export default memo(FlatPicker)
