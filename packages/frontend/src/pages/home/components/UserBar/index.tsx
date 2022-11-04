import {
  Avatar,
  Text,
  Flex,
  Skeleton,
  Menu,
  IconButton,
  MenuButton,
  MenuItem,
  MenuList,
  Icon
} from '@chakra-ui/react'
import { useCurrentUser } from '../../../../hooks/self.hook'
import { FC, memo, useMemo } from 'react'
import { FiMenu } from 'react-icons/fi'
import { useModalState } from '../../../../hooks/modal.hook'
import { Link } from 'react-router-dom'
import TeamJoinModal from './TeamJoinModal'

const UserBar: FC = () => {
  const userQuery = useCurrentUser()
  const userInfo = useMemo(() => userQuery.data?.data, [userQuery.data])
  const { isOpen, handleModalClose, handleModalOpen } = useModalState()
  return (
    <Flex alignItems="center" padding="4" justifyContent="space-between">
      <TeamJoinModal isOpen={isOpen} onClose={handleModalClose} />
      {userQuery.isLoading ? (
        <Skeleton height="20px" />
      ) : (
        <>
          <Flex flex="1" alignItems="center">
            <Avatar
              size="sm"
              name={userInfo?.nickname ?? userInfo?.username}
              src={userInfo?.avatar ?? undefined}
            ></Avatar>
            <Text fontWeight="bold" ml="4px">
              {userInfo?.nickname ?? userInfo?.username}
            </Text>
          </Flex>

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<Icon as={FiMenu} />}
              variant="outline"
              borderRadius="50%"
              bg="white"
            />
            <MenuList>
              <MenuItem onClick={handleModalOpen}>加入团队</MenuItem>
              <MenuItem as={Link} to={'/login'}>
                重新登录
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      )}
    </Flex>
  )
}
export default memo(UserBar)
