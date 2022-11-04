import { FC, memo } from 'react'
import InputWithTmp from '../../../pages/project/components/RightBar/InputWithTmp'
import CtlWrapper from './CtlWrapper'

export interface TextCtlProps {
  name: string
  value: string
  onChange: (v: string) => unknown
}

const TextCtl: FC<TextCtlProps> = ({ name, value, onChange }) => {
  return (
    <CtlWrapper name={name}>
      <InputWithTmp value={value} onChange={onChange} />
    </CtlWrapper>
  )
}

export default memo(TextCtl)
