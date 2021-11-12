
import React, { FC } from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import GlazeInput, { GlazeInputNumberProps } from './index'
import { ChakraProvider } from '@chakra-ui/react'

const meta: ComponentMeta<FC<GlazeInputNumberProps>> = {
  title: 'Common/GlazeInputNumber',
  component: GlazeInput
}

export default meta

const Template: ComponentStory<FC<GlazeInputNumberProps>> =
  (args) => (
    <GlazeInput {...args} />
  )

export const Primary = Template.bind({})

Primary.args = {
  value: '2'
}
