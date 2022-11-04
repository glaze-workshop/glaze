import {
  ChangeEventHandler,
  FC,
  FocusEventHandler,
  KeyboardEventHandler,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { Input } from '@chakra-ui/react'

export interface InputWithTmpProps {
  value: string
  onChange: (v: string) => unknown
}

const InputWithTmp: FC<InputWithTmpProps> = ({ value, onChange }) => {
  const strInput = useRef<HTMLInputElement>(null)
  const [tmp, setTmp] = useState(value)
  useEffect(() => {
    setTmp(value)
  }, [value])

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setTmp(e.target.value)
  }, [])

  const handleEnter = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      if (e.key === 'Enter') {
        onChange(e.currentTarget.value)
        strInput.current?.blur()
      }
    },
    [onChange]
  )

  const handleBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
    (e) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  return (
    <Input
      ref={strInput}
      size="sm"
      value={tmp}
      onChange={handleChange}
      onKeyDown={handleEnter}
      onBlur={handleBlur}
    />
  )
}

export default memo(InputWithTmp)
