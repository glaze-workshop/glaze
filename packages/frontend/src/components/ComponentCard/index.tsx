import { Flex, Box, Badge, Text } from '@chakra-ui/react'
import { Entity } from '@glaze/common'
import { FC, memo } from 'react'
import dayjs from 'dayjs'

export interface ComponentCardProps {
  component: Entity.GlazeComponentEntity
}
const ComponentCard: FC<ComponentCardProps> = ({ component }) => {
  return (
    <Flex
      p={3}
      direction="column"
      justifyContent="space-between"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      alignItems="stretch"
    >
      <Box>
        <Text fontWeight="bold">
          {component.name}
          <Badge ml={1}>{component.type}</Badge>
        </Text>
        <Text>{component.id}</Text>
      </Box>
      <Text fontSize="sm">
        By {component.lastUpdateBy?.nickname ?? component.lastUpdateBy?.username}{' '}
        {dayjs(component.updatedAt).fromNow()}
      </Text>
    </Flex>
  )
}
export default memo(ComponentCard)
