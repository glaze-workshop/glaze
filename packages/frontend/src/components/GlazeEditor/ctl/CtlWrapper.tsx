import { FC, memo, ReactNode } from 'react'
import { FormControl, FormLabel } from '@chakra-ui/react'

export interface CtlWrapperProps {
  name: string
  children: ReactNode
}

const CtlWrapper: FC<CtlWrapperProps> = ({ name, children }) => {
  return (
    <FormControl mb={3}>
      <FormLabel size="sm" color="gray.600">
        {name}
      </FormLabel>
      {children}
    </FormControl>
  )
}

export default memo(CtlWrapper)
