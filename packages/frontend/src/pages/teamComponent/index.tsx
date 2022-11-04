import React, { FC, memo } from 'react'
import { Container, SimpleGrid, Text } from '@chakra-ui/react'
import { useTeamInfo, useTeamParamId } from '../../hooks/team.hook'
import { useQuery } from 'react-query'
import { ComponentApi } from '@glaze/common'
import ComponentCard from '../../components/ComponentCard'

export interface TeamComponentProps {}

const TeamComponent: FC<TeamComponentProps> = () => {
  const teamId = useTeamParamId()
  const { teamInfo } = useTeamInfo(teamId)
  const { data: res } = useQuery([ComponentApi.FULL_COMPONENT_PATH, 'team', teamId], () =>
    ComponentApi.getComponents({ ownerTeamId: teamId })
  )
  return (
    <Container maxW="container.md" py="24px">
      <Text fontSize="xl" fontWeight="bold" pb="20px">
        {teamInfo?.name} / Components
      </Text>
      <SimpleGrid columns={2} spacing={10}>
        {res?.data?.map((component) => (
          <ComponentCard component={component} key={component.id} />
        ))}
      </SimpleGrid>
    </Container>
  )
}

export default memo(TeamComponent)
