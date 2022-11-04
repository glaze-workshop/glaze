import {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { Grid, GridItem, NumberInput, NumberInputField, Select } from '@chakra-ui/react'

export interface SelectAndNumProps<T> {
  options: ReactNode[]
  onChange: (info: [T, number]) => unknown
  value: [T, number?]
  showNum?: boolean
}

function SelectAndNum<T>({
  options,
  onChange,
  value: [s, n],
  showNum = true
}: SelectAndNumProps<T>) {
  const [tmp, setTmp] = useState(n ?? 0)

  const numRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTmp(Math.floor(n ?? 0))
  }, [n])

  const handleSelectChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      onChange([e.target.value as T, n ?? 0])
    },
    [n, onChange]
  )
  const handleNumberChange = useCallback((str: string, num: number) => {
    setTmp(isNaN(num) ? 0 : Math.floor(num))
  }, [])

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    (e) => {
      if (e.key === 'Enter') {
        onChange([s, tmp])
        numRef.current?.blur()
      }
    },
    [onChange, s, tmp]
  )

  const handleBlur = useCallback<FocusEventHandler<HTMLInputElement>>(() => {
    onChange([s, tmp])
  }, [onChange, s, tmp])

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={3} mb={3}>
      <GridItem w="100%">
        <Select value={s as string} size="sm" onChange={handleSelectChange}>
          {options}
        </Select>
      </GridItem>

      <GridItem w="100%">
        {showNum && (
          <NumberInput
            value={tmp}
            size="sm"
            precision={0}
            onChange={handleNumberChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          >
            <NumberInputField ref={numRef} />
          </NumberInput>
        )}
      </GridItem>
    </Grid>
  )
}

export default SelectAndNum
