import React, { FC } from 'react'
import { Rnd } from 'react-rnd'
import { Button } from '@chakra-ui/react'

export interface GlazeButtonProps {}

const GlazeButton: FC<GlazeButtonProps> = () => {
  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <Button colorScheme="blue">button</Button>
    </Rnd>
  )
}

export default GlazeButton
