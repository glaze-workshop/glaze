import { Flex, AspectRatio, Box, Badge, Image, Text } from '@chakra-ui/react'
import { Entity } from '@glaze/common'
import React, { FC, memo } from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

export interface PluginCardProps {
  plugin: Entity.GlazePluginEntity
  to?: string
}
const PluginCard:FC<PluginCardProps> = ({ plugin, to }) => {
  return (
    <Flex as={to ? Link : undefined} to={to !} key={plugin.id} borderWidth='1px' borderRadius='lg' overflow='hidden' alignItems="stretch" cursor={to ? 'pointer' : undefined}>
      <AspectRatio w="100px" ratio={1} flexShrink="0">
        <Image src={plugin.icon ?? ''} fallbackSrc='https://bit.ly/naruto-sage' alt='naruto' objectFit='cover' />
      </AspectRatio>
      <Flex p={3} direction="column" justifyContent="space-between">
        <Box>
          <Text fontWeight="bold">
            {plugin.name}
            <Badge ml={1}>{plugin.type}</Badge>
          </Text>
          <Text>{plugin.id}</Text>
        </Box>
        <Text fontSize="sm">By {plugin.lastUpdateBy?.nickname ?? plugin.lastUpdateBy?.username} {dayjs(plugin.updatedAt).fromNow()}</Text>
      </Flex>
    </Flex>
  )
}
export default memo(PluginCard)
