import React, { FC, memo, useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { icons } from './icon'
import { menus } from '../../../../schema/fields/index'
import cl from 'classnames'

export interface LeftBarProps {}
const LeftBar: FC<LeftBarProps> = () => {
  const [type, setType] = useState('GBC')
  const fields = menus.find((menu) => menu.key === type)

  return (
    <Flex w="250px" className="border-r">
      <Flex w="30%" flexDirection="column" alignItems="center">
        {menus.map(({ icon, key, panel }) => {
          const MenuIcon = icons[icon]
          return (
            <Flex
              key={key}
              onClick={() => setType(key)}
              w="100%"
              h="10%"
              alignItems="center"
              justifyContent="center"
              _hover={{
                opacity: '50%',
                backgroundColor: '#d0d9eb7e'
              }}
              className={cl('cursor-pointer border-transparent border-r-4', {
                'border-indigo-600 shadow': key === type
              })}
            >
              <MenuIcon active={key === type} />
            </Flex>
          )
        })}
      </Flex>
      <Box w="70%" padding="10px 0">
        {fields?.panel}
      </Box>
    </Flex>
  )
}
export default memo(LeftBar)