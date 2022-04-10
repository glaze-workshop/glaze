import { FC, memo } from 'react'
import { useObservableEagerState } from 'observable-hooks'
import { AllCooperateUserState } from '../../../../../components/GlazeEditor/state'
import { Avatar, Box, Flex, HStack } from '@chakra-ui/react'

const Cooperator: FC = () => {
  const cooperatorList = useObservableEagerState(AllCooperateUserState)

  return (
    <HStack w="200px" justifyContent="end">
      {cooperatorList
        .filter(({ userInfo }) => userInfo)
        .map(({ userInfo, clientId, color }) => (
          <Flex key={clientId} direction="column" align="center">
            <Avatar
              size="sm"
              bg={color}
              name={userInfo?.nickname ?? userInfo?.username}
              src={userInfo?.avatar ?? undefined}
            />
            <Box mt="5px" bg={color} w="20px" h="4px" />
          </Flex>
        ))}
    </HStack>
  )
}

export default memo(Cooperator)
