import { SimpleGrid } from '@chakra-ui/react'
import React, { FC, memo } from 'react'
import PluginCard from '../../../../../components/PluginCard'
import { usePlugins } from '../../../../../hooks/plugin.hook'
import { useProjectInfoUnderParam } from '../../../../../hooks/project.hook'

export interface PluginMarketProps {}
const PluginMarket: FC<PluginMarketProps> = () => {
  const { projectId } = useProjectInfoUnderParam()
  const { pluginsInfo } = usePlugins()
  return (
    <SimpleGrid columns={2} spacing={10}>
      {pluginsInfo?.map((plugin) => (
        <PluginCard
          to={`/project/${projectId}/dashboard/analysis/plugin/${encodeURIComponent(plugin.id)}`}
          plugin={plugin}
          key={plugin.id}
        />
      ))}
    </SimpleGrid>
  )
}

export default memo(PluginMarket)
