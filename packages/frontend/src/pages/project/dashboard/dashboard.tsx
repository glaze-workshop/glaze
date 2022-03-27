import React, { FC, memo, useCallback } from 'react'
import { Text, Container, TabPanel, TabPanels, Flex, Tabs, TabList, Tab, Button, Link, HStack } from '@chakra-ui/react'
import { useProjectInfoUnderParam } from '../../../hooks/project.hook'
import { Outlet, useLocation, Link as RouterLink } from 'react-router-dom'

const Dashboard: FC = () => {
  const { projectInfo, projectId } = useProjectInfoUnderParam()

  const dashboardPath = `/project/${projectId}/dashboard`

  return (
    <Container maxW="container.lg">
      <Flex alignItems="center" h="60px">
        {projectInfo
          ? <Text fontSize="2xl" fontWeight="bold">{projectInfo.projectFolder?.team?.name} / {projectInfo.name}</Text>
          : undefined}
      </Flex>
      <HStack gap="20px" mb="20px">
        <Link as={RouterLink} to={`${dashboardPath}`}>总览</Link>
        <Link as={RouterLink} to={`${dashboardPath}/analysis`}>分析</Link>
        <Link as={RouterLink} to={`${dashboardPath}/setting`}>设置</Link>
      </HStack>
      <Outlet />
    </Container>
  )
}

export default memo(Dashboard)
