import { SimpleGrid } from '@chakra-ui/react'
import { FC, memo } from 'react'
import PluginCard from '../../../../../components/PluginCard'
import { useProjectInfoUnderParam, useProjectUsedPlugins } from '../../../../../hooks/project.hook'

export interface ProjectPluginProps {}
const ProjectPlugin: FC<ProjectPluginProps> = () => {
  const { projectId } = useProjectInfoUnderParam()
  const { pluginsInfo } = useProjectUsedPlugins(projectId)
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
export default memo(ProjectPlugin)
