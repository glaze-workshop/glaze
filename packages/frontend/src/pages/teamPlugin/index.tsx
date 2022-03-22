import { AspectRatio, Box, Container, Badge, SimpleGrid, Text, Image, Flex, Code } from '@chakra-ui/react'
import React, { FC, memo } from 'react'
import { usePlugins } from '../../hooks/plugin.hook'
import { useTeamInfo, useTeamParamId } from '../../hooks/team.hook'
import dayjs from 'dayjs'

export interface TeamPluginProps {

}
const TeamPlugin:FC<TeamPluginProps> = () => {
  const teamId = useTeamParamId()
  const { teamInfo } = useTeamInfo(teamId)
  const { pluginsInfo } = usePlugins(teamId)

  return (
    <Container maxW="container.md" py="24px">
      <Text fontSize='xl' fontWeight="bold" pb="20px">{teamInfo?.name} / Plugin </Text>
      <SimpleGrid columns={2} spacing={10}>
        {pluginsInfo?.map(plugin => (
          <Flex key={plugin.id} borderWidth='1px' borderRadius='lg' overflow='hidden' alignItems="stretch">
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
        ))}
      </SimpleGrid>
    </Container>
  )
}
export default memo(TeamPlugin)
