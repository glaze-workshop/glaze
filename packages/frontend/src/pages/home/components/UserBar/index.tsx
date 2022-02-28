import { Avatar, Text, Flex, Skeleton, Menu, IconButton, MenuButton, MenuItem, MenuList, Icon } from '@chakra-ui/react'
import { useCurrentUser } from '../../../../hooks/self.hook'
import React, { FC, memo, useMemo } from 'react'
import { FiMenu } from 'react-icons/fi'

const UserBar:FC = () => {
  const userQuery = useCurrentUser()
  const userInfo = useMemo(() => userQuery.data?.data, [userQuery.data])
  return (
    <Flex alignItems="center" padding="4" justifyContent="space-between">
      {userQuery.isLoading
        ? <Skeleton height='20px' />
        : (
          <>
            <Flex flex="1" alignItems="center">
              <Avatar size="sm" name={userInfo?.nickname ?? userInfo?.username} src={userInfo?.avatar ?? undefined}></Avatar>
              <Text fontWeight="bold" ml="4px">{userInfo?.nickname ?? userInfo?.username}</Text>
            </Flex>

            <Menu>
              <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<Icon as={FiMenu} />}
                variant='outline'
                borderRadius="50%"
                bg="white"
              />
              <MenuList>
                <MenuItem command='⌘T'>
                  New Tab
                </MenuItem>
                <MenuItem command='⌘N'>
                  New Window
                </MenuItem>
                <MenuItem command='⌘⇧N'>
                  Open Closed Tab
                </MenuItem>
                <MenuItem command='⌘O'>
                  Open File...
                </MenuItem>
              </MenuList>
            </Menu>
          </>
          )}
    </Flex>
  )
}
export default memo(UserBar)
