import { Container, SimpleGrid, Text } from '@chakra-ui/react'
import { FC, memo } from 'react'
import { usePlugins } from '../../hooks/plugin.hook'
import { useTeamInfo, useTeamParamId } from '../../hooks/team.hook'
import PluginCard from '../../components/PluginCard'

export interface TeamPluginProps {}
const TeamPlugin: FC<TeamPluginProps> = () => {
  const teamId = useTeamParamId()
  const { teamInfo } = useTeamInfo(teamId)
  const { pluginsInfo } = usePlugins(teamId)

  return (
    <Container maxW="container.md" py="24px">
      <Text fontSize="xl" fontWeight="bold" pb="20px">
        {teamInfo?.name} / Plugin{' '}
      </Text>
      <SimpleGrid columns={2} spacing={10}>
        {pluginsInfo?.map((plugin) => (
          <PluginCard plugin={plugin} key={plugin.id} />
        ))}
      </SimpleGrid>
    </Container>
  )
}
export default memo(TeamPlugin)
