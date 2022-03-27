import { Box, Flex, VStack } from '@chakra-ui/react'
import { useProjectInfoUnderParam } from '../../../../hooks/project.hook'
import { FC } from 'react'
import NavLink from '../../../../components/NavList/NavLink'
import { Outlet } from 'react-router-dom'

export interface AnalysisProps {}

const Analysis: FC<AnalysisProps> = () => {
  const { projectId } = useProjectInfoUnderParam()
  return (
    <Flex>
      <VStack align="stretch" w="110px">
        <NavLink to={`/project/${projectId}/dashboard/analysis`}>基础分析</NavLink>
        <NavLink to={`/project/${projectId}/dashboard/analysis/plugin`}>已安装插件</NavLink>
        <NavLink to={`/project/${projectId}/dashboard/analysis/plugin-market`}>插件市场</NavLink>
        <NavLink to={`/project/${projectId}/dashboard/analysis/heatmap`}>热力图</NavLink>
      </VStack>
      <Box px="20px" flexGrow={1}>
        <Outlet />
      </Box>
    </Flex>
  )
}
export default Analysis
